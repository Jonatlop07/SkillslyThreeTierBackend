import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@application/module/user.module';
import { setEnvironment } from '@application/environments';
import { ProfileModule } from '@application/module/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${setEnvironment()}`,
    }),
    UserModule,
    ProfileModule,
  ],
})
export class RootModule {
}
