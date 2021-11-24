import Create from '@core/common/persistence/create';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';

export default interface CreateCommentInPermanentPostGateway extends Create<CommentDTO>{}