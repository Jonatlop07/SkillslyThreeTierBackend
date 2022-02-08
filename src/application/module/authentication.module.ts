import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/service/http_authentication.service';
import { HttpLocalStrategy } from '@application/api/http-rest/authentication/passport/http_local.strategy';
import { HttpJwtStrategy } from '@application/api/http-rest/authentication/passport/http_jwt.strategy';
import { AuthenticationController } from '@application/api/http-rest/controller/authentication.controller';
import { UserModule } from './user.module';
import { RolesGuard } from '@application/api/http-rest/authorization/guard/roles.guard';
import { HttpJwtTwoFactorAuthStrategy } from '@application/api/http-rest/authentication/passport/http_jwt_two_factor_auth.strategy';
import { HttpJwtTwoFactorAuthGuard } from '@application/api/http-rest/authentication/guard/http_jwt_two_factor_auth.guard';
import { TwoFactorAuthController } from '@application/api/http-rest/controller/two_factor_auth.controller';
import { HttpTwoFactorAuthService } from '@application/api/http-rest/authentication/service/http_two_factor_auth.service';
import {HttpResetPasswordService} from "@application/api/http-rest/authentication/service/http_reset_password.service";
import {MAILER_OPTIONS, MailerModule, MailerService} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  controllers: [
    AuthenticationController,
    TwoFactorAuthController
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config_service: ConfigService) => ({
        transport: {
          host: config_service.get<string>('MAILER_HOST'),
          port: config_service.get<string>('MAILER_PORT'),
          ignoreTLS: config_service.get<boolean>('MAILER_IGNORE_TLS'),
          secure: config_service.get<boolean>('MAILER_SECURE'),
          secureConnection: false,
          tls: {
            ciphers:'SSLv3'
          },
          auth: {
            user: config_service.get<boolean>('USER_MAILER'),
            pass: config_service.get<boolean>('PASS_MAILER'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
      })
    }),
    UserModule,
    MailerModule
  ],
  providers: [
    HttpAuthenticationService,
    HttpResetPasswordService,
    HttpTwoFactorAuthService,
    HttpLocalStrategy,
    HttpJwtStrategy,
    HttpJwtTwoFactorAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: HttpJwtTwoFactorAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [
    HttpAuthenticationService
  ]
})
export class AuthenticationModule {}
