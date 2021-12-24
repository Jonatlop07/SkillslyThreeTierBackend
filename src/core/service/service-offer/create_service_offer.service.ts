import { Inject, Logger } from '@nestjs/common';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';
import CreateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/create_service_offer.output_model';
import CreateServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/create_service_offer.gateway';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { InvalidServiceOfferDetailsFormatException } from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import {
  isValidServiceOfferCategory,
  isValidServiceOfferContactInformation,
  isValidServiceOfferServiceBrief,
  isValidServiceOfferTitle
} from '@core/common/util/validators/service_offer.validators';

export class CreateServiceOfferService implements CreateServiceOfferInteractor {
  private readonly logger: Logger = new Logger(CreateServiceOfferService.name);

  constructor(
    @Inject(ServiceOfferDITokens.ServiceOfferRepository)
    private readonly gateway: CreateServiceOfferGateway
  ) {}

  public async execute(input: CreateServiceOfferInputModel): Promise<CreateServiceOfferOutputModel> {
    const { user_id, title, service_brief, contact_information, category } = input;
    if (
      !isValidServiceOfferTitle(title)
      || !isValidServiceOfferServiceBrief(service_brief)
      || !isValidServiceOfferContactInformation(contact_information)
      || !isValidServiceOfferCategory(category)
    )
      throw new InvalidServiceOfferDetailsFormatException();
    return await this.gateway.create({
      owner_id: user_id,
      title,
      service_brief,
      contact_information,
      category
    });
  }
}
