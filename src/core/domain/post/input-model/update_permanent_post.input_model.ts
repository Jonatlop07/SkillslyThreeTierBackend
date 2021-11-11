import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_content_post_element';

export default interface UpdatePermanentPostInputModel {
  id: string;
  content: PermanentPostContentElement[];
  user_id: string;
}
