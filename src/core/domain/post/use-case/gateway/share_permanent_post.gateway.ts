import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import Share from '@core/domain/post/use-case/persistence/share'; 
import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export interface SharePermanentPostGateway extends Share<PermanentPostQueryModel>, Find<PermanentPostDTO,PermanentPostQueryModel> {}