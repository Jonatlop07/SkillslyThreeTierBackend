import { Inject } from '@nestjs/common';
import { DeleteChatGroupConversationInteractor } from '@core/domain/chat/use-case/interactor/delete_chat_group_conversation.interactor';
import DeleteChatGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/delete_chat_group_conversation.input_model';
import DeleteChatGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/delete_chat_group_conversation.output_model';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import DeleteChatGroupConversationGateway
  from '@core/domain/chat/use-case/gateway/delete_chat_group_conversation.gateway';
import {
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException, UserDoesNotHavePermissionsInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';

export class DeleteChatGroupConversationService implements DeleteChatGroupConversationInteractor {
  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: DeleteChatGroupConversationGateway
  ) {}

  public async execute(input: DeleteChatGroupConversationInputModel)
    : Promise<DeleteChatGroupConversationOutputModel> {
    const { user_id, conversation_id } = input;
    const conversation_to_delete = await this.gateway.findOne( { conversation_id });
    if (!conversation_to_delete)
      throw new NonExistentConversationChatException();
    if (!await this.gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    if (!await this.gateway.isAdministratorOfTheGroupConversation(user_id, conversation_id))
      throw new UserDoesNotHavePermissionsInConversationChatException();
    await this.gateway.deleteById(conversation_id);
    return {
      conversation_id: conversation_to_delete.conversation_id,
      conversation_members: conversation_to_delete.conversation_members
        .map((member) => member.member_id)
    };
  }
}
