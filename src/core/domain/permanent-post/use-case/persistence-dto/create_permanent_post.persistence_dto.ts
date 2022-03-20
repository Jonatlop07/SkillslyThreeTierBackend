import { PermanentPostContentElement } from '@core/domain/permanent-post/entity/type/permanent_post_content_element';
import { Id } from '@core/common/type/common_types';

export default interface CreatePermanentPostPersistenceDTO {
  content: Array<PermanentPostContentElement>;
  owner_id: Id;
  privacy: string;
  group_id?: Id;
}
