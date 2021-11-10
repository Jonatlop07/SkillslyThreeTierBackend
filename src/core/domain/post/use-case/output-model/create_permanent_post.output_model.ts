import { PermanentPostContentElement } from '../../entity/type/permanent_post_content_element';

export default interface CreatePermanentPostOutputModel {
  user_id: string;
  content: PermanentPostContentElement[];
}
