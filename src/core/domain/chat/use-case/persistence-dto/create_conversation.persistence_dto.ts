import { Id } from '@core/common/type/common_types';

export default interface CreateConversationPersistenceDTO {
  creator_id: Id;
  name: string;
  members: Array<Id>;
  is_private: boolean;
}
