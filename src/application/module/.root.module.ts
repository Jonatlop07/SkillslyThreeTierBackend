import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@application/module/user.module';
import { setEnvironment } from '@application/environments';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${setEnvironment()}`
    }),
    UserModule
  ],
})
export class RootModule {}
