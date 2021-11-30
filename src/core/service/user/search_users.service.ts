import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { SearchUsersInteractor } from '@core/domain/user/use-case/interactor/search_users.interactor';
import SearchUsersOutputModel from '@core/domain/user/use-case/output-model/search_users.output_model';
import SearchUsersInputModel from '@core/domain/user/use-case/input-model/search_users.input_model';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

@Injectable()
export class SearchUsersService implements SearchUsersInteractor {

  private readonly logger: Logger = new Logger(SearchUsersService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private gateway: SearchUsersGateway
  ) {}

  async execute(input: SearchUsersInputModel): Promise<SearchUsersOutputModel> {
    const { email, name } = input;
    const users: Array<SearchedUserDTO> = await this.gateway
      .findAll({ email, name })
      .then((result: UserDTO[]) => {
        return result.map((user: UserDTO) =>
          ({
            email: user.email,
            name: user.name, 
            user_id: user.user_id, 
            date_of_birth: user.date_of_birth
          })
        );
      });
    return { users };
  }
}
