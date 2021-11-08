import { User } from '@core/domain/user/entity/user';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export class UserMapper {
  public static toUserDTO(user: User): UserDTO {
    return {
      user_id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      date_of_birth: user.date_of_birth
    };
  }

  public static toUser(user_dto: UserDTO): User {
    return new User({
      id: user_dto.user_id,
      email: user_dto.email,
      password: user_dto.password,
      name: user_dto.name,
      date_of_birth: user_dto.date_of_birth
    });
  }
}
