import Delete from '@core/common/persistence/delete';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';

export default interface DeleteTemporalPostGateway extends Delete<TemporalPostDTO, null> {
}