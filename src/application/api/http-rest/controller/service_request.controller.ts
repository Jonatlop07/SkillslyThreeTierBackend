import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger, Param,
  Post,
  Put, Query,
  ValidationPipe
} from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/type/role.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_create_service_request.dto';
import { CreateServiceRequestAdapter } from '@application/api/http-rest/http-adapter/service-request/create_service_request.adapter';
import { DeleteServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/delete_service_request.interactor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsNames } from '@application/events/event_names';
import { ServiceRequestDeletedEvent } from '@application/events/service_request/service_request_deleted.event';
import { ServiceRequestUpdatedEvent } from '@application/events/service_request/service_request_updated.event';
import { UpdateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_update_service_request.dto';
import { UpdateServiceRequestAdapter } from '@application/api/http-rest/http-adapter/service-request/update_service_request.adapter';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import { GetServiceRequestApplicationsInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_applications.interactor';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import { CreateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/request_cancel_or_completion.interactor';
import { CreateServiceRequestApplicationAdapter } from '../http-adapter/service-request/service-request-applications/create_service_request_application.adapter';
import { UpdateServiceRequestApplicationAdapter } from '../http-adapter/service-request/service-request-applications/update_service_request_application.adapter';
import { CreateServiceStatusUpdateRequestAdapter } from '../http-adapter/service-request/create_cancel_or_completion_request.adapter';
import { QueryServiceRequestCollectionInteractor } from '@core/domain/service-request/use-case/interactor/query_service_request_collection.interactor';
import { UpdateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_offer.interactor';
import { QueryServiceRequestCollectionDTO } from '@application/api/http-rest/http-dto/service-request/http_query_service_request_collection.dto';
import { QueryServiceRequestCollectionAdapter } from '@application/api/http-rest/http-adapter/service-request/query_service_request_collection.adapter';
import { UpdateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_status_update_request.interactor';
import { UpdateServiceStatusUpdateRequestAdapter } from '../http-adapter/service-request/update_service_status_update_request.adapter';
import CreateServiceStatusUpdateRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/request_cancel_or_completion.output_model';
import { ServiceRequestStatusUpdateRequestedEvent } from '@application/events/service_request/service_request_status_update.event';
import { GetServiceRequestEvaluationApplicantInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_evaluation_applicant.interactor';


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
    private readonly delete_service_request_interactor: DeleteServiceRequestInteractor,
    @Inject(ServiceRequestDITokens.CreateServiceRequestApplicationInteractor)
    private readonly create_service_request_application_interactor: CreateServiceRequestApplicationInteractor,
    @Inject(ServiceRequestDITokens.GetServiceRequestApplicationsInteractor)
    private readonly get_service_request_applications_interactor: GetServiceRequestApplicationsInteractor,
    @Inject(ServiceRequestDITokens.UpdateServiceRequestApplicationInteractor)
    private readonly update_service_request_application_interactor: UpdateServiceRequestApplicationInteractor,
    @Inject(ServiceRequestDITokens.CreateServiceStatusUpdateRequestInteractor)
    private readonly create_service_status_update_request_interactor: CreateServiceStatusUpdateRequestInteractor,
    @Inject(ServiceRequestDITokens.UpdateServiceStatusUpdateRequestInteractor)
    private readonly update_service_status_update_request_interactor: UpdateServiceStatusUpdateRequestInteractor,
    @Inject(ServiceRequestDITokens.QueryServiceRequestCollectionInteractor)
    private readonly query_service_request_collection_interactor: QueryServiceRequestCollectionInteractor,
    @Inject(ServiceRequestDITokens.GetServiceRequestEvaluationApplicantInteractor)
    private readonly get_service_request_evaluation_applicant_interactor: GetServiceRequestEvaluationApplicantInteractor
  ) {
  }

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
          service_request_id: result.service_request_id,
          service_request_title: result.title
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

  @Post('apply')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The service request application was successfully created' })
  @ApiNotFoundResponse({ description: 'The service request does not exist' })
  public async createServiceRequestApplication(@HttpUser() http_user: HttpUserPayload, @Body() body) {
    try {
      return await this.create_service_request_application_interactor.execute(
        CreateServiceRequestApplicationAdapter.new({
          applicant_id: http_user.id,
          request_id: body.request_id,
          message: body.message
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Roles(Role.Requester)
  @Get('applications/:service_request_id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({ description: 'The service request does not exist' })
  public async getServiceRequestApplications(@Param('service_request_id') service_request_id: string) {
    try {
      return await this.get_service_request_applications_interactor.execute({
        request_id: service_request_id
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Roles(Role.Requester)
  @Put('applications/:service_request_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The service request application was successfully updated' })
  @ApiNotFoundResponse({ description: 'The service request application does not exist' })
  @ApiUnauthorizedResponse({ description: 'The service request phase does not allow the current action' })
  public async updateServiceRequestApplication(
  @HttpUser() http_user: HttpUserPayload,
    @Param('service_request_id') service_request_id: string,
    @Body() body
  ) {
    try {
      return await this.update_service_request_application_interactor.execute(
        UpdateServiceRequestApplicationAdapter.new({
          request_id: service_request_id,
          applicant_id: body.applicant_id,
          application_action: body.application_action,
          user_id: http_user.id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post('status-update')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The status update request was successfully created' })
  @ApiConflictResponse({ description: 'The status update request already exists' })
  public async createServiceRequestStatusUpdateRequest(@HttpUser() http_user: HttpUserPayload, @Body() body) {
    try {

      const result: CreateServiceStatusUpdateRequestOutputModel = await this.create_service_status_update_request_interactor.execute(
        CreateServiceStatusUpdateRequestAdapter.new({
          provider_id: http_user.id,
          service_request_id: body.service_request_id,
          update_request_action: body.update_request_action
        })
      );
      this.event_emitter.emit(
        EventsNames.STATUS_UPDATE_REQUEST,
        new ServiceRequestStatusUpdateRequestedEvent({
          action: result.action,
          requester_id: result.requester_id,
          provider_name: result.provider_name,
          request_date: result.request_date,
          service_request_id: result.service_request_id,
          service_request_title: result.service_request_title,
        })
      );
      return result;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post('status-update-requester')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The status update request was successfully updated' })
  @ApiConflictResponse({ description: 'The status update request does not exists' })
  public async updateServiceRequestStatusUpdateRequest( @HttpUser() http_user: HttpUserPayload, @Body() body ) {
    try {
      return await this.update_service_status_update_request_interactor.execute(
        UpdateServiceStatusUpdateRequestAdapter.new({
          requester_id: http_user.id,
          provider_id: body.provider_id,
          service_request_id: body.service_request_id,
          update_service_status_update_request_action: body.update_request_action
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The service requests were successfully retrieved' })
  public async queryServiceRequests(
  @HttpUser() http_user: HttpUserPayload,
    @Query() parameters: QueryServiceRequestCollectionDTO
  ) {
    try {
      return QueryServiceRequestCollectionAdapter.toResponseDTO(
        await this.query_service_request_collection_interactor.execute(
          QueryServiceRequestCollectionAdapter.toInputModel(parameters)
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Roles(Role.Requester)
  @Get('applications/evaluated/:service_request_id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({ description: 'The service request does not exist' })
  public async getServiceRequestEvaluationApplicant(@Param('service_request_id') service_request_id: string) {
    try {
      return await this.get_service_request_evaluation_applicant_interactor.execute({
        request_id: service_request_id
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
