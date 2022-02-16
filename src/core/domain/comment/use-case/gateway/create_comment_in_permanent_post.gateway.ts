import Create from '@core/common/persistence/create/create';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import CreateCommentPersistenceDTO from '@core/domain/comment/use-case/persistence-dto/create_comment.persistence_dto';

export default interface CreateCommentInPermanentPostGateway
  extends Create<CreateCommentPersistenceDTO, CommentDTO>{}
