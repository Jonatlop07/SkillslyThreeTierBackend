import TemporalPostRepository from '@core/domain/temp-post/use-case/repository/temporal_post.repository';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import * as moment from 'moment';

export class TemporalPostInMemoryRepository implements TemporalPostRepository {
  private current_available_post_id: string;

  constructor(private readonly temporalPosts: Map<string, TemporalPostDTO>) {
    this.current_available_post_id = '1';
  }

  public create(post: TemporalPostDTO): Promise<TemporalPostDTO> {
    const newTempPost: TemporalPostDTO = {
      temporal_post_id: this.current_available_post_id,
      created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
      expires_at: moment().add(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
      description: post.description,
      reference: post.reference,
      referenceType: post.referenceType,
      user_id: post.user_id,
    };
    this.temporalPosts.set(this.current_available_post_id, newTempPost);
    this.current_available_post_id = String(Number(this.current_available_post_id) + 1);
    return Promise.resolve(newTempPost);
  }

}