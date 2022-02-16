import { Id } from '@core/common/type/common_types';

export default interface CreateChatMessageInputModel {
  owner_id: Id;
  conversation_id: Id;
  content: string;
}
