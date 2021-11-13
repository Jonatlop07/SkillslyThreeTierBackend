import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/http_authentication.service';
import { HttpLocalStrategy } from '@application/api/http-rest/authentication/passport/http_local.strategy';
import { HttpJwtStrategy } from '@application/api/http-rest/authentication/passport/http_jwt.strategy';
import { AuthenticationController } from '@application/api/http-rest/controller/authentication.controller';
import { HttpJwtAuthenticationGuard } from '@application/api/http-rest/authentication/guard/http_jwt_authentication.guard';
import { UserModule } from './user.module';

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
    HttpJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: HttpJwtAuthenticationGuard,
    },
  ]
})
export class AuthenticationModule {}
