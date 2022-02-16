import Update from '@core/common/persistence/update';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export interface UpdatePermanentPostGateway
  extends Update<PermanentPostDTO>, FindOne<PermanentPostQueryModel, PermanentPostDTO> {}
