import { Id } from '@core/common/type/common_types';

export default interface CreateReactionPersistenceDTO {
  post_id: Id;
  reactor_id: Id;
  reaction_type: string;
}
