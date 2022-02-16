import Share from '@core/domain/permanent-post/use-case/persistence/share';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import Find from '@core/common/persistence/find';

export interface SharePermanentPostGateway extends Share, Find<PermanentPostDTO, PermanentPostQueryModel> {}
