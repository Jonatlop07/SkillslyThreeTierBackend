import Create from '@core/common/persistence/create/create';
import { EventDTO } from '../persistence-dto/event.dto';
import CreateEventPersistenceDTO from '@core/domain/event/use-case/persistence-dto/create_event.persistence_dto';

export default interface CreateEventGateway extends Create<CreateEventPersistenceDTO, EventDTO> {}
