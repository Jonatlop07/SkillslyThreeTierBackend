import SharePermanentPostPersistenceDTO
  from '@core/domain/permanent-post/use-case/persistence-dto/share_permanent_post.persistence_dto';

export default interface Share {
  share(param: SharePermanentPostPersistenceDTO): Promise<void>;
}
