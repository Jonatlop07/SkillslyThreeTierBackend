import Update from '@core/common/persistence/update';
import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';

export interface UpdatePermanentPostGateway extends Update<PermanentPostDTO>, Find<PermanentPostDTO, PermanentPostQueryModel> {}
