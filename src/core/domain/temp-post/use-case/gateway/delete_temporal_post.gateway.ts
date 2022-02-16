import Delete from '@core/common/persistence/delete';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import Find from '@core/common/persistence/find';
import TemporalPostQueryModel from '@core/domain/temp-post/use-case/query_model/temporal_post.query_model';

export default interface DeleteTemporalPostGateway
  extends Delete<TemporalPostDTO, null>, Find<TemporalPostDTO, TemporalPostQueryModel> {}
