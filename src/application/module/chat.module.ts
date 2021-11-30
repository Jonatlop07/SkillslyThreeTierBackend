import { Module } from '@nestjs/common';
import { ChatSocketGateway } from '@application/api/socket-gateway/chat.socket_gateway';
import { ChatController } from '@application/api/http-rest/controller/chat.controller';

@Module({
  controllers: [
    ChatController
  ],
  providers: [
    ChatSocketGateway
  ]
})
export class ChatModule {}
