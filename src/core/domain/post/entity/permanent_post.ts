import { Entity } from '@core/common/entity/entity';
import {
  CreatePermanentPostEntityPayload
} from '@core/domain/post/entity/type/create_permanent_post_entity_payload';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_content_post_element';

export class PermanentPost extends Entity<string> {
  private readonly _content: PermanentPostContentElement[];
  private readonly _user_id: string;
  private readonly _privacy: string;
  private readonly _group_id: string;

  constructor(payload: CreatePermanentPostEntityPayload) {
    super();
    const { id, content, user_id, privacy, group_id } = payload;
    this._id = id;
    this._content = content;
    this._user_id = user_id;
    this._privacy = privacy ? privacy : 'public';
    this._group_id = group_id ?  group_id: undefined;
  }

  public hasNonEmptyContent() {
    return this._content.every(
      (content_element: PermanentPostContentElement) => {
        const { description, reference, reference_type } = content_element;
        return description && description.length > 0 ||
          reference && reference.length > 0 && reference_type && reference_type.length > 0;
      }
    );
  }

  get content() {
    return this._content;
  }

  get user_id() {
    return this._user_id;
  }
  
  get privacy(){
    return this._privacy; 
  }
  
}