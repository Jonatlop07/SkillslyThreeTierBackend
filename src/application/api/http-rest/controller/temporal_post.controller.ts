import {
  ApiAcceptedResponse, ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { CreateTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/create_temporal_post.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateTemporalPostDTO } from '@application/api/http-rest/http-dto/temp-post/http_create_temporal_post.dto';
import { CreateTemporalPostAdapter } from '@application/api/http-rest/http-adapter/temp-post/create_temporal_post.adapter';
import { QueryTemporalPostCollectionInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post_collection.interactor';
import { QueryTemporalPostCollectionAdapter } from '@application/api/http-rest/http-adapter/temp-post/query_temporal_post_collection.adapter';
import { DeleteTemporalPostDTO } from '@application/api/http-rest/http-dto/temp-post/http_delete_temporal_post.dto';
import { DeleteTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/delete_temporal_post.interactor';
import { DeleteTemporalPostAdapter } from '@application/api/http-rest/http-adapter/temp-post/delete_temporal_post.adapter';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';


@Controller('temporal-posts')
@ApiTags('Temporal Posts')
export class TemporalPostController {

  private readonly logger: Logger = new Logger(TemporalPostController.name);

  constructor(
    @Inject(TempPostDITokens.CreateTempPostInteractor)
    private readonly createTempPostInteractor: CreateTemporalPostInteractor,
    @Inject(TempPostDITokens.QueryTemporalPostCollectionInteractor)
    private readonly queryTemporalPostCollectionInteractor: QueryTemporalPostCollectionInteractor,
    @Inject(TempPostDITokens.DeleteTemporalPostInteractor)
    private readonly deleteTemporalPostInteractor: DeleteTemporalPostInteractor,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Temporal post created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
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
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('friends')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User friends temporal posts obtained successfully',
  })
  @ApiNotFoundResponse({
    description: 'User friends temporal posts not found',
  })
  public async getUserTemporalPosts(@HttpUser() httpUser: HttpUserPayload) {
    try {
      return await this.queryTemporalPostCollectionInteractor.execute(QueryTemporalPostCollectionAdapter.new({
        user_id: httpUser.id,
      }));
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }


  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiAcceptedResponse({
    description: 'Temporal post deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'User not authorized for this operation' })
  public async deleteTemporalPost(@HttpUser() httpUser: HttpUserPayload, @Body(new ValidationPipe()) body: DeleteTemporalPostDTO) {
    if (httpUser.id !== body.user_id) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'You cannot delete a temporal post of another user',
      }, HttpStatus.UNAUTHORIZED);
    }
    try {
      return await this.deleteTemporalPostInteractor.execute(DeleteTemporalPostAdapter.new({
        temporal_post_id: body.temporal_post_id,
        user_id: body.user_id,
      }));
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

}