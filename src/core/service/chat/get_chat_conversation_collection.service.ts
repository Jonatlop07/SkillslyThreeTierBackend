import { Inject } from '@nestjs/common';
import { GetChatConversationCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_conversation_collection.interactor';
import GetChatConversationCollectionInputModel
  from '@core/domain/chat/use-case/input-model/get_chat_conversation_collection.input_model';
import GetChatConversationCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_conversation_collection.output_model';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import GetChatConversationCollectionGateway
  from '@core/domain/chat/use-case/gateway/get_chat_conversation_collection.gateway';

export class GetChatConversationCollectionService implements GetChatConversationCollectionInteractor {
  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: GetChatConversationCollectionGateway
  ) {}

  public async execute(input: GetChatConversationCollectionInputModel): Promise<GetChatConversationCollectionOutputModel> {
    const { user_id } = input;
    return {
      conversations: await this.gateway.findAll({ user_id })
    };
  }
}
