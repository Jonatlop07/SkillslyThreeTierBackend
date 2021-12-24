import { Interactor } from "@core/common/use-case/interactor";
import DeleteEventAssistantInputModel from "../../input-model/assistant/delete_event_assistant.input_model";
import DeleteEventAssistantOutputModel from "../../output-model/assistant/delete_event_assistant.output_model";

export interface DeleteEventAssistantInteractor
  extends Interactor<
  DeleteEventAssistantInputModel,
  DeleteEventAssistantOutputModel
  > { }