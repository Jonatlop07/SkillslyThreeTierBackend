import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { setEnvironment } from '@application/environments';
import { UserModule } from '@application/module/user.module';
import { InfrastructureModule } from '@application/module/infrastructure.module';
import { AuthenticationModule } from './authentication.module';
import { ProfileModule } from '@application/module/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${setEnvironment()}`,
    }),
    InfrastructureModule,
    ProfileModule,
    UserModule,
    AuthenticationModule,
  ],
})
export class RootModule {
}
