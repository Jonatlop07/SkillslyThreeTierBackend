import Find from '@core/common/persistence/find';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export default interface ValidateCredentialsGateway extends Find<UserDTO> {}
