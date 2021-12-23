import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { CreateEventInteractor } from "@core/domain/event/use-case/interactor/create_event.interactor";
import { GetEventCollectionOfFriendsInteractor } from "@core/domain/event/use-case/interactor/get_event_collection_of_friends.interactor";
import { GetMyEventCollectionInteractor } from "@core/domain/event/use-case/interactor/get_my_event_collection.interactor";
import { Role } from "@core/domain/user/entity/role.enum";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Logger, Param, Post, Query, ValidationPipe } from "@nestjs/common";
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
import { CreateEventAssistantInteractor } from '@core/domain/event/use-case/interactor/assistant/create_event_assistant.interactor';
import { CreateEventAssistantAdapter } from "../http-adapter/event/assistant/create_event_assistant.adapter";
import { GetEventAssistantCollectionInteractor } from "@core/domain/event/use-case/interactor/assistant/get_event_assistant.interactor";
import { GetEventAssistantCollectionAdapter } from "../http-adapter/event/assistant/get_event_assistant_collection.adapter";
import { AssistanceDTO } from '@core/domain/event/use-case/persistence-dto/assistance.dto';
import { DeleteEventAssistantInteractor } from "@core/domain/event/use-case/interactor/assistant/delete_event_assistant.interactor";
import { DeleteEventAssistantAdapter } from "../http-adapter/event/assistant/delete_event_assistant.adapter";

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
    @Inject(EventDITokens.CreateEventAssistantInteractor)
    private readonly create_event_assistant_interactor: CreateEventAssistantInteractor, 
    @Inject(EventDITokens.GetEventAssistantCollectionInteractor)
    private readonly get_event_assistant_collection_interactor: GetEventAssistantCollectionInteractor,
    @Inject(EventDITokens.DeleteEventAssistantInteractor)
    private readonly delete_event_assistant_interactor: DeleteEventAssistantInteractor
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The event was successfully created' })
  public async createEvent(
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

  @Post('assistant/:event_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The event assistant was successfully created' })
  public async createEventAssistant(
    @HttpUser() http_user: HttpUserPayload,
    @Param('event_id') event_id: string
  ) {
    try {
      return this.create_event_assistant_interactor.execute(
        await CreateEventAssistantAdapter.new({
          user_id: http_user.id,
          event_id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('assistant/:event_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async getEventAssistantCollection(
    @Param('event_id') event_id: string, 
  ){
    try {
      return await this.get_event_assistant_collection_interactor.execute(
        await GetEventAssistantCollectionAdapter.new({
          event_id
        })
      );
    } catch (e){
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
  public async getEventOfFriendsCollection(
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

  @Delete('assistant')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async deleteEventAssistant(
    @Body() assistant : AssistanceDTO
  ) {
    try {
      return await this.delete_event_assistant_interactor.execute(
        await DeleteEventAssistantAdapter.new({
          user_id: assistant.user_id,
          event_id : assistant.event_id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}