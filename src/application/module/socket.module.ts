import { Module } from '@nestjs/common';
import { ChatSocketGateway } from '@application/socket-gateway/chat.socket_gateway';
import { NotificationSocketGateway } from '@application/socket-gateway/notification.socket_gateway';
import { ChatModule } from '@application/module/chat.module';

@Module({
  imports: [ChatModule],
  providers: [ChatSocketGateway, NotificationSocketGateway]
})
export class SocketModule {}
