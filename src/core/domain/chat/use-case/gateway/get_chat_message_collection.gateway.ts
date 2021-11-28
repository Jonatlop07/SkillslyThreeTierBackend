import Find from '@core/common/persistence/find';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';

export default interface GetChatMessageCollectionGateway extends Find<MessageDTO, MessageQueryModel> {}
