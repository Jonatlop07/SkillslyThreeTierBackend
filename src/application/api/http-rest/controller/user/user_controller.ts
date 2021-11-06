import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Logger, Post } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountAdapter } from '@infrastructure/adapter/use-case/user/create_user_account.adapter';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import {
  CreateUserAccountAlreadyExistsException,
  CreateUserAccountInvalidDataFormatException
} from '@core/service/user/create_user_account.exception';

@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    @Inject(UserDITokens.CreateUserAccountInteractor)
    private readonly createUserAccountInteractor: CreateUserAccountInteractor
  ) {}

  @Post('account')
  @HttpCode(HttpStatus.CREATED)
  public async createUserAccount(@Body() body: CreateUserAccountAdapter) {
    try {
      return await this.createUserAccountInteractor.execute(
        await CreateUserAccountAdapter.new({
          email: body.email,
          password: body.password,
          name: body.name,
          date_of_birth: body.date_of_birth
        })
      );
    } catch (e) {
      if (e instanceof CreateUserAccountInvalidDataFormatException) {
        throw new HttpException('Invalid sign up data format', HttpStatus.FORBIDDEN);
      } else if (e instanceof CreateUserAccountAlreadyExistsException) {
        throw new HttpException('Account already exists', HttpStatus.CONFLICT);
      }
    }
  }
}
