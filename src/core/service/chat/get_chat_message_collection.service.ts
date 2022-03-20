import { Inject } from '@nestjs/common';
import { GetChatMessageCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_message_collection.interactor';
import GetChatMessageCollectionInputModel
  from '@core/domain/chat/use-case/input-model/get_chat_message_collection.input_model';
import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import GetChatMessageCollectionGateway from '@core/domain/chat/use-case/gateway/get_chat_message_collection.gateway';
import {
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export class GetChatMessageCollectionService implements GetChatMessageCollectionInteractor {
  constructor(
    @Inject(ChatDITokens.ChatMessageRepository)
    private readonly gateway: GetChatMessageCollectionGateway,
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly conversation_gateway: BelongsUserToChatConversationGateway
  ) {}

  public async execute(input: GetChatMessageCollectionInputModel): Promise<GetChatMessageCollectionOutputModel> {
    const { user_id, conversation_id, pagination } = input;
    if (!await this.conversation_gateway.exists({ conversation_id }))
      throw new NonExistentConversationChatException();
    if (!await this.conversation_gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    const messages: Array<MessageDTO> = await this.gateway.findAll({ conversation_id }, pagination);
    return {
      messages
    };
  }
}
