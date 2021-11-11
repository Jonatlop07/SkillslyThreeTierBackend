import Find from '@core/common/persistence/find';
import { UserDTO } from '../persistence-dto/user.dto';

export default interface SearchUsersGateway extends Find<UserDTO> {}