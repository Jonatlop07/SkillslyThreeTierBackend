import { Interactor } from '@core/common/use-case/interactor';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';
import CreateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/create_service_offer.output_model';

export interface CreateServiceOfferInteractor extends Interactor<CreateServiceOfferInputModel, CreateServiceOfferOutputModel> {}
