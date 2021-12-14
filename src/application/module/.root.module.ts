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
import { CommentModule } from './comment.module';
import { ChatModule } from './chat.module';

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
    TempPostModule,
    ChatModule
  ],
})
export class RootModule {
}
