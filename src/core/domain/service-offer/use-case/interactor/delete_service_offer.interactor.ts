import { Interactor } from '@core/common/use-case/interactor';
import DeleteServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/delete_service_offer.input_model';
import DeleteServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/delete_service_offer.output_model';

export interface DeleteServiceOfferInteractor
  extends Interactor<DeleteServiceOfferInputModel, DeleteServiceOfferOutputModel> {}
