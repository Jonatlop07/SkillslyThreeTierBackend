import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import { CreatePermanentPostEmptyContentException } from '@core/service/post/create_permanent_post.exception';
import { CreatePermanentPostAdapter } from '@infrastructure/adapter/use-case/post/create_permanent_post.adapter';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpUser } from '../authentication/decorator/http_user';
import { HttpUserPayload } from '../authentication/types/http_authentication_types';

@Controller('posts')
@ApiTags('posts')
export class PostController{
  private readonly logger: Logger = new Logger(PostController.name);
  constructor(
    @Inject(PostDITokens.CreatePermanentPostInteractor)
    private readonly create_permanent_post_interactor: CreatePermanentPostInteractor
  ){}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createPermanentPost(@HttpUser() http_user: HttpUserPayload, @Body() body){
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
}