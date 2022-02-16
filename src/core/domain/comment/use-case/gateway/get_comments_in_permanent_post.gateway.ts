import FindAll from '@core/common/persistence/find/find_all';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import CommentQueryModel from '@core/domain/comment/use-case/query-model/comment.query_model';

export default interface GetCommentInPermanentPostGateway
  extends FindAll<CommentQueryModel, CommentDTO> {}
