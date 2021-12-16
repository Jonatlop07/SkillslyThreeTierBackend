import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { setEnvironment } from '@application/environments';
import { UserModule } from './user.module';
import { PostModule } from './post.module';
import { InfrastructureModule } from './infrastructure.module';
import { AuthenticationModule } from './authentication.module';
import { ProfileModule } from './profile.module';
import { CommentModule } from './comment.module';
import { ChatModule } from './chat.module';
import { EventModule } from './event.module';
import { GroupModule } from './group.module';
import { ProjectModule } from './project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${setEnvironment()}`,
    }),
    InfrastructureModule,
    UserModule,
    PostModule,
    AuthenticationModule,
    ProfileModule,
    CommentModule,
    ChatModule, 
    EventModule,
    GroupModule,
    ProjectModule
  ],
})
export class RootModule {}
