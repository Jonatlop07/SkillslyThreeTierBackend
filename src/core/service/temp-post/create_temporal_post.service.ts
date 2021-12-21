import { CreateTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/create_temporal_post.interactor';
import { Inject } from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import CreateTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/create_temporal_post.gateway';
import CreateTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/create_temporal_post.input_model';
import CreateTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/create_temporal_post.output_model';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { isValidURL } from '@core/common/util/validators/permanent_post.validators';
import {
  InvalidInputException,
  InvalidReferenceException, InvalidReferenceTypeException,
} from '@core/domain/temp-post/use-case/exception/temp-post.exception';

export class CreateTemporalPostService implements CreateTemporalPostInteractor {
  constructor(@Inject(TempPostDITokens.TempPostRepository) private readonly gateway: CreateTemporalPostGateway) {
  }

  async execute(input: CreateTemporalPostInputModel): Promise<CreateTemporalPostOutputModel> {
    if (!input.reference || !input.referenceType) {
      throw new InvalidInputException();
    }
    if (!isValidURL(input.reference)) {
      throw new InvalidReferenceException();
    }
    if (input.referenceType === 'jpg' || input.referenceType === 'mp4') {
      const createdPost: TemporalPostDTO = await this.gateway.create(input);
      return createdPost as CreateTemporalPostOutputModel;
    } else {
      throw new InvalidReferenceTypeException();
    }

  }

}
