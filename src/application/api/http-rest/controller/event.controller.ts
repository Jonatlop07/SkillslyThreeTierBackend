import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { CreateEventInteractor } from "@core/domain/event/use-case/interactor/create_event.interactor";
import { GetEventCollectionOfFriendsInteractor } from "@core/domain/event/use-case/interactor/get_event_collection_of_friends.interactor";
import { GetMyEventCollectionInteractor } from "@core/domain/event/use-case/interactor/get_my_event_collection.interactor";
import { Role } from "@core/domain/user/entity/role.enum";
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Param, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { HttpUser } from "../authentication/decorator/http_user";
import { HttpUserPayload } from "../authentication/types/http_authentication_types";
import { Roles } from "../authorization/decorator/roles.decorator";
import { HttpExceptionMapper } from "../exception/http_exception.mapper";
import { CreateEventAdapter } from "../http-adapter/event/create_event.adapter";
import { GetEventOfFriendsCollectionAdapter } from "../http-adapter/event/get_event_collection_of_friends.adapter";
import { GetMyEventCollectionAdapter } from "../http-adapter/event/get_my_event_collection.adapter";
import { CreateEventDTO } from "../http-dto/event/http_post.dto";
import { PaginationDTO } from "../http-dtos/http_pagination.dto";

@Controller('event')
@Roles(Role.User)
@ApiTags('event')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class EventController {
  private readonly logger: Logger = new Logger(EventController.name);

  constructor(
    @Inject(EventDITokens.CreateEventInteractor)
    private readonly create_event_interactor: CreateEventInteractor,
    @Inject(EventDITokens.GetMyEventCollectionInteractor)
    private readonly get_my_event_collection_interactor: GetMyEventCollectionInteractor,
    @Inject(EventDITokens.GetEventCollectionOfFriendsInteractor)
    private readonly get_event_of_friends_collection_interactor: GetEventCollectionOfFriendsInteractor,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The event was successfully created' })
  public async createSimpleConversation(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateEventDTO
  ) {
    try {
      return this.create_event_interactor.execute(
        await CreateEventAdapter.new({
          user_id: http_user.id,
          name: body.name,
          description: body.description,
          lat: body.lat, 
          long: body.long, 
          date: new Date(body.date)
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':user_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async getMyEventCollection(
    @Param('user_id') user_id: string, 
    @HttpUser() http_user: HttpUserPayload, 
    @Query() pagination: PaginationDTO
  ){
    return await this.get_my_event_collection_interactor.execute(
      await GetMyEventCollectionAdapter.new({
        user_id: http_user.id,
        limit: pagination.limit,
        offset: pagination.offset
      })
    );
    try {
      return await this.get_my_event_collection_interactor.execute(
        await GetMyEventCollectionAdapter.new({
          user_id: http_user.id,
          limit: pagination.limit,
          offset: pagination.offset
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async getPermanentPostOfFriendsCollection(
    @HttpUser() http_user: HttpUserPayload,
    @Query() pagination: PaginationDTO
  ) {
    try {
      return await this.get_event_of_friends_collection_interactor.execute(
        await GetEventOfFriendsCollectionAdapter.new({
          user_id: http_user.id,
          limit: pagination.limit,
          offset: pagination.offset
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}