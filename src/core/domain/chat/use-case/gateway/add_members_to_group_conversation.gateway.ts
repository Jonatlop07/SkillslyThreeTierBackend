import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { AddMembersToGroupConversationDTO } from '@core/domain/chat/use-case/persistence-dto/add_members_to_group_conversation.dto';

export default interface AddMembersToGroupConversationGateway
  extends BelongsUserToChatConversationGateway {
  addMembersToGroupConversation(dto: AddMembersToGroupConversationDTO): Promise<Array<UserDTO>>
}
