import Exists from '@core/common/persistence/exists';
import { EventDTO } from '../persistence-dto/event.dto';

export default interface ExistsEventGateway extends Exists<EventDTO> {}
