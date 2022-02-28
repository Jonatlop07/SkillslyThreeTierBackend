import { CreateTemporalPostInteractor } from '@core/domain/temporal-post/use-case/interactor/create_temporal_post.interactor';
import { Inject } from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temporal-post/di/temp-post_di_tokens';
import CreateTemporalPostGateway from '@core/domain/temporal-post/use-case/gateway/create_temporal_post.gateway';
import CreateTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/create_temporal_post.input_model';
import CreateTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/create_temporal_post.output_model';
import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';
import { isValidURL } from '@core/common/util/validators/permanent_post.validators';
import {
  InvalidInputException,
  InvalidReferenceException, InvalidReferenceTypeException,
} from '@core/domain/temporal-post/use-case/exception/temporal_post.exception';

export class CreateTemporalPostService implements CreateTemporalPostInteractor {
  constructor(@Inject(TempPostDITokens.TempPostRepository) private readonly gateway: CreateTemporalPostGateway) {
  }

  async execute(input: CreateTemporalPostInputModel): Promise<CreateTemporalPostOutputModel> {
    const { description, reference, referenceType, owner_id } = input;
    if (!reference || !referenceType) {
      throw new InvalidInputException();
    }
    if (!isValidURL(reference)) {
      throw new InvalidReferenceException();
    }
    if (referenceType === 'jpg' || referenceType === 'mp4') {
      const createdPost: TemporalPostDTO = await this.gateway.create({
        owner_id,
        description,
        reference,
        referenceType
      });
      return createdPost as CreateTemporalPostOutputModel;
    } else {
      throw new InvalidReferenceTypeException();
    }
  }
}
