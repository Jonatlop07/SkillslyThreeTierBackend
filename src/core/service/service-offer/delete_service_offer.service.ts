import { DeleteServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/delete_service_offer.interactor';
import DeleteServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/delete_service_offer.input_model';
import DeleteServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/delete_service_offer.output_model';
import { Inject, Logger } from '@nestjs/common';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import DeleteServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/delete_service_offer.gateway';
import {
  NonExistentServiceOfferException,
  ServiceOfferDoesNotBelongToUserException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';

export class DeleteServiceOfferService implements DeleteServiceOfferInteractor {
  private readonly logger: Logger = new Logger(DeleteServiceOfferService.name);

  constructor(
    @Inject(ServiceOfferDITokens.ServiceOfferRepository)
    private readonly gateway: DeleteServiceOfferGateway
  ) {}

  public async execute(input: DeleteServiceOfferInputModel): Promise<DeleteServiceOfferOutputModel> {
    const { service_offer_id, owner_id } = input;
    if (!await this.gateway.exists({
      service_offer_id
    }))
      throw new NonExistentServiceOfferException();
    if (!await this.gateway.belongsServiceOfferToUser(service_offer_id, owner_id))
      throw new ServiceOfferDoesNotBelongToUserException();
    await this.gateway.delete({
      service_offer_id,
      owner_id
    });
    return {};
  }
}
