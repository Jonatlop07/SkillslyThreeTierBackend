import FindAll from '@core/common/persistence/find_all';
import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import CommentOfCommentQueryModel from '@core/domain/comment/use-case/query-model/comment_of_comment.query_model';

export default interface GetCommentsInCommentGateway extends FindAll<CommentOfCommentQueryModel, CommentOfCommentDTO> {
}
