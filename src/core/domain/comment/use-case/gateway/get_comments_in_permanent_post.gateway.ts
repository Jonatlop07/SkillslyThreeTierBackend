import Get from '@core/common/persistence/get';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';

export default interface GetCommentInPermanentPostGateway extends Get<Array<CommentDTO> | Array<GetCommentsInPermanentPostOutputModel>> {
}