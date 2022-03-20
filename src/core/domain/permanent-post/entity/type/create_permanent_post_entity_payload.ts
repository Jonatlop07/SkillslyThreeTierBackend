import { PermanentPostContentElement } from './permanent_post_content_element';
import { Id } from '@core/common/type/common_types';

export type CreatePermanentPostEntityPayload = {
  id?: Id;
  content: Array<PermanentPostContentElement>;
  owner_id: Id;
  privacy?: string;
  group_id?: Id;
};
