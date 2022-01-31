import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import Create from '@core/common/persistence/create';

export default interface CreateCommentInCommentGateway extends Create<CommentOfCommentDTO> {
}
