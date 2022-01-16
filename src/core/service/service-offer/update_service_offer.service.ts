import { UpdateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/update_service_offer.interactor';
import UpdateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/update_service_offer.input_model';
import UpdateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/update_service_offer.output_model';
import { Inject } from '@nestjs/common';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import {
  isValidServiceOfferCategory,
  isValidServiceOfferContactInformation,
  isValidServiceOfferServiceBrief,
  isValidServiceOfferTitle
} from '@core/common/util/validators/service_offer.validators';
import {
  InvalidServiceOfferDetailsFormatException,
  NonExistentServiceOfferException, ServiceOfferDoesNotBelongToUserException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import UpdateServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/update_service_offer.gateway';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';

export class UpdateServiceOfferService implements UpdateServiceOfferInteractor {
  constructor(
    @Inject(ServiceOfferDITokens.UpdateServiceOfferInteractor)
    private readonly gateway: UpdateServiceOfferGateway
  ) {
  }

  public async execute(input: UpdateServiceOfferInputModel): Promise<UpdateServiceOfferOutputModel> {
    const { service_offer_id, title, service_brief, contact_information, category, owner_id } = input;
    if (!await this.gateway.existsById(service_offer_id))
      throw new NonExistentServiceOfferException();
    if (!await this.gateway.belongsServiceOfferToUser(service_offer_id, owner_id))
      throw new ServiceOfferDoesNotBelongToUserException();
    if (
      !isValidServiceOfferTitle(title)
      || !isValidServiceOfferServiceBrief(service_brief)
      || !isValidServiceOfferContactInformation(contact_information)
      || !isValidServiceOfferCategory(category)
    )
      throw new InvalidServiceOfferDetailsFormatException();
    return await this.gateway.update(input as ServiceOfferDTO);
  }
}
