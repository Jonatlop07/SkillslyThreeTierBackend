import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Post, ValidationPipe } from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { CreateTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/create_temporal_post.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateTemporalPostDTO } from '@application/api/http-rest/http-dtos/http_create_temporal_post.dto';
import { CreateTemporalPostAdapter } from '@infrastructure/adapter/use-case/temp-post/create_temporal_post.adapter';


@Controller('temporal-posts')
@ApiTags('Temporal Posts')
export class TemporalPostController {

  private readonly logger: Logger = new Logger(TemporalPostController.name);

  constructor(
    @Inject(TempPostDITokens.CreateTempPostInteractor)
    private readonly createTempPostInteractor: CreateTemporalPostInteractor,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Temporal post created',
  })
  public async createTemporalPost(@HttpUser() httpUser: HttpUserPayload, @Body(new ValidationPipe()) body: CreateTemporalPostDTO) {
    try {
      return await this.createTempPostInteractor.execute(CreateTemporalPostAdapter.new({
        description: body.description,
        user_id: httpUser.id,
        referenceType: body.referenceType,
        reference: body.reference,
      }));
    } catch (e) {
      this.logger.error(e.stack);
    }
  }

  // @Get('friends')
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   description: 'User friends temporal posts obtained',
  // })
  // public getUserTemporalPosts(@HttpUser() httpUser: HttpUserPayload) {
  //
  // }


}