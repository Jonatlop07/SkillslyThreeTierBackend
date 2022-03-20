import TemporalPostQueryModel from '@core/domain/temporal-post/use-case/query_model/temporal_post.query_model';

export default interface FindAllWithRelationship {
  findAllWithRelationship(params: TemporalPostQueryModel): Promise<any>;
}
