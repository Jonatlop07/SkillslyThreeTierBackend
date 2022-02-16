import TemporalPostQueryModel from '@core/domain/temporal-post/use-case/query_model/temporal_post.query_model';
import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';
import FindAll from '@core/common/persistence/find/find_all';

export default interface QueryTemporalPostCollectionGateway
  extends FindAll<TemporalPostQueryModel, TemporalPostDTO> {}
