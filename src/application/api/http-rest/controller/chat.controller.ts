import { Body, Controller, Get, Inject, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import {
  CreateGroupChatConversationDTO,
  CreateSimpleChatConversationDTO
} from '@application/api/http-rest/http-dtos/http_chat.dto';
import { ChatSocketGateway } from '@application/api/socket-gateway/chat.socket_gateway';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateGroupChatConversationAdapter } from '@infrastructure/adapter/use-case/chat/create_group_chat_conversation.adapter';
import { CreateSimpleChatConversationAdapter } from '@infrastructure/adapter/use-case/chat/create_simple_chat_conversation.adapter';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreateSimpleChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_simple_chat_conversation.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import { GetChatMessageCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_message_collection.interactor';
import { GetConversationMessageCollectionAdapter } from '@infrastructure/adapter/use-case/chat/get_conversation_message_collection.adapter';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(
    @Inject(ChatDITokens.CreateSimpleChatConversationInteractor)
    private readonly create_simple_chat_conversation_interactor: CreateSimpleChatConversationInteractor,
    @Inject(ChatDITokens.CreateGroupChatConversationInteractor)
    private readonly create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor,
    @Inject(ChatDITokens.GetChatMessageCollectionInteractor)
    private readonly get_chat_message_collection_interactor: GetChatMessageCollectionInteractor,
    private readonly chat_socket_gateway: ChatSocketGateway
  ) {}

  @Post()
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
  public async createGroupConversation(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateGroupChatConversationDTO
  ) {
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

  @Get(':conversation_id/messages')
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
