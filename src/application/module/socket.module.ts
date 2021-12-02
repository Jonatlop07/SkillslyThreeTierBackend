import { Module } from '@nestjs/common';
import { SocketGateway } from '@application/socket-gateway/socket_gateway';
import { ChatModule } from '@application/module/chat.module';

@Module({
  imports: [ChatModule],
  providers: [SocketGateway],
  exports: [SocketGateway]
})
export class SocketModule {}
