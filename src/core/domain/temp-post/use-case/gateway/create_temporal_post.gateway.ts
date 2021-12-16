import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import Create from '@core/common/persistence/create';

export default interface CreateTemporalPostGateway extends Create<TemporalPostDTO> {
}