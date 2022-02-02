import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/service/http_authentication.service';
import { HttpLocalAuthenticationGuard } from '@application/api/http-rest/authentication/guard/http_local_authentication.guard';
import {
  HttpLoggedInUser,
  HttpRequestWithUser
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Public } from '@application/api/http-rest/authentication/decorator/public';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class AuthenticationController {
  private readonly logger: Logger = new Logger(AuthenticationController.name);

  constructor(private readonly authentication_service: HttpAuthenticationService) {
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthenticationGuard)
  public login(@Req() request: HttpRequestWithUser): HttpLoggedInUser {
    return this.authentication_service.login(request.user);
  }
}
