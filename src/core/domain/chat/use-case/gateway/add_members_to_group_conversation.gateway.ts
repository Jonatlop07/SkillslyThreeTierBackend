import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { AddMembersToGroupConversationDTO } from '@core/domain/chat/use-case/persistence-dto/add_members_to_group_conversation.dto';
import Find from '@core/common/persistence/find';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import IsAdministratorOfTheGroupConversation
  from '@core/domain/chat/use-case/persistence/is_administrator_of_the_group_conversation';

export default interface AddMembersToGroupConversationGateway
  extends BelongsUserToChatConversationGateway,
    IsAdministratorOfTheGroupConversation,
    Find<ConversationDetailsDTO, ConversationQueryModel> {
  addMembersToGroupConversation(dto: AddMembersToGroupConversationDTO): Promise<Array<UserDTO>>;
}
