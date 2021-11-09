import Create from '@core/common/persistence/create';
import Exists from '@core/common/persistence/exists';
import { PostDTO } from '@core/domain/post/use-case/persistence-dto/post.dto';

export default interface CreateUserAccountGateway
  extends Create<PostDTO>,
    Exists<PostDTO> {}
