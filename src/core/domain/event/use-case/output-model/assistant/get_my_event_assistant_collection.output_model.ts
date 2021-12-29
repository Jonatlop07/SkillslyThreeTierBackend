import { EventDTO } from "../../persistence-dto/event.dto";

export default interface GetMyEventAssistantCollectionOutputModel {
  events: EventDTO[];
}