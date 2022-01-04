import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, Post, ValidationPipe } from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_create_service_request.dto';
import { CreateServiceRequestAdapter } from '@application/api/http-rest/http-adapter/service-request/create_service_request.adapter';

@Controller('service-requests')
@Roles(Role.User)
@ApiTags('Service Requests')
export class ServiceRequestController {
  private readonly logger: Logger = new Logger(ServiceRequestController.name);

  constructor(
    @Inject(ServiceRequestDITokens.CreateServiceRequestInteractor)
    private readonly create_service_request_interactor: CreateServiceRequestInteractor
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
}
