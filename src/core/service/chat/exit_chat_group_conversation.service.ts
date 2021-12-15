import { Inject } from '@nestjs/common';
import { ExitChatGroupConversationInteractor }
  from '@core/domain/chat/use-case/interactor/exit_chat_group_conversation.interactor';
import ExitChatGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/exit_chat_group_conversation.input_model';
import ExitChatGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/exit_chat_group_conversation.output_model';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import ExitChatGroupConversationGateway from '@core/domain/chat/use-case/gateway/exit_chat_group_conversation.gateway';
import {
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';

export class ExitChatGroupConversationService implements ExitChatGroupConversationInteractor {
  constructor(
    @Inject(ChatDITokens)
    private readonly gateway: ExitChatGroupConversationGateway
  ) {}

  public async execute(input: ExitChatGroupConversationInputModel)
    : Promise<ExitChatGroupConversationOutputModel> {
    const { user_id, conversation_id } = input;
    if (!await this.gateway.existsById(conversation_id))
      throw new NonExistentConversationChatException();
    if (!await this.gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    await this.gateway.exit(user_id, conversation_id);
    return {};
  }
}
