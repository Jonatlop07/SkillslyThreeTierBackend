import { Id } from '@core/common/type/common_types';

export default interface GetCommentsInPermanentPostInputModel {
  page: number,
  limit: number,
  post_id: Id,
}
