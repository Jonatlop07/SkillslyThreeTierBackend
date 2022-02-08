import CreateCommentInCommentGateway from '@core/domain/comment/use-case/gateway/create_comment_in_comment.gateway';
import GetCommentsInCommentGateway from '@core/domain/comment/use-case/gateway/get_comment_in_comments.gateway';

export default interface CommentInCommentRepository extends CreateCommentInCommentGateway, GetCommentsInCommentGateway {
}
