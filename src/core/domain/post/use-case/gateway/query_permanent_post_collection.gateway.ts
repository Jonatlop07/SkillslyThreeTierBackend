import Find from '@core/common/persistence/find';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import GetPublic from '../persistence/get_public';

export default interface QueryPermanentPostCollectionGateway extends Find<PermanentPostDTO, PermanentPostQueryModel>, GetPublic{}
