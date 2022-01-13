import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Injectable, Logger } from '@nestjs/common';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { QueryResult } from 'neo4j-driver-core';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { Optional } from '@core/common/type/common_types';
import { ServiceRequestApplicationDTO } from '@core/domain/service-request/use-case/persistence-dto/service-request-applications/service_request_application.dto';

@Injectable()
export class ServiceRequestNeo4jRepositoryAdapter
implements ServiceRequestRepository {
  private readonly logger: Logger = new Logger(
    ServiceRequestNeo4jRepositoryAdapter.name,
  );

  private readonly requester_key = 'requester';
  private readonly user_key = 'user';
  private readonly users_key = 'users';
  private readonly service_request_key = 'service_request';

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(
    service_request: ServiceRequestDTO,
  ): Promise<ServiceRequestDTO> {
    const {
      owner_id,
      title,
      service_brief,
      contact_information,
      category,
      phase,
    } = service_request;
    const create_service_request_statement = `
      MATCH (${this.requester_key}: Requester { user_id: $user_id })
      CREATE (${this.service_request_key}: ServiceRequest)
      SET ${this.service_request_key} += $properties, ${this.service_request_key}.service_request_id = randomUUID()
      CREATE (${this.requester_key})-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]->(${this.service_request_key})
      RETURN ${this.service_request_key}
    `;
    const created_service_request: ServiceRequestDTO =
      this.neo4j_service.getSingleResultProperties(
        await this.neo4j_service.write(create_service_request_statement, {
          user_id: owner_id,
          properties: {
            title,
            service_brief,
            contact_information,
            category,
            phase,
            created_at: getCurrentDate(),
          },
        }),
        this.service_request_key,
      );
    return {
      ...created_service_request,
      owner_id,
    };
  }

  public async exists(t: ServiceRequestDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public async existsById(id: string): Promise<boolean> {
    const exists_service_request_query = `
      MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
      RETURN ${this.service_request_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_service_request_query,
      {
        service_request_id: id,
      },
    );
    return result.records.length > 0;
  }

  public async update(service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> {
    const { service_request_id, title, service_brief, contact_information, category } = service_request;
    const update_service_request_statement = `
      MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
      SET ${this.service_request_key} += $properties
      RETURN ${this.service_request_key}
    `;
    return {
      ...this.neo4j_service.getSingleResultProperties(
        await this.neo4j_service.write(
          update_service_request_statement,
          {
            service_request_id,
            properties: {
              title,
              service_brief,
              contact_information,
              category
            }
          }
        ),
        this.service_request_key
      ),
      applicants: service_request.applicants,
      service_provider: service_request.service_provider
    };
  }

  public async delete(params: ServiceRequestQueryModel): Promise<void> {
    const { service_request_id, owner_id } = params;
    const delete_service_request_statement = `
      MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.requester_key}: Requester { user_id: $owner_id })
      DETACH DELETE ${this.service_request_key}
    `;
    await this.neo4j_service.write(delete_service_request_statement, {
      service_request_id,
      owner_id,
    });
  }

  deleteById(id: string): Promise<void> {
    id;
    throw new Error('Not implemented');
  }

  public async findOne(
    params: ServiceRequestQueryModel,
  ): Promise<Optional<ServiceRequestDTO>> {
    const find_service_request_query = `
      MATCH (${this.service_request_key}: ServiceRequest: ServiceRequest { service_request_id: $service_request_id })
      WITH ${this.service_request_key}
      OPTIONAL MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.user_key} 
      OPTIONAL MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.users_key}: User)
      RETURN ${this.service_request_key}, ${this.user_key}, ${this.users_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_service_request_query,
      {
        service_request_id: params.service_request_id
      }
    );
    return {
      ...this.neo4j_service.getSingleResultProperties(
        result,
        this.service_request_key
      ),
      service_provider: this.neo4j_service.getSingleResultProperties(
        result,
        this.user_key
      ),
      applicants: this.neo4j_service.getMultipleResultByKey(
        result,
        this.users_key
      )
    };
  }

  async createApplication(
    params: ServiceRequestApplicationDTO,
  ): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id, message } = params;
    const create_application_query = `
      MATCH (${this.user_key}:User { user_id: $applicant_id }), 
            (${this.service_request_key}: ServiceRequest { service_request_id: $request_id })
      CREATE (${this.user_key})-[r:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP} {application_message: $message}]->(${this.service_request_key})
      RETURN ${this.user_key}.user_id as applicant, ${this.service_request_key}.service_request_id as request
    `;

    const result = await this.neo4j_service.write(create_application_query, {
      applicant_id,
      request_id,
      message,
    });
    return {
      applicant_id: this.neo4j_service.getSingleResultProperty(
        result,
        'applicant',
      ),
      request_id: this.neo4j_service.getSingleResultProperty(result, 'request'),
    };
  }

  findAll(params: ServiceRequestQueryModel): Promise<ServiceRequestDTO[]> {
    params;
    return Promise.resolve([]);
  }

  findAllWithRelation(params: ServiceRequestQueryModel): Promise<any> {
    params;
    return Promise.resolve(undefined);
  }
}
