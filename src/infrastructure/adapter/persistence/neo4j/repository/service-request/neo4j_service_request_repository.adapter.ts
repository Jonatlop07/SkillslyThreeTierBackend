import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Injectable, Logger } from '@nestjs/common';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { QueryResult } from 'neo4j-driver-core';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { Optional } from '@core/common/type/common_types';

@Injectable()
export class ServiceRequestNeo4jRepositoryAdapter implements ServiceRequestRepository {
  private readonly logger: Logger = new Logger(ServiceRequestNeo4jRepositoryAdapter.name);

  private readonly requester_key = 'requester';
  private readonly user_key = 'user';
  private readonly users_key = 'users';
  private readonly service_request_key = 'service_request';

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> {
    const { owner_id, title, service_brief, contact_information, category, phase } = service_request;
    const create_service_request_statement = `
      MATCH (${this.requester_key}: Requester { user_id: $user_id })
      CREATE (${this.service_request_key}: ServiceRequest)
      SET ${this.service_request_key} += $properties, ${this.service_request_key}.service_request_id = randomUUID()
      CREATE (${this.requester_key})-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]->(${this.service_request_key})
      RETURN ${this.service_request_key}
    `;
    const created_service_request: ServiceRequestDTO = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        create_service_request_statement,
        {
          user_id: owner_id,
          properties: {
            title,
            service_brief,
            contact_information,
            category,
            phase,
            created_at: getCurrentDate()
          }
        }
      ),
      this.service_request_key
    );
    return {
      ...created_service_request,
      owner_id
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
        service_request_id: id
      }
    );
    return result.records.length > 0;
  }

  public async update(service_offer: ServiceRequestDTO): Promise<ServiceRequestDTO> {
    const { service_request_id, title, service_brief, contact_information, category } = service_offer;
    const update_service_request_statement = `
      MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
      SET ${this.service_request_key} += $properties
      RETURN ${this.service_request_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
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
    );
  }

  public async delete(params: ServiceRequestQueryModel): Promise<void> {
    const { service_request_id, owner_id } = params;
    const delete_service_request_statement = `
      MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.requester_key}: Requester { requester_id: $owner_id })
      DETACH DELETE ${this.service_request_key}
    `;
    await this.neo4j_service.write(
      delete_service_request_statement,
      {
        service_request_id,
        owner_id
      }
    );
  }

  deleteById(id: string): Promise<void> {
    id;
    throw new Error('Not implemented');
  }

  public async findOne(params: ServiceRequestQueryModel): Promise<Optional<ServiceRequestDTO>> {
    const find_service_request_query = `
      MATCH (${this.service_request_key}: ServiceRequest: ServiceRequest { service_request_id: $service_request_id }),
        (${this.service_request_key})
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User),
        (${this.service_request_key})
        <-[:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.users_key}: User),
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

  findAll(params: ServiceRequestQueryModel): Promise<ServiceRequestDTO[]> {
    params;
    return Promise.resolve([]);
  }

  findAllWithRelation(params: ServiceRequestQueryModel): Promise<any> {
    params;
    return Promise.resolve(undefined);
  }
}
