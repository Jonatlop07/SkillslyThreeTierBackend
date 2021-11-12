import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '../persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';

export default interface QueryPermanentPostCollectionGateway extends Find<PermanentPostDTO, PermanentPostQueryModel>{

}