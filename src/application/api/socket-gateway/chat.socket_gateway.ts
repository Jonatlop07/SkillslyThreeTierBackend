import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import SocketMessageDTO from '@application/api/socket-gateway/dtos/socket_message.dto';
import { SocketUserDTO } from '@application/api/socket-gateway/dtos/socket_user.dto';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreateChatMessageInteractor } from '@core/domain/chat/use-case/interactor/create_chat_message.interactor';
import { HttpException, Inject } from '@nestjs/common';
import CreateChatMessageOutputModel from '@core/domain/chat/use-case/output-model/create_chat_message.output_model';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: '/chat'
})
export class ChatSocketGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(ChatDITokens.CreateChatMessageInteractor)
    private readonly create_chat_message_interactor: CreateChatMessageInteractor
  ) {}

  @SubscribeMessage('client_message')
  public async handleMessage(client: Socket, payload: SocketMessageDTO) {
    try {
      const created_message: CreateChatMessageOutputModel = await this.create_chat_message_interactor.execute({
        user_id: payload.user_id,
        conversation_id: payload.conversation_id,
        content: payload.message
      });
      this.server.to(created_message.conversation_id).emit('server_message', created_message);
    } catch (e) {
      throw HttpException;
    }
  }

  @SubscribeMessage('join_conversation')
  public handleJoinConversation(client: Socket, payload: SocketUserDTO) {
    client.join(payload.conversation_id);
    client.emit('joined_conversation', payload);
  }

  @SubscribeMessage('leave_conversation')
  public handleLeaveConversation(client: Socket, payload: SocketUserDTO) {
    client.leave(payload.conversation_id);
    client.emit('left_conversation', payload);
  }
}
