import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { Role } from '@core/domain/user/entity/type/role.enum';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse, ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateCommentInCommentInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_comment.iteractor';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateCommentDto } from '@application/api/http-rest/http-dto/comment/http_create_comment.dto';
import {
  CommentInvalidDataFormatException,
  ThereAreNoCommentsException,
} from '@core/domain/comment/use-case/exception/comment.exception';
import { GetCommentsInCommentInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_comment.interactor';

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

  @Post('/:commentID/comment')
  @ApiCreatedResponse({ description: 'Comment has been sucessfully created' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while creating comment' })
  @ApiBearerAuth()
  async createCommentInComment(
    @Param('commentID') commentID: string,
    @HttpUser() http_user: HttpUserPayload,
    @Body(new ValidationPipe()) body: CreateCommentDto,
  ) {
    try {
      return await this.createCommentInCommentInteractor.execute({
        userID: http_user.id,
        ancestorCommentID: commentID,
        comment: body['comment'],
        timestamp: body['timestamp'],
      });
    } catch (e) {
      if (e instanceof CommentInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  @Get('/:commentID/comments')
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
  async getAllCommentsInPermanentPost(@Query() queryParams, @Param('commentID') commentID: string) {
    const page = queryParams['page'] ? queryParams['page'] : 0;
    const limit = queryParams['limit'] ? queryParams['limit'] : 2;
    try {
      return await this.getCommentsInCommentInteractor.execute({
        page: page,
        limit: limit,
        ancestorCommentID: commentID,
      });
    } catch (e) {
      if (e instanceof ThereAreNoCommentsException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'There are no comments in this post',
        }, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }


}