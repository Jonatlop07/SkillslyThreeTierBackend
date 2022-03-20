import { PermanentPostContentElement } from '../../entity/type/permanent_post_content_element';
import { Id } from '@core/common/type/common_types';

export default interface CreatePermanentPostInputModel {
  content: Array<PermanentPostContentElement>;
  owner_id: Id;
  privacy: string;
  group_id?: Id;
}
