import { Module } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';

@Module({
  imports: [
    UserModule
  ],
})
export class RootModule {}
