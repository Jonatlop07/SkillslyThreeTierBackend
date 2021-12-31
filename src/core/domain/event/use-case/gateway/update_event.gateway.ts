import Find from '@core/common/persistence/find';
import Update from '@core/common/persistence/update';
import { EventDTO } from '../persistence-dto/event.dto';
import EventQueryModel from '../query-model/event.query_model';

export interface UpdateEventGateway extends Update<EventDTO>, Find<EventDTO, EventQueryModel> {}
