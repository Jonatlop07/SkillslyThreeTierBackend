import CreateCommentInPermanentPostGateway
  from '@core/domain/comment/use-case/gateway/create_comment_in_permanent_post.gateway';
import GetCommentInPermanentPostGateway
  from '@core/domain/comment/use-case/gateway/get_comments_in_permanent_post.gateway';

export default interface CommentRepository extends CreateCommentInPermanentPostGateway, GetCommentInPermanentPostGateway {
}