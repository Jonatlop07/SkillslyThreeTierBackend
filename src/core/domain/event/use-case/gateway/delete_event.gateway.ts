import Delete from '@core/common/persistence/delete';
import Find from '@core/common/persistence/find';
import { EventDTO } from '../persistence-dto/event.dto';
import EventQueryModel from '../query-model/event.query_model';

export interface DeleteEventGateway extends Delete<EventDTO, EventDTO>, Find<EventDTO, EventQueryModel> {}
