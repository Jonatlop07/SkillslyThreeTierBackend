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
  Query, ValidationPipe
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_create_user_account.dto';
import { CreateUserAccountAdapter } from '@application/api/http-rest/http-adapter/user/create_user_account.adapter';
import { SearchUsersAdapter } from '@application/api/http-rest/http-adapter/user/search_users.adapter';
import { GetUserFollowRequestCollectionAdapter } from '@application/api/http-rest/http-adapter/user/follow_request/get_user_follow_request_collection.adapter';
import { CreateUserFollowRequestAdapter } from '@application/api/http-rest/http-adapter/user/follow_request/create_user_follow_request.adapter';
import { UpdateUserFollowRequestAdapter } from '@application/api/http-rest/http-adapter/user/follow_request/update_user_follow_request.adapter';
import { DeleteUserFollowRequestAdapter } from '@application/api/http-rest/http-adapter/user/follow_request/delete_user_follow_request.adapter';
import { UpdateUserAccountResponseDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account_response.dto';
import { UpdateUserAccountAdapter } from '@application/api/http-rest/http-adapter/user/update_user_account.adapter';
import { UpdateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account.dto';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { HttpExceptionMapper } from '../exception/http_exception.mapper';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/interactor/update_user_account.interactor';
import { QueryUserAccountInteractor } from '@core/domain/user/use-case/interactor/query_user_account.interactor';
import { DeleteUserAccountInteractor } from '@core/domain/user/use-case/interactor/delete_user_account.interactor';
import { SearchUsersInteractor } from '@core/domain/user/use-case/interactor/search_users.interactor';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import { UpdateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/update_user_follow_request.interactor';
import { DeleteUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/delete_user_follow_request.interactor';
import { GetUserFollowRequestCollectionInteractor } from '@core/domain/user/use-case/interactor/follow_request/get_user_follow_request_collection.interactor';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreatePrivateChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_private_chat_conversation.interactor';
import { ConversationEventsNames } from '@application/events/conversation.event_names';
import CreateUserFollowRequestOutputModel
  from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import { FollowRequestSentToUserEvent } from '@application/events/user/follow_request_sent_to_user.event';
import { FollowRequestAcceptedEvent } from '@application/events/user/follow_request_accepted.event';
import { FollowRequestDeletedEvent } from '@application/events/user/follow_request_deleted.event';

@Controller('users')
@ApiTags('user')
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    private readonly event_emitter: EventEmitter2,
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
    @Inject(UserDITokens.CreateUserFollowRequestInteractor)
    private readonly create_user_follow_request_interactor: CreateUserFollowRequestInteractor,
    @Inject(UserDITokens.UpdateUserFollowRequestInteractor)
    private readonly update_user_follow_request_interactor: UpdateUserFollowRequestInteractor,
    @Inject(UserDITokens.DeleteUserFollowRequestInteractor)
    private readonly delete_user_follow_request_interactor: DeleteUserFollowRequestInteractor,
    @Inject(UserDITokens.GetUserFollowRequestCollectionInteractor)
    private readonly get_user_follow_request_collection_interactor: GetUserFollowRequestCollectionInteractor,
    @Inject(ChatDITokens.CreatePrivateChatConversationInteractor)
    private readonly create_private_chat_conversation_interactor: CreatePrivateChatConversationInteractor
  ) {
  }

  @Public()
  @Post('account')
  @ApiCreatedResponse({ description: 'User account has been successfully created' })
  @ApiForbiddenResponse({ description: 'Invalid sign up data format' })
  @ApiConflictResponse({ description: 'Tried to create an account that already exists' })
  @HttpCode(HttpStatus.CREATED)
  public async createUserAccount(@Body(new ValidationPipe()) create_user_account_details: CreateUserAccountDTO) {
    try {
      return await this.create_user_account_interactor.execute(
        await CreateUserAccountAdapter.toInputModel(create_user_account_details)
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('account/:user_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User account data successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'Cannot query the data of an account that does not belong to the user' })
  public async queryUserAccount(@HttpUser() http_user: HttpUserPayload, @Param('user_id') user_id: string) {
    if (user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot query an account that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    return await this.query_user_account_interactor.execute({ id: user_id });
  }

  @Put('account/:user_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User account successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Cannot update the data of an account that does not belong to the user' })
  public async updateAccount(
    @HttpUser() http_user: HttpUserPayload,
      @Param('user_id') user_id: string,
      @Body(new ValidationPipe()) update_user_account_details: UpdateUserAccountDTO
  ): Promise<UpdateUserAccountResponseDTO> {
    if (user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot update an account that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    try {
      return UpdateUserAccountAdapter.toResponseDTO(
        await this.update_user_account_interactor.execute(
          UpdateUserAccountAdapter.toInputModel(user_id, update_user_account_details)
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete('account/:user_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  public async deleteUserAccount(@HttpUser() http_user: HttpUserPayload, @Param('user_id') user_id: string) {
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
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Search has been successfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while searching users' })
  public async searchUsers(@Query('email') email: string, @Query('name') name: string) {
    try {
      return await this.search_users_interactor.execute(
        await SearchUsersAdapter.new({
          email: email,
          name: name
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('follow')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Follow Requests has been successfully found' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while finding user follow requests' })
  @ApiBearerAuth()
  public async getUserFollowRequestCollection(@HttpUser() http_user: HttpUserPayload) {
    try {
      return await this.get_user_follow_request_collection_interactor.execute(
        await GetUserFollowRequestCollectionAdapter.new({
          user_id: http_user.id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post('follow/:user_to_follow_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Follow Request has been successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while creating user follow request' })
  @ApiBearerAuth()
  public async createUserFollowRequest(
    @HttpUser() http_user: HttpUserPayload,
    @Param('user_to_follow_id') user_to_follow_id: string
  ) {
    try {
      const result: CreateUserFollowRequestOutputModel = await this.create_user_follow_request_interactor.execute(
        CreateUserFollowRequestAdapter.new({
          user_id: http_user.id,
          user_to_follow_id
        })
      );
      this.event_emitter.emit(
        ConversationEventsNames.FOLLOW_REQUEST_SENT,
        new FollowRequestSentToUserEvent({
          user_to_follow_id,
          user_id: result.user_id,
          user_name: result.name,
          user_email: result.email
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put('follow/:user_to_follow_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Follow Request has been successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while updating user follow request' })
  @ApiConflictResponse({ description: 'The conversation with the user to follow already exists' })
  @ApiBearerAuth()
  public async updateUserFollowRequest(
  @HttpUser() http_user: HttpUserPayload,
    @Param('user_to_follow_id') user_to_follow_id: string,
    @Body('accept') accept: boolean
  ) {
    try {
      const result = await this.update_user_follow_request_interactor.execute(
        UpdateUserFollowRequestAdapter.new({
          user_id: user_to_follow_id,
          user_to_follow_id: http_user.id,
          accept
        })
      );
      if (accept) {
        this.event_emitter.emit(
          ConversationEventsNames.FOLLOW_REQUEST_ACCEPTED,
          new FollowRequestAcceptedEvent({
            user_to_follow_id,
            user_id: result.user_id,
            user_name: result.name,
            user_email: result.email
          })
        );
        return await this.create_private_chat_conversation_interactor.execute({
          user_id: http_user.id,
          partner_id: user_to_follow_id
        });
      }
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete('follow/:user_to_follow_id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Follow Request or Relationship has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while deleting user follow request' })
  @ApiBearerAuth()
  public async deleteUserFollowRequest(
  @HttpUser() http_user: HttpUserPayload,
    @Param('user_to_follow_id') user_to_follow_id: string,
    @Query('is_request') is_request_string: string
  ) {
    try {
      const is_request = is_request_string === 'true';
      const result = await this.delete_user_follow_request_interactor.execute(
        DeleteUserFollowRequestAdapter.new({
          user_id: http_user.id,
          user_to_follow_id,
          is_request
        })
      );
      this.event_emitter.emit(
        ConversationEventsNames.FOLLOW_REQUEST_DELETED,
        new FollowRequestDeletedEvent({
          user_to_follow_id,
          user_id: result.user_id
        })
      );
      return result;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
