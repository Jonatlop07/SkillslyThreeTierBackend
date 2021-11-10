import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put
} from '@nestjs/common';
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
import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/update_user_account.interactor';
import { UserAccountInvalidDataFormatException } from '@core/service/user/user_account.exception';

@Controller('users/account')
@ApiTags('user')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    @Inject(UserDITokens.CreateUserAccountInteractor)
    private readonly create_user_account_interactor: CreateUserAccountInteractor,
    @Inject(UserDITokens.UpdateUserAccountInteractor)
    private readonly update_user_account_interactor: UpdateUserAccountInteractor
  ) {
  }

  @Public()
  @Post()
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
      }
      throw new HttpException({
        status: HttpStatus.BAD_GATEWAY,
        error: 'Internal database error'
      }, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public getAccountInformation(@HttpUser() http_user: HttpUserPayload) {
    return http_user.id;
  }

  @Put(':user_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updateAccount(@HttpUser() http_user: HttpUserPayload,
    @Param('user_id') user_id: string,
    @Body() body
  ) {
    if (user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot update an account that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    try {
      return await this.update_user_account_interactor.execute({
        id: user_id,
        email: body.email,
        password: body.password,
        name: body.name,
        date_of_birth: body.date_of_birth
      });
    } catch (e) {
      this.logger.error(e);
      if (e instanceof UserAccountInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid update data format'
        }, HttpStatus.FORBIDDEN);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal database error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
