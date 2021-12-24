import { Interactor } from "@core/common/use-case/interactor";
import GetEventAssistantCollectionInputModel from "../../input-model/assistant/get_event_assistant_collection.input_model";
import GetEventAssistantCollectionOutputModel from "../../output-model/assistant/get_event_assistant_collection.output_model";

export interface GetEventAssistantCollectionInteractor
  extends Interactor<
  GetEventAssistantCollectionInputModel,
  GetEventAssistantCollectionOutputModel
  > { }