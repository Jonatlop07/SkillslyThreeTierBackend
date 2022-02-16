import Find from '@core/common/persistence/find';
import TemporalPostQueryModel from '@core/domain/temp-post/use-case/query_model/temporal_post.query_model';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';

export default interface QueryTemporalPostCollectionGateway
  extends Find<TemporalPostQueryModel, TemporalPostDTO> {}
