import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_post_content_element';

export default interface QueryPermanentPostOutputModel {
  post_id: string;
  user_id: string;
  user_name?: string;
  content: Array<PermanentPostContentElement>;
  privacy?: string
}
