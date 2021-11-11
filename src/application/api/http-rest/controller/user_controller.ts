import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { CreateUserAccountAdapter } from '@infrastructure/adapter/use-case/user/create_user_account.adapter';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import {
  CreateUserAccountAlreadyExistsException,
  CreateUserAccountInvalidDataFormatException
} from '@core/service/user/create_user_account.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { SearchUsersInteractor } from '../../../../core/domain/user/use-case/search_users.interactor';
import { SearchUsersAdapter } from '@infrastructure/adapter/use-case/user/search_users.adapter';

@Controller('users')
@ApiTags('user')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    @Inject(UserDITokens.CreateUserAccountInteractor)
    private readonly create_user_account_interactor: CreateUserAccountInteractor,
    @Inject(UserDITokens.SearchUsersInteractor)
    private readonly search_users_interator: SearchUsersInteractor
  ) {}

  @Public()
  @Post('/account')
  @HttpCode(HttpStatus.CREATED)
  public async createUserAccount(@Body() body) {
    try {
      return await this.create_user_account_interactor.execute(
        await CreateUserAccountAdapter.new({
          email: body.email,
          password: body.password,
          name: body.name,
          date_of_birth: body.date_of_birth
        })
      );
    } catch (e) {
      if (e instanceof CreateUserAccountInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid sign up data format'
        }, HttpStatus.FORBIDDEN);
      } else if (e instanceof CreateUserAccountAlreadyExistsException) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: 'Account already exists'
        }, HttpStatus.CONFLICT);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal database error'
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async getUsersInformation(@Body() body) {
    return await this.search_users_interator.execute(
      await SearchUsersAdapter.new({
        email: body.email,
        name: body.name
      })
    );
  }
}
