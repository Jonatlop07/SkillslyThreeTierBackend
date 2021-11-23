import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import Share from '@core/domain/post/use-case/persistence/share'; 
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import Exists from '@core/common/persistence/exists';

export interface SharePermanentPostGateway extends Share<PermanentPostQueryModel>, Exists<PermanentPostDTO> {}