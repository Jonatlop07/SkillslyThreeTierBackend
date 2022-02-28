import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateCommentDto } from '@application/api/http-rest/http-dto/comment/http_create_comment.dto';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { CreateCommentInPermanentPostAdapter } from '@application/api/http-rest/http-adapter/comment/create_comment_in_permanent_post.adapter';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { GetCommentsInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_permanent_post.interactor';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';

@Controller('permanent-posts')
@Roles(Role.User)
@ApiTags('comments in a permanent post')
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class CommentController {

  constructor(
    @Inject(CommentDITokens.CreateCommentInPermanentPostInteractor)
    private readonly createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor,
    @Inject(CommentDITokens.GetCommentsInPermamentPostInteractor)
    private readonly getCommentsInPermanentPostInteractor: GetCommentsInPermanentPostInteractor,
  ) {
  }

  @Post('/:permanent-post-id/comment')
  @ApiCreatedResponse({ description: 'Comment has been successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while creating comment' })
  @ApiBearerAuth()
  async createCommentInPermanentPost(
    @Param('permanent-post-id') permanent_post_id: string,
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateCommentDto,
  ) {
    try {
      const { created_comment } = await this.createCommentInPermanentPostInteractor
        .execute(CreateCommentInPermanentPostAdapter.new({
          owner_id: http_user.id,
          post_id: permanent_post_id,
          comment: body.comment,
          timestamp: body.timestamp
        }));
      return created_comment;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('/:permanent-post-id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Comments has been successfully obtained',
  })
  @ApiNotFoundResponse({
    description: 'There are no comments',
  })
  @ApiBadGatewayResponse({
    description: 'Error while obtaining comments',
  })
  @ApiBearerAuth()
  async getAllCommentsInPermanentPost(@Query() queryParams, @Param('permanent-post-id') permanent_post_id: string) {
    const page = queryParams.page ? queryParams.page : 0;
    const limit = queryParams.limit ? queryParams.limit : 2;
    try {
      const { comments } = await this.getCommentsInPermanentPostInteractor.execute({
        page: page,
        limit: limit,
        post_id: permanent_post_id,
      });
      return comments;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
