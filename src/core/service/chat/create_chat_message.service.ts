import { CreateChatMessageInteractor } from '@core/domain/chat/use-case/interactor/create_chat_message.interactor';
import CreateChatMessageInputModel from '@core/domain/chat/use-case/input-model/create_chat_message.input_model';
import CreateChatMessageOutputModel from '@core/domain/chat/use-case/output-model/create_chat_message.output_model';
import { Inject } from '@nestjs/common';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import CreateChatMessageGateway from '@core/domain/chat/use-case/gateway/create_chat_message.gateway';
import { UserDoesNotBelongToConversationChatException } from '@core/domain/chat/use-case/exception/chat.exception';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';

export class CreateChatMessageService implements CreateChatMessageInteractor {
  constructor(
    @Inject(ChatDITokens.ChatMessageRepository)
    private readonly gateway: CreateChatMessageGateway,
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly conversation_gateway: BelongsUserToChatConversationGateway
  ) {}

  async execute(input: CreateChatMessageInputModel): Promise<CreateChatMessageOutputModel> {
    const { user_id, conversation_id, content } = input;
    if (!await this.conversation_gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    return await this.gateway.create({
      user_id, conversation_id, content
    });
  }
}
