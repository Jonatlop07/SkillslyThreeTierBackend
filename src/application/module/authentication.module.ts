import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@application/module/user.module';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/http_authentication.service';
import { HttpLocalStrategy } from '@application/api/http-rest/authentication/passport/http_local.strategy';
import { HttpJwtStrategy } from '@application/api/http-rest/authentication/passport/http_jwt.strategy';
import { AuthenticationController } from '@application/api/http-rest/controller/authentication.controller';

@Module({
  controllers: [
    AuthenticationController
  ],
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config_service: ConfigService) => ({
        secret: config_service.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${config_service.get<string>('JWT_EXPIRATION_TIME')}m`
        }
      })
    }),
    UserModule
  ],
  providers: [
    HttpAuthenticationService,
    HttpLocalStrategy,
    HttpJwtStrategy
  ]
})
export class AuthenticationModule {}
