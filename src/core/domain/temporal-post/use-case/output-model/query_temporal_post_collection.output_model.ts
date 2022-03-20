import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';

export default interface QueryTemporalPostCollectionOutputModel {
  temporal_post_collection: Array<TemporalPostDTO>;
}
