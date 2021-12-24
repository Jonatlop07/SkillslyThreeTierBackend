import { Interactor } from '@core/common/use-case/interactor';
import CreateEventAssistantInputModel from '../../input-model/assistant/create_event_assistant.input_model';
import CreateEventAssistantOutputModel from '../../output-model/assistant/create_event_assistant.output_model';

export interface CreateEventAssistantInteractor
  extends Interactor<
  CreateEventAssistantInputModel,
  CreateEventAssistantOutputModel
  > { }
