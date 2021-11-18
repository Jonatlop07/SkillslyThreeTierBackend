import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import { HttpUser } from '../authentication/decorator/http_user';
import { HttpUserPayload } from '../authentication/types/http_authentication_types';
import { AddReactionInvalidTypeException, AddReactionUnexistingPostException } from '@core/domain/reaction/use_case/exception/reaction.exception';

@Controller('reaction')
@ApiTags('reaction')
export class ReactionController {
  private readonly logger: Logger = new Logger(ReactionController.name);

  constructor(
    @Inject(ReactionDITokens.AddReactionInteractor)
    private readonly add_reaction_interactor: AddReactionInteractor
  ) {}

  @Post(':post_id/react')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async addOrRemoveReaction(@HttpUser() http_user: HttpUserPayload, 
    @Param('post_id') post_id: string,
    @Body() body){
    try {
      return await this.add_reaction_interactor.execute({
        post_id: post_id,
        reactor_id: http_user.id,
        reaction_type: body.reaction_type
      });
    } catch (e){
      this.logger.error(e);
      if (e instanceof AddReactionInvalidTypeException){
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid reaction type'
        }, HttpStatus.FORBIDDEN);
      } else if (e instanceof AddReactionUnexistingPostException){
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Can not react to a post that does not exist'
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  
}

