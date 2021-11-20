import { Body, Controller, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentDITokens } from '@core/domain/comment/di/comment_di_tokens';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateCommentDto } from '@application/api/http-rest/comment/dtos/http_create_comment.dto';
import { CreateCommentInPermanentPostAdapter } from '@infrastructure/adapter/use-case/comment/create_comment_in_permanent_post.adapter';
import { CommentInvalidDataFormatException } from '@core/domain/comment/use-case/exception/comment.exception';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';

@Controller('permanent-posts')
@ApiTags('Comment in a permanent post')
export class CommentController {

  constructor(
    @Inject(CommentDITokens.CreateCommentInPermanentPostInteractor)
    private readonly createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor,
  ) {
  }

  @Post('/:id/comment')
  @ApiBearerAuth()
  async createCommentInPermanentPost(
    @Param('id') permanentPostID: string,
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateCommentDto,
  ) {
    try {
      return await this.createCommentInPermanentPostInteractor.execute(CreateCommentInPermanentPostAdapter.new({
        userID: http_user.id,
        postID: permanentPostID,
        comment: body['comment'],
        timestamp: body['timestamp'],
      }));
    } catch (e) {
      if (e instanceof CommentInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
      } else {
        console.log(e);
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }

}