import ExistsEventGateway from '@core/domain/event/use-case/gateway/exists_event_gateway.gateway';
import DeleteEventAssistance from '../../persistence/assistance/delete_event_assistance';
import ExistsEventAssistance from '../../persistence/assistance/exists_event_assistance';

export default interface DeleteEventAssistantGateway extends DeleteEventAssistance, ExistsEventGateway, ExistsEventAssistance {}
