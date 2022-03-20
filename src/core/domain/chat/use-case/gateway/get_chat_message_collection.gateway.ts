import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';
import FindAll from '@core/common/persistence/find_all';

export default interface GetChatMessageCollectionGateway extends FindAll<MessageQueryModel, MessageDTO> {}
