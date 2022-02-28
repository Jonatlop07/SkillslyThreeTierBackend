import { Id } from '@core/common/type/common_types';

export default interface CreatePrivateChatConversationInputModel {
  user_id: Id;
  partner_id: Id;
}
