import { Inject } from '@nestjs/common';
import { CreateSimpleChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_simple_chat_conversation.interactor';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import CreateSimpleChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_simple_chat_conversation.input_model';
import CreateSimpleChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_simple_chat_conversation.output_model';
import CreateSimpleChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_simple_chat_conversation.gateway';
import { SimpleConversationAlreadyExistsChatException } from '@core/domain/chat/use-case/exception/chat.exception';

export class CreateSimpleChatConversationService implements CreateSimpleChatConversationInteractor {

  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: CreateSimpleChatConversationGateway
  ) {}

  async execute(input: CreateSimpleChatConversationInputModel): Promise<CreateSimpleChatConversationOutputModel> {
    const { user_id, partner_id } = input;
    if (await this.gateway.existsSimpleConversationWithUser(user_id, partner_id))
      throw new SimpleConversationAlreadyExistsChatException();
    return await this.gateway.create({
      members: [user_id, partner_id],
      messages: []
    });
  }
}
