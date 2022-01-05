import { PermanentPostContentElement } from '../../entity/type/permanent_post_content_element';

export interface PermanentPostDTO {
  post_id?: string;
  content: Array<PermanentPostContentElement>;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  privacy?: string;
  group_id?: string;
}