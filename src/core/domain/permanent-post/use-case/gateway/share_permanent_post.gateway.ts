import Share from '@core/domain/permanent-post/use-case/persistence/share';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import FindOne from '@core/common/persistence/find_one';

export interface SharePermanentPostGateway
  extends Share, FindOne<PermanentPostQueryModel, PermanentPostDTO> {}
