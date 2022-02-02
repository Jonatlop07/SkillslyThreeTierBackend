import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';

export default interface Share {
  share(param: PermanentPostQueryModel): Promise<void>;
}
