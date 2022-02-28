import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import Create from '@core/common/persistence/create/create';
import CreateCommentInCommentPersistenceDTO
  from '@core/domain/comment/use-case/persistence-dto/create_comment_in_comment.persistence_dto';

export default interface CreateCommentInCommentGateway
  extends Create<CreateCommentInCommentPersistenceDTO, CommentOfCommentDTO> {}
