import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  ValidationPipe
} from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/role.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { CreateServiceOfferDTO } from '@application/api/http-rest/http-dto/service-offer/http_create_service_offer.dto';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateServiceOfferAdapter } from '@application/api/http-rest/http-adapter/service-offer/create_service_offer.adapter';
import { UpdateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/update_service_offer.interactor';
import { UpdateServiceOfferDTO } from '@application/api/http-rest/http-dto/service-offer/http_update_service_offer.dto';
import { UpdateServiceOfferAdapter } from '@application/api/http-rest/http-adapter/service-offer/update_service_offer.adapter';

@Controller('service-offers')
@Roles(Role.User)
@ApiTags('Service Offers')
export class ServiceOfferController {
  private readonly logger: Logger = new Logger(ServiceOfferController.name);

  constructor(
    @Inject(ServiceOfferDITokens.CreateServiceOfferInteractor)
    private readonly create_service_offer_interactor: CreateServiceOfferInteractor,
    @Inject(ServiceOfferDITokens.UpdateServiceOfferInteractor)
    private readonly update_service_offer_interactor: UpdateServiceOfferInteractor
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The service offer was successfully created' })
  @ApiBadRequestResponse({ description: 'The new service details were provided in an invalid format' })
  public async createServiceOffer(
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateServiceOfferDTO
  ) {
    try {
      return CreateServiceOfferAdapter.toResponseDTO(
        await this.create_service_offer_interactor.execute(
          CreateServiceOfferAdapter.toInputModel(http_user.id, body)
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put(':service_offer_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The service offer was successfully updated' })
  @ApiNotFoundResponse({ description: 'The service offer does not exist' })
  @ApiBadRequestResponse({ description: 'The service details to be updated were provided in an invalid format' })
  public async updateServiceOffer(
    @HttpUser() http_user: HttpUserPayload,
    @Param('service_offer_id') service_offer_id: string,
    @Body(new ValidationPipe()) body: UpdateServiceOfferDTO
  ) {
    try {
      return UpdateServiceOfferAdapter.toResponseDTO(
        await this.update_service_offer_interactor.execute(
          UpdateServiceOfferAdapter.toInputModel(
            service_offer_id,
            http_user.id,
            body
          )
        )
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
