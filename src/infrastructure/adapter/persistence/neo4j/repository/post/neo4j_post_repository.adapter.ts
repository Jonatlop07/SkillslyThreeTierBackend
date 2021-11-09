import { Injectable, Logger } from '@nestjs/common';
import PostRepository from '@core/domain/post/use-case/post.repository';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { PostDTO } from '@core/domain/post/use-case/persistence_dto/post.dto';

@Injectable()
export class PostNeo4jRepositoryAdapter implements PostRepository {
  private readonly logger: Logger = new Logger(PostNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async update(post: PostDTO): Promise<PostDTO> {

    return undefined;
  }
}
