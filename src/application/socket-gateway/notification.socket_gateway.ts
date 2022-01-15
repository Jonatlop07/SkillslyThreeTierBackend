import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as socketio_jwt from 'socketio-jwt';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsNames } from '@application/events/event_names';
import { AddedMembersToGroupConversationEvent } from '@application/events/chat/added_members_to_group_conversation.event';
import { SocketJoinDTO } from '@application/socket-gateway/dtos/socket_join.dto';
import { FollowRequestSentToUserEvent } from '@application/events/user/follow_request_sent_to_user.event';
import { FollowRequestAcceptedEvent } from '@application/events/user/follow_request_accepted.event';
import { FollowRequestDeletedEvent } from '@application/events/user/follow_request_deleted.event';
import { ServiceRequestDeletedEvent } from '@application/events/service_request/service_request_deleted.event';
import { ServiceRequestUpdatedEvent } from '@application/events/service_request/service_request_updated.event';
import { ServiceRequestStatusUpdateRequestedEvent } from '@application/events/service_request/service_request_status_update.event';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'notification'
})
export class NotificationSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(NotificationSocketGateway.name);

  @WebSocketServer() server: Server;

  constructor(
    private config_service: ConfigService,
  ) {
  }

  afterInit(): void {
    this.server.use(socketio_jwt.authorize({
      secret: this.config_service.get<string>('JWT_SECRET'),
      handshake: true
    }));
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join')
  public handleJoin(client: Socket, payload: SocketJoinDTO) {
    client.join(payload.user_id);
  }

  @SubscribeMessage('leave')
  public handleLeave(client: Socket, payload: SocketJoinDTO) {
    client.leave(payload.user_id);
  }

  @OnEvent(EventsNames.FOLLOW_REQUEST_SENT)
  public handleFollowRequestSentToUserEvent(payload: FollowRequestSentToUserEvent) {
    this.server.to(payload.user_to_follow_id).emit('follow_request_received', {
      user_id: payload.user_id,
      name: payload.user_name,
      email: payload.user_email
    });
  }

  @OnEvent(EventsNames.FOLLOW_REQUEST_ACCEPTED)
  public handleFollowRequestAcceptedEvent(payload: FollowRequestAcceptedEvent) {
    this.server.to(payload.user_to_follow_id).emit('follow_request_accepted', {
      user_id: payload.user_id,
      name: payload.user_name,
      email: payload.user_email
    });
  }

  @OnEvent(EventsNames.FOLLOW_REQUEST_DELETED)
  public handleFollowRequestDeletedEvent(payload: FollowRequestDeletedEvent) {
    this.server.to(payload.user_to_follow_id).emit('follow_request_deleted', {
      user_id: payload.user_id
    });
  }

  @OnEvent(EventsNames.ADDED_MEMBERS_TO_GROUP_CONVERSATION)
  public handleAddedMembersToGroupConversationEvent(payload: AddedMembersToGroupConversationEvent) {
    this.server.to(payload.user_id).emit('added_to_group_conversation', payload.conversation);
  }

  @OnEvent(EventsNames.UPDATED_SERVICE_REQUEST)
  public handleUpdatedServiceRequestEvent(payload: ServiceRequestUpdatedEvent) {
    const { service_request_id } = payload;
    payload.applicants.forEach((applicant_id: string) =>
      this.server.to(applicant_id).emit('service_request_updated', {
        service_request_id
      })
    );
  }

  @OnEvent(EventsNames.DELETED_SERVICE_REQUEST)
  public handleDeletedServiceRequestEvent(payload: ServiceRequestDeletedEvent) {
    const { service_request_title } = payload;
    payload.applicants.forEach((applicant_id: string) =>
      this.server.to(applicant_id).emit('service_request_deleted', {
        service_request_title
      })
    );
  }

  @OnEvent(EventsNames.STATUS_UPDATE_REQUEST)
  public handleServiceRequestStatusUpdateRequestedEvent(payload: ServiceRequestStatusUpdateRequestedEvent) {
    this.server.to(payload.requester_id).emit('status_update_request.created', {
      service_request_id: payload.service_request_id,
      update_action: payload.action,
      request_date: payload.request_date
    });
  }
}
