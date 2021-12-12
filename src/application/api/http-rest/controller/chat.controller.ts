import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post, Put,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { CreatePrivateChatConversationAdapter } from '@application/api/http-rest/http-adapter/chat/create_private_chat_conversation.adapter';
import { CreateGroupChatConversationAdapter } from '@application/api/http-rest/http-adapter/chat/create_group_chat_conversation.adapter';
import { GetConversationMessageCollectionAdapter } from '@application/api/http-rest/http-adapter/chat/get_conversation_message_collection.adapter';
import { CreatePrivateChatConversationDTO } from '@application/api/http-rest/http-dto/chat/http_create_private_chat_conversation.dto';
import { CreateGroupChatConversationDTO } from '@application/api/http-rest/http-dto/chat/http_create_group_chat_conversation_dto';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreatePrivateChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_private_chat_conversation.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import { GetChatMessageCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_message_collection.interactor';
import { GetChatConversationCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_conversation_collection.interactor';
import { Role } from '@core/domain/user/entity/role.enum';
import { AddMembersToGroupConversationDTO } from '@application/api/http-rest/http-dto/chat/http_add_members_to_group_conversation.dto';
import { AddMembersToGroupConversationAdapter } from '@application/api/http-rest/http-adapter/chat/add_members_to_group_conversation.adapter';
import { AddMembersToGroupConversationInteractor } from '@core/domain/chat/use-case/interactor/add_members_to_group_conversation.interactor';
import { UpdateGroupConversationDetailsInteractor } from '@core/domain/chat/use-case/interactor/update_group_conversation_details.interactor';
import { UpdateGroupConversationDetailsAdapter } from '@application/api/http-rest/http-adapter/chat/update_group_conversation_details.adapter';
import { UpdateGroupConversationDetailsDTO } from '@application/api/http-rest/http-dto/chat/http_update_group_conversation_details.dto';

@Controller('chat')
@Roles(Role.User)
@ApiTags('chat')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class ChatController {
  private readonly logger: Logger = new Logger(ChatController.name);

  constructor(
    @Inject(ChatDITokens.CreatePrivateChatConversationInteractor)
    private readonly create_private_chat_conversation_interactor: CreatePrivateChatConversationInteractor,
    @Inject(ChatDITokens.CreateGroupChatConversationInteractor)
    private readonly create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor,
    @Inject(ChatDITokens.GetChatConversationCollectionInteractor)
    private readonly get_chat_conversation_collection_interactor: GetChatConversationCollectionInteractor,
    @Inject(ChatDITokens.GetChatMessageCollectionInteractor)
    private readonly get_chat_message_collection_interactor: GetChatMessageCollectionInteractor,
    @Inject(ChatDITokens.AddMembersToGroupConversationInteractor)
    private readonly add_members_to_group_conversation_interactor: AddMembersToGroupConversationInteractor,
    @Inject(ChatDITokens.UpdateGroupConversationDetailsInteractor)
    private readonly update_group_conversation_details_interactor: UpdateGroupConversationDetailsInteractor
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The private conversation was successfully created' })
  @ApiConflictResponse({ description: 'The chat conversation already exists' })
  public async createPrivateConversation(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreatePrivateChatConversationDTO
  ) {
    try {
      return CreatePrivateChatConversationAdapter.toResponseDTO(
        await this.create_private_chat_conversation_interactor.execute({
          user_id: http_user.id,
          partner_id: body.partner_id,
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post('group')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The group conversation was successfully created' })
  @ApiBadRequestResponse({ description: 'Cannot create a group conversation with no members' })
  public async createGroupConversation(
  @HttpUser() http_user: HttpUserPayload, @Body(new ValidationPipe()) body: CreateGroupChatConversationDTO) {
    try {
      return CreateGroupChatConversationAdapter.toResponseDTO(
        await this.create_group_chat_conversation_interactor.execute(
          CreateGroupChatConversationAdapter.toInputModel(body)
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The chat conversations were successfully retrieved' })
  public async getChatConversations(@HttpUser() http_user: HttpUserPayload) {
    try {
      return await this.get_chat_conversation_collection_interactor.execute({
        user_id: http_user.id
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':conversation_id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The chat messages were successfully retrieved' })
  @ApiNotFoundResponse({ description: 'The chat conversation does not exist' })
  @ApiUnauthorizedResponse(
    {
      description: 'The user that requested the messages does not belong to the conversation'
    }
  )
  public async getConversationMessageCollection(
    @HttpUser() http_user: HttpUserPayload,
    @Param('conversation_id') conversation_id: string
  ) {
    try {
      return GetConversationMessageCollectionAdapter.toResponseDTO(
        await this.get_chat_message_collection_interactor.execute({
          user_id: http_user.id,
          conversation_id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put('group/:conversation_id/add-members')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The members were successfully added to the conversation' })
  @ApiNotFoundResponse( { description: 'The conversation does not exists' })
  @ApiUnauthorizedResponse({ description: 'The user cannot add members to a conversation they does not belong to' })
  public async addMembersToGroupConversation(
    @HttpUser() http_user: HttpUserPayload,
    @Param('conversation_id') conversation_id: string,
    @Body(new ValidationPipe()) body: AddMembersToGroupConversationDTO
  ) {
    try {
      return AddMembersToGroupConversationAdapter.toResponseDTO(
        await this.add_members_to_group_conversation_interactor.execute(
          {
            user_id: http_user.id,
            conversation_id,
            members_to_add: body.members_to_add
          }
        )
      );
    } catch (e) {
      HttpExceptionMapper.toHttpException(e);
    }
  }

  @Patch('group/:conversation_id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The details of the group conversation were successfully updated' })
  @ApiNotFoundResponse( { description: 'The group conversation does not exists' })
  @ApiUnauthorizedResponse({ description: 'The user cannot edit the details of a group conversation they does not belong to' })
  @ApiBadRequestResponse({ description: 'The user provided the details of the group conversation in an invalid format' })
  public async updateGroupConversationDetails(
    @HttpUser() http_user: HttpUserPayload,
    @Param('conversation_id') conversation_id: string,
    @Body(new ValidationPipe()) body: UpdateGroupConversationDetailsDTO
  ) {
    try {
      return UpdateGroupConversationDetailsAdapter.toResponseDTO(
        await this.update_group_conversation_details_interactor.execute({
          user_id: http_user.id,
          conversation_id,
          conversation_name: body.conversation_name
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
