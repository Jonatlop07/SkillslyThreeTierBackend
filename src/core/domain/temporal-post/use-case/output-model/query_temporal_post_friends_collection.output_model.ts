import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';

export default interface QueryTemporalPostFriendsCollectionOutputModel {
  temporal_post_friends_collection: Array<TemporalPostDTO>;
}
