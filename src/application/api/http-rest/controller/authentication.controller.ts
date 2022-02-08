import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger, Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/service/http_authentication.service';
import { HttpLocalAuthenticationGuard } from '@application/api/http-rest/authentication/guard/http_local_authentication.guard';
import {
  HttpLoggedInUser,
  HttpRequestWithUser,
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { RequestResetPasswordDTO } from '@application/api/http-rest/authentication/types/request_reset_password.dto';
import { ResetPasswordDTO } from '@application/api/http-rest/authentication/types/reset_password.dto';
import { HttpResetPasswordService } from '@application/api/http-rest/authentication/service/http_reset_password.service';
import { Observable } from 'rxjs';
import {ValidationPipe} from "@application/api/http-rest/common/pipes/validation.pipe";

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred',
})
export class AuthenticationController {
  private readonly logger: Logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authentication_service: HttpAuthenticationService,
    private readonly reset_password_service: HttpResetPasswordService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthenticationGuard)
  public login(@Req() request: HttpRequestWithUser): HttpLoggedInUser {
    return this.authentication_service.login(request.user);
  }

  @Public()
  @Patch('/request-reset-password')
  @HttpCode(HttpStatus.OK)
  public requestResetPassword(
    @Body() requestResetPasswordDTO: RequestResetPasswordDTO,
  ): Promise<void> {
    return this.reset_password_service.requestResetPassword(
      requestResetPasswordDTO,
    );
  }

  @Public()
  @Patch('/reset-password/:token')
  @HttpCode(HttpStatus.OK)
  public resetPassword(
      @Param('token') token: string,
      @Body() body,
  ): Promise<void> {
    let resetPassword: ResetPasswordDTO = {
      reset_password_token: token,
      password: body.password,
    };
    return this.reset_password_service.resetPassword(resetPassword);
  }

  @Public()
  @Post('val-captcha')
  @HttpCode(HttpStatus.OK)
  public validateCaptcha(@Body() details): Observable<any> {
    return this.authentication_service.validateCaptcha(details.response);
  }
}
