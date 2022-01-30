import Share from '@core/domain/post/use-case/persistence/share';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import Find from '@core/common/persistence/find';

export interface SharePermanentPostGateway extends Share, Find<PermanentPostDTO, PermanentPostQueryModel> {}
