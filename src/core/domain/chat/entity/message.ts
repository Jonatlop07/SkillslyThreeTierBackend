import { CreateMessagePayload } from '@core/domain/chat/entity/type/create_message_payload';

export class Message {
  private readonly _user_id: string;
  private readonly _content: string;
  private readonly _created_at: string;

  constructor(payload: CreateMessagePayload) {
    this._user_id = payload.user_id;
    this._content = payload.content;
    this._created_at = payload.created_at;
  }

  get user_id() {
    return this._user_id;
  }

  get content() {
    return this._content;
  }

  get created_at() {
    return this._created_at;
  }
}
