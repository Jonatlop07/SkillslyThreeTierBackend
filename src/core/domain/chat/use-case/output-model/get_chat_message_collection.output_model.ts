import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export default interface GetChatMessageCollectionOutputModel {
  messages: Array<MessageDTO>
}
