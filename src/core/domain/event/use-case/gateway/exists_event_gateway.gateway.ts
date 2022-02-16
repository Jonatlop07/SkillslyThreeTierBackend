import EventQueryModel from '@core/domain/event/use-case/query-model/event.query_model';
import Exists from '@core/common/persistence/exists/exists';

export default interface ExistsEventGateway extends Exists<EventQueryModel> {}
