import CreateEventGateway from '@core/domain/event/use-case/gateway/create_event.gateway';
import GetMyEventCollectionGateway from '@core/domain/event/use-case/gateway/get_my_event_collection.gateway';
import GetEventCollectionOfFriendsGateway from '@core/domain/event/use-case/gateway/get_event_collection_of_friends.gateway';

export default interface EventRepository
  extends CreateEventGateway, GetEventCollectionOfFriendsGateway, GetMyEventCollectionGateway {}