import { Entity } from '@core/common/entity/entity';
import { CreateConversationEntityPayload } from '@core/domain/chat/entity/type/create_conversation_entity_payload';
import { Optional } from '@core/common/type/common_types';

export class Conversation extends Entity<string> {
  private readonly _name: Optional<string>;
  private readonly _members: Array<string>;

  constructor(payload: CreateConversationEntityPayload) {
    super();
    this._id =  payload.id;
    this._name = payload.name;
    this._members = payload.members
      .filter(
        (member_id, index, self) =>
          self.indexOf(member_id) === index
      );
  }
}
