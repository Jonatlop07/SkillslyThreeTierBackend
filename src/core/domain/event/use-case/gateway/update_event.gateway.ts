import Update from '@core/common/persistence/update';
import { EventDTO } from '../persistence-dto/event.dto';
import EventQueryModel from '../query-model/event.query_model';
import FindOne from '@core/common/persistence/find_one';

export interface UpdateEventGateway extends Update<EventDTO>, FindOne<EventQueryModel, EventDTO> {}
