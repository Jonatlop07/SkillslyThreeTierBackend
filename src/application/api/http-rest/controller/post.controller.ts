import { Body, Controller, HttpCode, HttpStatus, Inject, Put } from '@nestjs/common';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/update_permanent_post.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(
    @Inject(PostDITokens.UpdatePermanentPostInteractor)
    private readonly update_permanent_post_interactor: UpdatePermanentPostInteractor
  ) {}

  @Put('post')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async updatePost(@HttpUser() http_user: HttpUserPayload, @Body() body) {
    return await this.update_permanent_post_interactor.execute({
      id: body.id,
      content: body.content,
      user_id: http_user.id
    });
  }
}

