import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import {
  CreateGroupChatConversationDTO,
  CreateSimpleChatConversationDTO
} from '@application/api/http-rest/profile/dtos/http_chat.dto';
import { ChatSocketGateway } from '@application/api/socket-gateway/chat.socket_gateway';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateGroupChatConversationAdapter } from '@infrastructure/adapter/use-case/chat/create_group_chat_conversation.adapter';
import { CreateSimpleChatConversationAdapter } from '@infrastructure/adapter/use-case/chat/create_simple_chat_conversation.adapter';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreateSimpleChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_simple_chat_conversation.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(ChatDITokens.CreateSimpleChatConversationInteractor)
    private readonly create_simple_chat_conversation_interactor: CreateSimpleChatConversationInteractor,
    @Inject(ChatDITokens.CreateGroupChatConversationInteractor)
    private readonly create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor,
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
}
