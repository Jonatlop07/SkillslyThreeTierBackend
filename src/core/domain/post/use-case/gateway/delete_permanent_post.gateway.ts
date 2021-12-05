import Delete from '@core/common/persistence/delete';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';

export default interface QueryPermanentPostCollectionGateway extends Delete<PermanentPostDTO, string> { }