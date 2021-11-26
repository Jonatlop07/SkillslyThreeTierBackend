import ChatMessageRepository from '@core/domain/chat/use-case/repository/chat_message.repository';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import * as moment from 'moment';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';

export class ChatMessageInMemoryRepository implements ChatMessageRepository {
  private currently_available_message_id: string;

  constructor(private readonly messages: Map<string, MessageDTO>) {
    this.currently_available_message_id = '1';
  }

  public create(message: MessageDTO): Promise<MessageDTO> {
    const new_message: MessageDTO = {
      message_id: this.currently_available_message_id,
      conversation_id: message.conversation_id,
      user_id: message.user_id,
      content: message.content,
      created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
    };
    this.messages.set(this.currently_available_message_id, new_message);
    this.currently_available_message_id = `${Number(this.currently_available_message_id) + 1}`;
    return Promise.resolve(new_message);
  }

  public findOne(params: MessageQueryModel): Promise<MessageDTO> {
    for (const message of this.messages.values()){
      if (Object.keys(params).every((key: string) => params[key] && params[key] === message[key])){
        return Promise.resolve(message);
      }
    }
    return Promise.resolve(undefined);
  }

  public findAll(params: MessageQueryModel): Promise<Array<MessageDTO>>{
    const response_messages: Array<MessageDTO> = [];
    for (const _message of this.messages.values())
      if (_message.conversation_id === params.conversation_id)
        response_messages.push(_message);
    return Promise.resolve(response_messages);
  }
}
