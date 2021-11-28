import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateUserAccountAdapter } from '@infrastructure/adapter/use-case/user/create_user_account.adapter';
import { SearchUsersAdapter } from '@infrastructure/adapter/use-case/user/search_users.adapter';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/interactor/update_user_account.interactor';
import { QueryUserAccountInteractor } from '@core/domain/user/use-case/interactor/query_user_account.interactor';
import { DeleteUserAccountInteractor } from '@core/domain/user/use-case/interactor/delete_user_account.interactor';
import { SearchUsersInteractor } from '@core/domain/user/use-case/interactor/search_users.interactor';
import {
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException
} from '@core/domain/user/use-case/exception/user_account.exception';

@Controller('users')
@ApiTags('user')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    @Inject(UserDITokens.CreateUserAccountInteractor)
    private readonly create_user_account_interactor: CreateUserAccountInteractor,
    @Inject(UserDITokens.UpdateUserAccountInteractor)
    private readonly update_user_account_interactor: UpdateUserAccountInteractor,
    @Inject(UserDITokens.QueryUserAccountInteractor)
    private readonly query_user_account_interactor: QueryUserAccountInteractor,
    @Inject(UserDITokens.DeleteUserAccountInteractor)
    private readonly delete_user_account_interactor: DeleteUserAccountInteractor,
    @Inject(UserDITokens.SearchUsersInteractor)
    private readonly search_users_interactor: SearchUsersInteractor,
  ) {}

  @Public()
  @Post('account')
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
      if (e instanceof UserAccountInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid sign up data format'
        }, HttpStatus.FORBIDDEN);
      } else if (e instanceof UserAccountAlreadyExistsException) {
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

  @Get('account/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryUserAccount(
    @HttpUser() http_user: HttpUserPayload,
    @Param('user_id') user_id: string
  ) {
    if (user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot query an account that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    return await this.query_user_account_interactor.execute({ id: user_id });
  }

  @Put('account/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updateAccount(
    @HttpUser() http_user: HttpUserPayload,
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

  @Delete('account/:user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  public async deleteUserAccount(
    @HttpUser() http_user: HttpUserPayload,
    @Param('user_id') user_id: string
  ) {
    if (user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot update an account that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    try {
      return await this.delete_user_account_interactor.execute({ id: user_id });
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal database error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Search has been sucessfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while searching users' })
  public async searchUsers(
    @Query('email') email: string,
    @Query('name') name: string,
  ) {
    try{
      return await this.search_users_interactor.execute(
        await SearchUsersAdapter.new({
          email: email,
          name: name
        })
      );
    } catch (e) {
      this.logger.error(e.stack);
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
