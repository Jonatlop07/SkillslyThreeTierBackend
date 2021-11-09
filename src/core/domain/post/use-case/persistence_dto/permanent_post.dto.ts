import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_content_post_element';

export interface PermanentPostDTO {
  post_id?: string;
  content: PermanentPostContentElement[];
  user_id: string;
  created_at?: string,
  updated_at?: string
}
