import { PermanentPostContentElement } from '@core/domain/permanent-post/entity/type/permanent_content_post_element';

export default interface UpdatePermanentPostInputModel {
  id: string;
  content: Array<PermanentPostContentElement>;
  privacy: string;
  owner_id: string;
}
