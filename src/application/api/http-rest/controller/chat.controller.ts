import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
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
import { CreateSimpleChatConversationAdapter } from '@application/api/http-rest/http-adapter/chat/create_simple_chat_conversation.adapter';
import { CreateGroupChatConversationAdapter } from '@application/api/http-rest/http-adapter/chat/create_group_chat_conversation.adapter';
import { GetConversationMessageCollectionAdapter } from '@application/api/http-rest/http-adapter/chat/get_conversation_message_collection.adapter';
import { CreateSimpleChatConversationDTO } from '@application/api/http-rest/http-dto/chat/http_create_simple_chat_conversation.dto';
import { CreateGroupChatConversationDTO } from '@application/api/http-rest/http-dto/chat/http_create_group_chat_conversation_dto';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreateSimpleChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_simple_chat_conversation.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import { GetChatMessageCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_message_collection.interactor';
import { GetChatConversationCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_conversation_collection.interactor';
import { Role } from '@core/domain/user/entity/role.enum';

@Controller('chat')
@Roles(Role.User)
@ApiTags('chat')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class ChatController {
  private readonly logger: Logger = new Logger(ChatController.name);

  constructor(
    @Inject(ChatDITokens.CreateSimpleChatConversationInteractor)
    private readonly create_simple_chat_conversation_interactor: CreateSimpleChatConversationInteractor,
    @Inject(ChatDITokens.CreateGroupChatConversationInteractor)
    private readonly create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor,
    @Inject(ChatDITokens.GetChatConversationCollectionInteractor)
    private readonly get_chat_conversation_collection_interactor: GetChatConversationCollectionInteractor,
    @Inject(ChatDITokens.GetChatMessageCollectionInteractor)
    private readonly get_chat_message_collection_interactor: GetChatMessageCollectionInteractor
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The private conversation was successfully created' })
  @ApiConflictResponse({ description: 'The chat conversation already exists' })
  public async createSimpleConversation(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateSimpleChatConversationDTO
  ) {
    try {
      return CreateSimpleChatConversationAdapter.toResponseDTO(
        await this.create_simple_chat_conversation_interactor.execute({
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
}
