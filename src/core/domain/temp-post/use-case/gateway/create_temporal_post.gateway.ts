import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import Create from '@core/common/persistence/create/create';
import CreateTemporalPostPersistenceDTO
  from '@core/domain/temp-post/use-case/persistence-dto/create_temporal_post.persistence_dto';

export default interface CreateTemporalPostGateway
  extends Create<CreateTemporalPostPersistenceDTO, TemporalPostDTO> {
}
