import Exists from '@core/common/persistence/exists';
import Share from '@core/domain/post/use-case/persistence/share';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export interface SharePermanentPostGateway extends Share, Exists<PermanentPostDTO> {}
