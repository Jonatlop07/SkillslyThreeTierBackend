import { Id } from '@core/common/type/common_types';

export default interface CreateGroupChatConversationInputModel {
  creator_id: Id;
  conversation_name: string;
  conversation_members: Array<Id>;
}
