import Update from '@core/common/persistence/update';
import { PostDTO } from '@core/domain/post/use-case/persistence_dto/post.dto';

export interface UpdatePermanentPostGateway extends Update<PostDTO> {}
