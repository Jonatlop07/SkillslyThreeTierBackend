import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';

export default interface GetMyEventCollectionOutputModel {
  events: EventDTO[]
}