import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/query_permanent_post.interactor';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/query_permanent_post_collection.interactor';
import { CreatePermanentPostEmptyContentException } from '@core/service/post/create_permanent_post.exception';
import { QueryPermanentPostUnexistingPostException, QueryPermanentPostUnexistingUserException } from '@core/service/post/query_permanent_post.exception';
import { CreatePermanentPostAdapter } from '@infrastructure/adapter/use-case/post/create_permanent_post.adapter';
import { QueryPermanentPostAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post.adapter';
import { QueryPermanentPostCollectionAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post_collection.adapter';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpUser } from '../authentication/decorator/http_user';
import { Public } from '../authentication/decorator/public';
import { HttpUserPayload } from '../authentication/types/http_authentication_types';

@Controller('posts')
@ApiTags('posts')
export class PostController{
  private readonly logger: Logger = new Logger(PostController.name);
  constructor(
    @Inject(PostDITokens.CreatePermanentPostInteractor)
    private readonly create_permanent_post_interactor: CreatePermanentPostInteractor,
    @Inject(PostDITokens.QueryPermanentPostCollectionInteractor)
    private readonly query_permanent_post_collection_interactor: QueryPermanentPostCollectionInteractor,
    @Inject(PostDITokens.QueryPermanentPostInteractor)
    private readonly query_permanent_post_interactor: QueryPermanentPostInteractor
  ){}

  @Post()
  @HttpCode(HttpStatus.OK)  
  @ApiBearerAuth()
  public async createPermanentPost(@HttpUser() http_user: HttpUserPayload, @Body() body){
    if (body.user_id !== http_user.id){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Cannot create a post that does not belong to you'
      }, HttpStatus.UNAUTHORIZED);
    }

    try {
      return await this.create_permanent_post_interactor.execute(
        await CreatePermanentPostAdapter.new({
          content: body.content,
          user_id: http_user.id
        })
      );
    } catch (e){
      this.logger.error(e.stack);
      if (e instanceof CreatePermanentPostEmptyContentException){
        throw new HttpException('Empty post content', HttpStatus.LENGTH_REQUIRED);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
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
      if (e instanceof QueryPermanentPostUnexistingUserException){
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
      if (e instanceof QueryPermanentPostUnexistingUserException){
        throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Can\'t get posts from an unexisting user'}, HttpStatus.NOT_FOUND);
      }
      if (e instanceof QueryPermanentPostUnexistingPostException){
        throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Can\'t get unexisting posts'}, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}