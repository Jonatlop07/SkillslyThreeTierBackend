import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { setEnvironment } from '@application/environments';
import { UserModule } from './user.module';
import { PostModule } from './post.module';
import { InfrastructureModule } from './infrastructure.module';
import { AuthenticationModule } from './authentication.module';
import { ProfileModule } from './profile.module';
import { CommentModule } from '@application/module/comment.module';
import { TempPostModule } from '@application/module/temp-post.module';
import { ChatModule } from './chat.module'
import { EventModule } from './event.module';
import { GroupModule } from './group.module';
import { ProjectModule } from './project.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

const event_emitter_configuration = {
  // set this to `true` to use wildcards
  wildcard: false,
  // the delimiter used to segment namespaces
  delimiter: '.',
  // set this to `true` if you want to emit the newListener event
  newListener: false,
  // set this to `true` if you want to emit the removeListener event
  removeListener: false,
  // the maximum amount of listeners that can be assigned to an event
  maxListeners: 10,
  // show event name in memory leak message when more than maximum amount of listeners is assigned
  verboseMemoryLeak: false,
  // disable throwing uncaughtException if an error event is emitted and it has no listeners
  ignoreErrors: false,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${setEnvironment()}`,
    }),
    EventEmitterModule.forRoot(event_emitter_configuration),
    InfrastructureModule,
    UserModule,
    PostModule,
    AuthenticationModule,
    ProfileModule,
    CommentModule,
    ChatModule,
    EventModule,
    GroupModule,
    ProjectModule,
    TempPostModule,
    ChatModule
  ],
})
export class RootModule {
}
