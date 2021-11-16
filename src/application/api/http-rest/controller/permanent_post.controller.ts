import {
  Body,
  Controller, Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { CreatePermanentPostAdapter } from '@infrastructure/adapter/use-case/post/create_permanent_post.adapter';
import { QueryPermanentPostAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post.adapter';
import { QueryPermanentPostCollectionAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post_collection.adapter';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/update_permanent_post.interactor';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import {
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException, NonExistentUserException
} from '@core/domain/post/use-case/exception/permanent_post.exception';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post_collection.interactor';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';

@Controller('permanent-posts')
@ApiTags('permanent-posts')
export class PermanentPostController {
  private readonly logger: Logger = new Logger(PermanentPostController.name);

  constructor(
    @Inject(PostDITokens.CreatePermanentPostInteractor)
    private readonly create_permanent_post_interactor: CreatePermanentPostInteractor,
    @Inject(PostDITokens.UpdatePermanentPostInteractor)
    private readonly update_permanent_post_interactor: UpdatePermanentPostInteractor,
    @Inject(PostDITokens.QueryPermanentPostCollectionInteractor)
    private readonly query_permanent_post_collection_interactor: QueryPermanentPostCollectionInteractor,
    @Inject(PostDITokens.QueryPermanentPostInteractor)
    private readonly query_permanent_post_interactor: QueryPermanentPostInteractor
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createPermanentPost(@HttpUser() http_user: HttpUserPayload, @Body() body) {
    try {
      return await this.create_permanent_post_interactor.execute(
        await CreatePermanentPostAdapter.new({
          content: body.content,
          user_id: http_user.id
        })
      );
    } catch (e) {
      this.logger.error(e.stack);
      if (e instanceof EmptyPermanentPostContentException) {
        throw new HttpException({
          status: HttpStatus.LENGTH_REQUIRED,
          error: 'Empty post content'
        }, HttpStatus.LENGTH_REQUIRED);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':post_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updatePermanentPost(
    @HttpUser() http_user: HttpUserPayload,
    @Param('post_id') post_id: string,
    @Body() body) {
    if (body.user_id !== http_user.id)
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot update a post that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    try {
      return await this.update_permanent_post_interactor.execute({
        id: post_id,
        content: body.content,
        user_id: http_user.id
      });
    } catch (e) {
      if (e instanceof EmptyPermanentPostContentException) {
        throw new HttpException({
          status: HttpStatus.LENGTH_REQUIRED,
          error: 'Empty post content'
        }, HttpStatus.LENGTH_REQUIRED);
      } else if (e instanceof NonExistentPermanentPostException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'The post does not exist'
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async queryPermanentPostCollection(@Body() body){
    try {
      return await this.query_permanent_post_collection_interactor.execute(
        await QueryPermanentPostCollectionAdapter.new({
          user_id: body.user_id
        })
      );
    } catch (e){
      this.logger.error(e.stack);
      if (e instanceof NonExistentUserException) {
        throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Can\'t get posts from an unexisting user'}, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Public()
  @Get(':post_id')
  @HttpCode(HttpStatus.OK)
  public async queryPermanentPost(@Param('post_id') post_id: string, @Body() body){
    try {
      return await this.query_permanent_post_interactor.execute(
        await QueryPermanentPostAdapter.new({
          user_id: body.user_id,
          id: post_id
        })
      );
    } catch (e){
      this.logger.error(e.stack);
      if (e instanceof NonExistentUserException) {
        throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Can\'t get posts from an unexisting user'}, HttpStatus.NOT_FOUND);
      }
      if (e instanceof NonExistentPermanentPostException) {
        throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Can\'t get unexisting posts'}, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

