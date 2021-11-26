import CreateChatMessageGateway from '@core/domain/chat/use-case/gateway/create_chat_message.gateway';
import GetChatMessageCollectionGateway from '@core/domain/chat/use-case/gateway/get_chat_message_collection.gateway';

export default interface ChatMessageRepository extends CreateChatMessageGateway, GetChatMessageCollectionGateway {}
