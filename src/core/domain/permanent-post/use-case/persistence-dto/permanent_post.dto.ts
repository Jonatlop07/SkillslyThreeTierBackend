import { PermanentPostContentElement } from '../../entity/type/permanent_post_content_element';
import { Id } from '@core/common/type/common_types';

export interface PermanentPostDTO {
  post_id?: Id;
  content: Array<PermanentPostContentElement>;
  owner_id?: Id;
  created_at?: string;
  updated_at?: string;
  privacy?: string;
  group_id?: Id;
}
