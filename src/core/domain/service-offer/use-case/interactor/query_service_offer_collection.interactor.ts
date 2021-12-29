import { Interactor } from '@core/common/use-case/interactor';
import QueryServiceOfferCollectionInputModel
  from '@core/domain/service-offer/use-case/input-model/query_service_offer_collection.input_model';
import QueryServiceOfferCollectionOutputModel
  from '@core/domain/service-offer/use-case/output-model/query_service_offer_collection.output_model';

export interface QueryServiceOfferCollectionInteractor
  extends Interactor<QueryServiceOfferCollectionInputModel, QueryServiceOfferCollectionOutputModel> {}
