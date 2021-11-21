import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateCommentDto } from '@application/api/http-rest/comment/dtos/http_create_comment.dto';
import { CreateCommentInPermanentPostAdapter } from '@infrastructure/adapter/use-case/comment/create_comment_in_permanent_post.adapter';
import {
  CommentInvalidDataFormatException,
  ThereAreNoCommentsException,
} from '@core/domain/comment/use-case/exception/comment.exception';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { GetCommentsInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_permanent_post.interactor';

@Controller('permanent-posts')
@ApiTags('comments in a permanent post')
export class CommentController {

  constructor(
    @Inject(CommentDITokens.CreateCommentInPermanentPostInteractor)
    private readonly createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor,
    @Inject(CommentDITokens.GetCommentsInPermamentPostInteractor)
    private readonly getCommentsInPermanentPostInteractor: GetCommentsInPermanentPostInteractor,
  ) {
  }

  @Post('/:id/comment')
  @HttpCode(HttpStatus.CREATED)
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

  @Get('/:id/comments')
  @ApiBearerAuth()
  async getAllCommentsInPermanentPost(@Query() queryParams, @Param('id') permanentPostID: string) {
    const page = queryParams['page'] ? queryParams['page'] : 0;
    const limit = queryParams['limit'] ? queryParams['limit'] : 2;
    try {
      return await this.getCommentsInPermanentPostInteractor.execute({
        page: page,
        limit: limit,
        postID: permanentPostID,
      });
    } catch (e) {
      if (e instanceof ThereAreNoCommentsException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'There are no comments in this post',
        }, HttpStatus.NOT_FOUND);
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