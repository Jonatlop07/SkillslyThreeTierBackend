import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '../exception/http_exception.mapper';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { DeleteGroupInteractor } from '@core/domain/group/use-case/interactor/delete_group.interactor';
import { UpdateGroupInteractor } from '@core/domain/group/use-case/interactor/update_group.interactor';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import { DeleteJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/delete_join_group_request.interactor';
import { UpdateGroupUserInteractor } from '@core/domain/group/use-case/interactor/join-request/update_group_user.interactor';
import { CreateGroupAdapter } from '@infrastructure/adapter/use-case/group/create_group.adapter';
import { CreateJoinGroupRequestAdapter } from '@infrastructure/adapter/use-case/group/create_join_group_request.adapter';
import { UpdateGroupUserAdapter } from '@infrastructure/adapter/use-case/group/update_group_user.adapter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeaveGroupInteractor } from '@core/domain/group/use-case/interactor/leave_group.interactor';
import { QueryGroupCollectionInteractor } from '@core/domain/group/use-case/interactor/query_group_collection.interactor';
import { QueryGroupInteractor } from '@core/domain/group/use-case/interactor/query_group.interactor';
import { QueryGroupCollectionAdapter } from '@infrastructure/adapter/use-case/group/query_group_collection.adapter';
import { PaginationDTO } from '../http-dtos/pagination.dto';
import { QueryGroupAdapter } from '@infrastructure/adapter/use-case/group/query_group.adapter';
import { QueryGroupUsersAdapter } from '@infrastructure/adapter/use-case/group/query_group_users.adapter';
import { QueryGroupUsersInteractor } from '@core/domain/group/use-case/interactor/query_group_users.interactor';
import { GetJoinRequestsInteractor } from '@core/domain/group/use-case/interactor/join-request/get_join_requests.interactor';
import { GetJoinRequestsAdapter } from '@infrastructure/adapter/use-case/group/get_join_requests.adapter';
import { Roles } from '../authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/role.enum';

@Controller('groups')
@Roles(Role.User)
@ApiTags('group')
export class GroupController {
  private readonly logger: Logger = new Logger(GroupController.name);

  constructor(
    @Inject(GroupDITokens.CreateGroupInteractor)
    private readonly create_group_interactor: CreateGroupInteractor,
    @Inject(GroupDITokens.DeleteGroupInteractor)
    private readonly delete_group_interactor: DeleteGroupInteractor,
    @Inject(GroupDITokens.UpdateGroupInteractor)
    private readonly update_group_interactor: UpdateGroupInteractor,
    @Inject(GroupDITokens.CreateJoinGroupRequestInteractor)
    private readonly create_join_group_request_interactor: CreateJoinGroupRequestInteractor,
    @Inject(GroupDITokens.DeleteJoinGroupRequestInteractor)
    private readonly delete_join_group_request_interactor: DeleteJoinGroupRequestInteractor,
    @Inject(GroupDITokens.UpdateGroupUserInteractor)
    private readonly update_group_user_interactor: UpdateGroupUserInteractor,
    @Inject(GroupDITokens.LeaveGroupInteractor)
    private readonly leave_group_interactor: LeaveGroupInteractor,
    @Inject(GroupDITokens.QueryGroupCollectionInteractor)
    private readonly query_group_collection_interactor: QueryGroupCollectionInteractor,
    @Inject(GroupDITokens.QueryGroupInteractor)
    private readonly query_group_interactor: QueryGroupInteractor,
    @Inject(GroupDITokens.QueryGroupUsersInteractor)
    private readonly query_group_users_interactor: QueryGroupUsersInteractor,
    @Inject(GroupDITokens.GetJoinRequestsInteractor)
    private readonly get_join_requests_interactor: GetJoinRequestsInteractor
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  public async createGroup( @Body() body, @HttpUser() http_user: HttpUserPayload ){
    try {
      return await this.create_group_interactor.execute(
        CreateGroupAdapter.new({
          owner_id: http_user.id,
          name: body.name,
          description: body.description,
          category: body.category,
          picture: body.picture
        })
      );
    } catch (e){
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put(':group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updateGroup( @HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string, @Body() body ) {
    try {
      return await this.update_group_interactor.execute({
        id: group_id,
        user_id: http_user.id,
        name: body.name,
        description: body.description,
        category: body.category,
        picture: body.picture
      });
    } catch (e){
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete(':group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async deleteGroup( @HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string ) {
    try {
      return await this.delete_group_interactor.execute({ user_id: http_user.id, id: group_id });
    } catch (e) {
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post('join/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createGroupJoinRequest( @HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string ){
    try {
      return await this.create_join_group_request_interactor.execute(
        await CreateJoinGroupRequestAdapter.new({
          user_id: http_user.id,
          group_id: group_id
        })
      );
    } catch (e) {
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put(':action/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updateUserFollowRequest(
  @HttpUser() http_user: HttpUserPayload,
    @Param('action') action: string, 
    @Param('group_id') group_id: string,
    @Body() body
  ){
    try {
      return await this.update_group_user_interactor.execute(
        await UpdateGroupUserAdapter.new({
          owner_id: http_user.id,
          user_id: body.user_id,
          group_id: group_id,
          action: action
        })
      );
    } catch (e) {
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete('join/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async deleteJoinGroupRequest( @HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string ){
    try {
      return await this.delete_join_group_request_interactor.execute({
        user_id: http_user.id,
        group_id: group_id
      });
    } catch (e) {
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete('leave/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async leaveGroup( @HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string ){
    try {
      return await this.leave_group_interactor.execute({
        user_id: http_user.id,
        group_id: group_id
      });
    } catch (e) {
      this.logger.error(e);
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryGroupCollection(@Body() body){
    try {
      return await this.query_group_collection_interactor.execute(
        await QueryGroupCollectionAdapter.new({
          user_id: body.user_id,
          name: body.name,
          category: body.category,
          limit: body.limit,
          offset: body.offset
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryGroup(@HttpUser() http_user: HttpUserPayload, @Param('group_id') group_id: string){
    try {
      return await this.query_group_interactor.execute(
        await QueryGroupAdapter.new({
          user_id: http_user.id,
          group_id: group_id,
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('users/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryGroupUsers(@Query() pagination: PaginationDTO, @Param('group_id') group_id: string ){
    try {
      return await this.query_group_users_interactor.execute(
        await QueryGroupUsersAdapter.new({
          group_id: group_id,
          limit: pagination.limit,
          offset: pagination.offset
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('requests/:group_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async getJoinRequests(@Query() pagination: PaginationDTO, @Param('group_id') group_id: string ){
    try {
      return await this.get_join_requests_interactor.execute(
        await GetJoinRequestsAdapter.new({
          group_id: group_id,
          limit: pagination.limit,
          offset: pagination.offset
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

}


