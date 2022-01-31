import { AddMembersToGroupConversationInteractor } from '@core/domain/chat/use-case/interactor/add_members_to_group_conversation.interactor';
import AddMembersToGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/add_members_to_group_conversation.input_model';
import AddMembersToGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/add_members_to_group_conversation.output_model';
import {
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException, UserDoesNotHavePermissionsInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import AddMembersToGroupConversationGateway
  from '@core/domain/chat/use-case/gateway/add_members_to_group_conversation.gateway';
import { Inject, Logger } from '@nestjs/common';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

export class AddMembersToGroupConversationService implements AddMembersToGroupConversationInteractor {
  private readonly logger: Logger = new Logger(AddMembersToGroupConversationService.name);

  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: AddMembersToGroupConversationGateway) {
  }

  public async execute(input: AddMembersToGroupConversationInputModel)
    : Promise<AddMembersToGroupConversationOutputModel> {
    const { user_id, conversation_id, members_to_add } = input;
    if (!await this.gateway.existsById(conversation_id))
      throw new NonExistentConversationChatException();
    if (!await this.gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    if (!await this.gateway.isAdministratorOfTheGroupConversation(user_id, conversation_id))
      throw new UserDoesNotHavePermissionsInConversationChatException();
    const unique_members_to_add = Array.from(new Set(members_to_add));
    const members_not_in_conversation = await Promise.all(
      unique_members_to_add
        .filter(
          async (member) =>
            !await this.gateway.belongsUserToConversation(member, conversation_id)
        )
    );
    const added_members_map = await this.gateway.addMembersToGroupConversation({
      conversation_id,
      members_to_add: members_not_in_conversation
    }).then(
      (added_members: Array<UserDTO>) =>
        added_members.map(
          (added_member: UserDTO) =>
            ({
              user_id: added_member.user_id,
              name: added_member.name
            })
        )
    );
    return {
      added_members: added_members_map,
      conversation: await this.gateway.findOne({
        conversation_id,
        is_private: false
      })
    };
  }
}
