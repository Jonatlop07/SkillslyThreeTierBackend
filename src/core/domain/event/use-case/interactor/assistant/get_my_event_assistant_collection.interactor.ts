import { Interactor } from '@core/common/use-case/interactor';
import GetMyEventAssistantCollectionInputModel from '../../input-model/assistant/get_my_event_assistant_collection.input_model';
import GetMyEventAssistantCollectionOutputModel from '../../output-model/assistant/get_my_event_assistant_collection.output_model';

export interface GetMyEventAssistantCollectionInteractor
  extends Interactor<
  GetMyEventAssistantCollectionInputModel,
  GetMyEventAssistantCollectionOutputModel
  > { }
