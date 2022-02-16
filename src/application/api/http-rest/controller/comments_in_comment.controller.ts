import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/type/role.enum';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateCommentInCommentInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_comment.interactor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateCommentDto } from '@application/api/http-rest/http-dto/comment/http_create_comment.dto';
import { GetCommentsInCommentInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_comment.interactor';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';

@Controller('comments')
@Roles(Role.User)
@ApiTags('Comments in another comment')
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })

export class CommentsInCommentController {
  constructor(
    @Inject(CommentDITokens.CreateCommentInCommentInteractor)
    private readonly createCommentInCommentInteractor: CreateCommentInCommentInteractor,
    @Inject(CommentDITokens.GetCommentsInCommentInteractor)
    private readonly getCommentsInCommentInteractor: GetCommentsInCommentInteractor,
  ) {
  }

  @Post('/:comment-id/comment')
  @ApiCreatedResponse({ description: 'Comment has been successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while creating comment' })
  @ApiBearerAuth()
  async createCommentInComment(
    @Param('comment-id') comment_id: string,
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateCommentDto,
  ) {
    try {
      const { created_comment } = await this.createCommentInCommentInteractor.execute({
        owner_id: http_user.id,
        ancestor_comment_id: comment_id,
        comment: body.comment,
        timestamp: body.timestamp,
      });
      return created_comment;
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('/:comment-id/comments')
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
  async getAllCommentsInPermanentPost(@Query() queryParams, @Param('comment-id') comment_id: string) {
    const page = queryParams.page ? queryParams.page : 0;
    const limit = queryParams.limit ? queryParams.limit : 2;
    try {
      return await this.getCommentsInCommentInteractor.execute({
        page,
        limit,
        ancestor_comment_id: comment_id,
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
