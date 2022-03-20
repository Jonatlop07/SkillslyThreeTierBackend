import Create from '@core/common/persistence/create';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import CreatePermanentPostPersistenceDTO
  from '@core/domain/permanent-post/use-case/persistence-dto/create_permanent_post.persistence_dto';

export default interface CreatePermanentPostGateway
  extends Create<CreatePermanentPostPersistenceDTO, PermanentPostDTO> {}
