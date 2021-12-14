import { PermanentPostContentElement } from '../../entity/type/permanent_post_content_element';

export default interface CreatePermanentPostInputModel {
  id?: string;
  content: Array<PermanentPostContentElement>;
  user_id: string;
  privacy?: string;
}