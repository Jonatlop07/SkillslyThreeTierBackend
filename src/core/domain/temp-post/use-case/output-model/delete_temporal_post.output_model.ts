import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';

export default interface DeleteTemporalPostOutputModel {
  deleted_temporal_post: TemporalPostDTO;
}
