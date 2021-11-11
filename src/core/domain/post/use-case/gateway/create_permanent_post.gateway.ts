import Create from '@core/common/persistence/create';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export default interface CreatePermanentPostGateway extends Create<PermanentPostDTO> {}
