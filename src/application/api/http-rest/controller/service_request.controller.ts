import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Logger, Param,
  Post,
  Put,
  ValidationPipe
} from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/type/role.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_create_service_request.dto';
import { CreateServiceRequestAdapter } from '@application/api/http-rest/http-adapter/service-request/create_service_request.adapter';
import { UpdateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_offer.interactor';
import { DeleteServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/delete_service_request.interactor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsNames } from '@application/events/event_names';
import { ServiceRequestDeletedEvent } from '@application/events/service_request/service_request_deleted.event';
import { ServiceRequestUpdatedEvent } from '@application/events/service_request/service_request_updated.event';
import { UpdateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_update_service_request.dto';
import { UpdateServiceRequestAdapter } from '@application/api/http-rest/http-adapter/service-request/update_service_request.adapter';

@Controller('service-requests')
@Roles(Role.User)
@ApiTags('Service Requests')
export class ServiceRequestController {
  private readonly logger: Logger = new Logger(ServiceRequestController.name);

  constructor(
    private readonly event_emitter: EventEmitter2,
    @Inject(ServiceRequestDITokens.CreateServiceRequestInteractor)
    private readonly create_service_request_interactor: CreateServiceRequestInteractor,
    @Inject(ServiceRequestDITokens.UpdateServiceRequestInteractor)
    private readonly update_service_request_interactor: UpdateServiceRequestInteractor,
    @Inject(ServiceRequestDITokens.DeleteServiceRequestInteractor)
    private readonly delete_service_request_interactor: DeleteServiceRequestInteractor
  ) {}

  @Roles(Role.Requester)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The service request was successfully created' })
  @ApiBadRequestResponse({ description: 'The new service details were provided in an invalid format' })
  public async createServiceRequest(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateServiceRequestDTO
  ) {
    try {
      return CreateServiceRequestAdapter.toResponseDTO(
        await this.create_service_request_interactor.execute(
          CreateServiceRequestAdapter.toInputModel(http_user.id, body)
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Roles(Role.Requester)
  @Put(':service_request_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The service request was successfully updated' })
  @ApiNotFoundResponse({ description: 'The service request does not exist' })
  @ApiBadRequestResponse({ description: 'The service request details to be updated are in an invalid format' })

  public async updateServiceRequest(
    @HttpUser() http_user: HttpUserPayload,
    @Param('service_request_id') service_request_id: string,
    @Body(new ValidationPipe()) body: UpdateServiceRequestDTO
  ) {
    try {
      const result = UpdateServiceRequestAdapter.toResponseDTO(
        await this.update_service_request_interactor.execute(
          UpdateServiceRequestAdapter.toInputModel(http_user.id, service_request_id, body)
        )
      );
      this.event_emitter.emit(
        EventsNames.UPDATED_SERVICE_REQUEST,
        new ServiceRequestUpdatedEvent({
          applicants: result.applicants,
          service_request_id: result.service_request_id
        })
      );
      return result;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Roles(Role.Requester)
  @Delete(':service_request_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'The service request was successfully deleted' })
  @ApiNotFoundResponse({ description: 'The service request does not exist' })
  @ApiForbiddenResponse({ description: 'The service request cannot be deleted while in the current phase' })
  public async deleteServiceRequest(
    @HttpUser() http_user: HttpUserPayload,
    @Param('service_request_id') service_request_id: string
  ) {
    try {
      const { applicants, title: service_request_title } = await this.delete_service_request_interactor.execute({
        owner_id: http_user.id,
        service_request_id
      });
      this.event_emitter.emit(
        EventsNames.DELETED_SERVICE_REQUEST,
        new ServiceRequestDeletedEvent({
          applicants,
          service_request_title
        })
      );
      return {};
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
