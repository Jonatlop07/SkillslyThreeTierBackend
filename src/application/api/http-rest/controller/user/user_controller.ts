import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { CreateUserAccountAdapter } from '@infrastructure/adapter/use-case/user/create_user_account.adapter';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserAccountInteractor)
    private readonly createUserAccountInteractor: CreateUserAccountInteractor
  ) {}

  @Post('account')
  @HttpCode(HttpStatus.CREATED)
  public async createUserAccount(@Body() body) {
    return await this.createUserAccountInteractor.execute(await CreateUserAccountAdapter.new({
      email: body.email,
      password: body.password,
      name: body.name,
      date_of_birth: body.date_of_birth
    }));
  }
}
