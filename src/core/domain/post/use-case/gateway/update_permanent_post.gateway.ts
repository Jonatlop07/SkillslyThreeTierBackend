import Update from '@core/common/persistence/update';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import Find from '@core/common/persistence/find';

export interface UpdatePermanentPostGateway extends Update<PermanentPostDTO>, Find<PermanentPostDTO> {}
