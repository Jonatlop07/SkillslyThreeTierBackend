import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';
import TemporalPostQueryModel from '@core/domain/temporal-post/use-case/query_model/temporal_post.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface QueryTemporalPostGateway
  extends FindOne<TemporalPostQueryModel, TemporalPostDTO> {
}
