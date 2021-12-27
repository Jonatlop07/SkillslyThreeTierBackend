import { Interactor } from '@core/common/use-case/interactor';
import UpdateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/update_service_offer.input_model';
import UpdateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/update_service_offer.output_model';

export interface UpdateServiceOfferInteractor extends Interactor<UpdateServiceOfferInputModel, UpdateServiceOfferOutputModel> {}
