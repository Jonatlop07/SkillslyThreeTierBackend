import Find from '@core/common/persistence/find';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import TemporalPostQueryModel from '@core/domain/temp-post/use-case/query_model/temporal_post.query_model';

export default interface QueryTemporalPostGateway extends Find<TemporalPostDTO, TemporalPostQueryModel> {
}