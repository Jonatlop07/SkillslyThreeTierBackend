import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import SharePermanentPostOutputModel from '@core/domain/post/use-case/output-model/share_permanent_post.output_model';

export default interface Share<PermanentPostQueryModel> {
  share(param: PermanentPostQueryModel): Promise<SharePermanentPostOutputModel>; 
}
