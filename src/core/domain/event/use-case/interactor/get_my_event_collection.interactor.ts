import { Interactor } from '@core/common/use-case/interactor';
import GetMyEventCollectionInputModel from '../input-model/get_my_event_collection.input_model';
import GetMyEventCollectionOutputModel from '../output-model/get_my_event_collection.output_model';

export interface GetMyEventCollectionInteractor
  extends Interactor<GetMyEventCollectionInputModel, GetMyEventCollectionOutputModel> {}
