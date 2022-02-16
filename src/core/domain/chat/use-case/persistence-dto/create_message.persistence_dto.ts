import { Id } from '@core/common/type/common_types';

export default interface CreateMessagePersistenceDTO {
  owner_id: Id;
  conversation_id: Id;
  content: string;
}
