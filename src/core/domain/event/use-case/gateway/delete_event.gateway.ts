import { EventDTO } from '../persistence-dto/event.dto';
import EventQueryModel from '../query-model/event.query_model';
import FindOne from '@core/common/persistence/find_one';
import Delete from '@core/common/persistence/delete';

export interface DeleteEventGateway
  extends Delete<EventQueryModel, EventDTO>, FindOne<EventQueryModel, EventDTO> {}
