import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import ProjectRepository from '@core/domain/project/use-case/repository/project.repository';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import ProjectQueryModel from '@core/domain/project/use-case/query-model/project.query_model';
import CreateProjectPersistenceDTO from '@core/domain/project/use-case/persistence-dto/create_project.persistence_dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';

@Injectable()
export class ProjectNeo4jRepositoryAdapter implements ProjectRepository {
  private readonly logger: Logger = new Logger(
    ProjectNeo4jRepositoryAdapter.name
  );

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  private readonly project_key = 'project';
  private readonly user_key = 'user';

  public async create(project: CreateProjectPersistenceDTO): Promise<ProjectDTO> {
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
        owner_id: project.owner_id,
        properties: {
          ...project,
          created_at: getCurrentDate()
        }
      }
    );
    const created_project = this.neo4j_service.getSingleResultProperties(
      result,
      this.project_key
    );
    return {
      project_id: created_project.project_id,
      title: created_project.title,
      members: created_project.members,
      description: created_project.description,
      reference: created_project.reference,
      reference_type: created_project.reference_type,
      annexes: created_project.annexes,
      owner_id: project.owner_id,
      created_at: created_project.created_at
    };
  }

  public async findAll(params: ProjectQueryModel): Promise<ProjectDTO[]> {
    const { owner_id } = params;
    const user_id_key = 'user_id';
    const user_name_key = 'name';
    const find_projects_collection_query = `
      MATCH (${this.user_key}: User { user_id: $owner_id })
        -[:${Relationships.USER_PROJECT_RELATIONSHIP}]
        ->(${this.project_key}: Project)
      RETURN ${this.project_key}, ${this.user_key}.user_id AS ${user_id_key}, ${this.user_key}.name AS ${user_name_key}
    `;
    const result = await this.neo4j_service
      .read(find_projects_collection_query, {
        owner_id
      })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            user_id: this.neo4j_service.getSingleResultProperty(result, user_id_key),
            project_id: record._fields[0].properties.project_id,
            created_at: record._fields[0].properties.created_at,
            user_name: this.neo4j_service.getSingleResultProperty(result, user_name_key),
            title: record._fields[0].properties.title,
            members: record._fields[0].properties.members,
            description: record._fields[0].properties.description,
            reference: record._fields[0].properties.reference,
            reference_type: record._fields[0].properties.reference_type,
            annexes: record._fields[0].properties.annexes
          };
        })
      );

    return result.map((project) => ({
      ...project
    }));
  }

  findAllWithRelation(params: ProjectQueryModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async findOne(params: ProjectQueryModel): Promise<ProjectDTO> {
    const { project_id } = params;
    const user_id_key = 'user_id';
    const user_name_key = 'name';
    const find_project_query = `
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_PROJECT_RELATIONSHIP}]
        ->(${this.project_key}: Project { project_id: $project_id })
      RETURN ${this.project_key}, ${this.user_key}.user_id AS ${user_id_key}, ${this.user_key}.name AS ${user_name_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(find_project_query, {
      project_id
    });
    const found_project = this.neo4j_service.getSingleResultProperties(
      result,
      this.project_key
    );
    if (!found_project)
      return null;
    return {
      owner_id: this.neo4j_service.getSingleResultProperty(result, user_id_key),
      project_id: found_project.project_id,
      created_at: found_project.created_at,
      user_name: this.neo4j_service.getSingleResultProperty(result, user_name_key),
      title: found_project.title,
      members: found_project.members,
      description: found_project.description,
      reference: found_project.reference,
      reference_type: found_project.reference_type,
      annexes: found_project.annexes
    };
  }

  delete(params: string): Promise<ProjectDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  public async deleteById(id: string): Promise<ProjectDTO> {
    const project_key = 'project';
    const user_key = 'user';
    const delete_project_statement = `
      MATCH (${project_key}: Project { project_id: $id })
        <-[:${Relationships.USER_PROJECT_RELATIONSHIP}]
        -(${user_key}: User)
      DETACH DELETE ${project_key}
      RETURN ${project_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      delete_project_statement,
      { id }
    );
    return this.neo4j_service.getSingleResultProperties(result, project_key);
  }

  public async update(project: ProjectDTO): Promise<ProjectDTO> {
    const update_project_query = `
      MATCH (${this.project_key}: Project { project_id: $project_id })
      SET ${this.project_key} += $properties
      RETURN ${this.project_key}
    `;
    const result = await this.neo4j_service.write(update_project_query, {
      project_id: project.project_id,
      properties: {
        ...project,
        updated_at: getCurrentDate()
      }
    });
    const updated_project = this.neo4j_service.getSingleResultProperties(
      result,
      'project'
    );
    return {
      project_id: updated_project.project_id,
      title: updated_project.title,
      members: updated_project.members,
      description: updated_project.description,
      reference: updated_project.reference,
      reference_type: updated_project.reference_type,
      annexes: updated_project.annexes,
      created_at: updated_project.created_at,
      updated_at: updated_project.updated_at,
      owner_id: project.owner_id
    };
  }
}
