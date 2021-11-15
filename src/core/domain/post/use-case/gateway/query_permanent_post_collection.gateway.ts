import Find from '@core/common/persistence/find';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export default interface QueryPermanentPostCollectionGateway extends Find<PermanentPostDTO, PermanentPostQueryModel> {}