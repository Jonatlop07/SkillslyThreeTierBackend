import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';

export default interface QueryTemporalPostOutputModel {
  temporal_post: TemporalPostDTO;
}
