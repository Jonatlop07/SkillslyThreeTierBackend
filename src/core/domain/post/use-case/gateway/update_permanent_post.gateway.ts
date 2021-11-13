import Update from '@core/common/persistence/update';
import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export interface UpdatePermanentPostGateway extends Update<PermanentPostDTO>, Find<PermanentPostDTO> {}
