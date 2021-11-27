import { Message } from '@core/domain/chat/entity/message';
import { Optional } from '@core/common/type/common_types';

export type CreateConversationEntityPayload = {
  id?: string;
  name?: Optional<string>;
  members: Array<string>;
  messages: Array<Message>;
};
