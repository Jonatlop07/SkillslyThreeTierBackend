import { Entity } from '@core/common/entity/entity';
import {
  CreatePermanentPostEntityPayload
} from '@core/domain/permanent-post/entity/type/create_permanent_post_entity_payload';
import { PermanentPostContentElement } from '@core/domain/permanent-post/entity/type/permanent_content_post_element';
import { Id } from '@core/common/type/common_types';

export class PermanentPost extends Entity<Id> {
  private readonly _content: PermanentPostContentElement[];
  private readonly _owner_id: Id;
  private readonly _privacy: string;
  private readonly _group_id: Id;

  constructor(payload: CreatePermanentPostEntityPayload) {
    super();
    const { id, content, owner_id, privacy, group_id } = payload;
    this._id = id;
    this._content = content;
    this._owner_id = owner_id;
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

  get owner_id() {
    return this._owner_id;
  }

  get privacy(){
    return this._privacy;
  }

}
