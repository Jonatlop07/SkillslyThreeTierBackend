import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import ProjectRepository from '@core/domain/project/use-case/repository/project.repository';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import * as moment from 'moment';

@Injectable()
export class ProjectNeo4jRepositoryAdapter implements ProjectRepository {
  private readonly logger: Logger = new Logger(
    ProjectNeo4jRepositoryAdapter.name,
  );

  constructor(private readonly neo4j_service: Neo4jService) {}

  private readonly project_key = 'project';
  private readonly user_key = 'user';

  public async create(project: ProjectDTO): Promise<ProjectDTO> {
    const create_project_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      CREATE (${this.project_key}: Project)
      SET ${this.project_key} += $properties, ${this.project_key}.project_id = randomUUID()
      CREATE (${this.user_key})-[:${Relationships.USER_PROJECT_RELATIONSHIP}]->(${this.project_key})
      RETURN ${this.project_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_project_statement,
      {
        user_id: project.user_id,
        properties: {
          ...project,
          created_at: moment().local().format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    );
    const created_project = this.neo4j_service.getSingleResultProperties(
      result,
      this.project_key,
    );
    return {
      project_id: created_project.post_id,
      title: created_project.title,
      members: created_project.members,
      description: created_project.description,
      reference: created_project.reference,
      reference_type: created_project.reference_type,
      annexes: created_project.annexes,
      user_id: project.user_id,
      created_at: created_project.created_at,
    };
  }
}
