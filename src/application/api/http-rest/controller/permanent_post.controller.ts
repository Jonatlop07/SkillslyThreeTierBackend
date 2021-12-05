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
  Put,
  Query
} from '@nestjs/common';
import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreatePermanentPostAdapter } from '@infrastructure/adapter/use-case/post/create_permanent_post.adapter';
import { QueryPermanentPostAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post.adapter';
import { QueryPermanentPostCollectionAdapter } from '@infrastructure/adapter/use-case/post/query_permanent_post_collection.adapter';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/update_permanent_post.interactor';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post_collection.interactor';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';
import { SharePermanentPostInteractor } from '@core/domain/post/use-case/interactor/share_permanent_post.interactor';
import { SharePermanentPostAdapter } from '@infrastructure/adapter/use-case/post/share_permanent_post.adapter';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { SharePermanentPostDTO } from '@application/api/http-rest/http-dtos/http_permanent_post.dto';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import { QueryReactionsInteractor } from '@core/domain/reaction/use_case/interactor/query_reactions.interactor';
import { DeletePermanentPostInteractor } from '@core/domain/post/use-case/interactor/delete_permanent_post.interactor';

import { Role } from '@core/domain/user/entity/role.enum';

@Controller('permanent-posts')
@Roles(Role.User)
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
    private readonly query_permanent_post_interactor: QueryPermanentPostInteractor,
    @Inject(PostDITokens.DeletePermanentPostInteractor)
    private readonly delete_permanent_post_interactor: DeletePermanentPostInteractor,
    @Inject(PostDITokens.SharePermanentPostInteractor)
    private readonly share_permanent_post_interactor: SharePermanentPostInteractor,
    @Inject(ReactionDITokens.AddReactionInteractor)
    private readonly add_reaction_interactor: AddReactionInteractor,
    @Inject(ReactionDITokens.QueryReactionsInteractor)
    private readonly query_reactions_interactor: QueryReactionsInteractor
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createPermanentPost(@HttpUser() http_user: HttpUserPayload, @Body() body) {
    try {
      return await this.create_permanent_post_interactor.execute(
        await CreatePermanentPostAdapter.new({
          content: body.content,
          user_id: http_user.id,
          privacy: body.privacy
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
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
        user_id: http_user.id,
        privacy: body.privacy
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':user_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryPermanentPostCollection(@Param('user_id') user_id: string, @HttpUser() http_user: HttpUserPayload){
    try {
      return await this.query_permanent_post_collection_interactor.execute(
        await QueryPermanentPostCollectionAdapter.new({
          user_id: http_user.id,
          owner_id: user_id,
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':post_id')
  @HttpCode(HttpStatus.OK)
  public async queryPermanentPost(@Param('post_id') post_id: string, @Query() queryParams) {
    try {
      return await this.query_permanent_post_interactor.execute(
        await QueryPermanentPostAdapter.new({
          user_id: queryParams.user_id,
          id: post_id
        })
      );
    } catch (e){
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post(':post_id/share')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Post has been sucessfully shared' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while sharing post' })
  @ApiBearerAuth()
  public async sharePermanentPost(
  @Param('post_id') post_id: string,
    @Body(new ValidationPipe()) body: SharePermanentPostDTO
  ) {
    try {
      return await this.share_permanent_post_interactor.execute(
        await SharePermanentPostAdapter.new({
          post_id: post_id,
          user_id: body.user_id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Post(':post_id/react')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async addOrRemoveReaction(@HttpUser() http_user: HttpUserPayload,
    @Param('post_id') post_id: string,
    @Body() body) {
    try {
      return await this.add_reaction_interactor.execute({
        post_id: post_id,
        reactor_id: http_user.id,
        reaction_type: body.reaction_type
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get(':post_id/reactions')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async queryReactions(@HttpUser() http_user: HttpUserPayload,
    @Param('post_id') post_id: string) {
    try {
      return await this.query_reactions_interactor.execute({
        post_id: post_id,
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}

