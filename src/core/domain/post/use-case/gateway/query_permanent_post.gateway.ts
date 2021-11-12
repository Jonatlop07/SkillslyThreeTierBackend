import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';

export default interface QueryPermanentPostGateway
  extends Find<PermanentPostDTO, PermanentPostQueryModel> {}