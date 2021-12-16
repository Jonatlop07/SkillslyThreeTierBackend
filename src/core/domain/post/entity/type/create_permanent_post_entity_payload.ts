import { PermanentPostContentElement } from './permanent_post_content_element';

export type CreatePermanentPostEntityPayload = {
  id?: string;
  content: Array<PermanentPostContentElement>;
  user_id: string;
  privacy?: string;
};
