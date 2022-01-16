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
import { UpdateRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request_update_request.dto';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';

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
  private readonly applicant_key = 'applicant';
  private readonly provider_key = 'provider';
  private readonly phase_key = 'phase';
  private readonly user_key2 = 'user2';


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

  public async findOne(params: ServiceRequestQueryModel): Promise<Optional<ServiceRequestDTO>> {
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
    if (!result.records[0]){
      return undefined;
    }
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
      RETURN ${this.user_key}.user_id as ${this.applicant_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}
    `;

    const result = await this.neo4j_service.write(create_application_query, {
      applicant_id,
      request_id,
      message,
    });
    return {
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
    };
  }

  async removeApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    const cancel_application_query = `
      MATCH (${this.user_key}:User { user_id:$applicant_id })
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      DELETE r
      RETURN ${this.user_key}.user_id as ${this.applicant_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}
    `;

    const result = await this.neo4j_service.write(cancel_application_query, {
      applicant_id,
      request_id,
    });
    return {
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
    };
  }

  async acceptApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    const accept_applicaction_query = `
      MATCH (${this.user_key}:User { user_id:$applicant_id })
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      CREATE (${this.user_key})
      -[:${Relationships.APPLICANT_SERVICE_REQUEST_EVALUATION_RELATIONSHIP}]
      ->(${this.service_request_key})
      SET ${this.service_request_key}.phase = $phase
      DELETE r
      RETURN ${this.user_key}.user_id as ${this.applicant_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, ${this.service_request_key}.phase as ${this.phase_key}
    `;

    const result = await this.neo4j_service.write(accept_applicaction_query, { applicant_id, request_id, phase: ServiceRequestPhase.Evaluation });
    return {
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_phase: this.neo4j_service.getSingleResultProperty(result, this.phase_key)
    };
  }

  async confirmApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    const confirm_applicaction_query = `
      MATCH (${this.user_key}:User { user_id:$applicant_id })
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_EVALUATION_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      CREATE (${this.user_key})
      -[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key})
      SET ${this.service_request_key}.phase = $phase
      DELETE r
      RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, ${this.service_request_key}.phase as ${this.phase_key}
    `;

    const result = await this.neo4j_service.write(confirm_applicaction_query, { applicant_id, request_id, phase: ServiceRequestPhase.Execution });
    return {
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_phase: this.neo4j_service.getSingleResultProperty(result, this.phase_key)
    };
  }

  async denyApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    const deny_applicaction_query = `
      MATCH (${this.user_key}:User { user_id:$applicant_id })
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_EVALUATION_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      SET ${this.service_request_key}.phase = $phase
      DELETE r
      RETURN ${this.user_key}.user_id as ${this.applicant_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, ${this.service_request_key}.phase as ${this.phase_key}
    `;

    const result = await this.neo4j_service.write(deny_applicaction_query, { applicant_id, request_id, phase: ServiceRequestPhase.Open });
    return {
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_phase: this.neo4j_service.getSingleResultProperty(result, this.phase_key)
    };
  }

  async existsApplication(params: ServiceRequestQueryModel): Promise<boolean> {
    const { service_request_id, owner_id } = params;
    const exists_service_request_application_query = `
      MATCH (${this.user_key}:User { user_id:$owner_id })
      -[:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      RETURN ${this.service_request_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_service_request_application_query,
      { owner_id, service_request_id }
    );
    return result.records.length > 0;
  }

  async getApplications(request_id: string): Promise<ServiceRequestApplicationDTO[]> {
    const get_service_request_applications_query = `
      MATCH (${this.user_key}: User)
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      RETURN ${this.user_key}.user_id, ${this.user_key}.email, ${this.service_request_key}.service_request_id, r.application_message
    `;
    const result = await this.neo4j_service
      .read(get_service_request_applications_query, { request_id })
      .then((result: QueryResult) =>
        result.records.map((record:any) => {
          return {
            applicant_id: record._fields[0],
            applicant_email: record._fields[1],
            request_id: record._fields[2],
            message: record._fields[3]
          };
        })
      );

    return result.map((application) => ({
      ...application
    }));
  }

  async existsRequest(params: UpdateRequestDTO): Promise<boolean> {
    const { service_request_id, provider_id } = params;
    const exists_service_request_cancel_or_completion_request_query = `
      MATCH (${this.user_key}:User { user_id:$provider_id })
      -[:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      RETURN ${this.service_request_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_service_request_cancel_or_completion_request_query,
      { provider_id, service_request_id }
    );
    return result.records.length > 0;
  }

  async createCompleteRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const { service_request_id, provider_id } = params;
    const date = getCurrentDate();
    const create_complete_service_request_query = `
      MATCH (${this.user_key}:User { user_id:$provider_id })
      -[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id }),
      (${this.user_key2}:User)
      -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      CREATE (${this.user_key})
      -[r:${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP} { request_date:$date }]
      ->(${this.service_request_key})
      RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, ${this.user_key2}.user_id as ${this.requester_key}
    `;

    const result = await this.neo4j_service.write(create_complete_service_request_query, { provider_id, service_request_id, date  });
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      provider_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_date: date,
      requester_id: this.neo4j_service.getSingleResultProperty(result, this.requester_key)
    };
  }

  async createCancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const { service_request_id, provider_id } = params;
    const date = getCurrentDate();
    const create_cancel_service_request_query = `
      MATCH (${this.user_key}:User { user_id:$provider_id })
      -[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id }),
      (${this.user_key2}:User)
      -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      CREATE (${this.user_key})
      -[r:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} { request_date:$date }]
      ->(${this.service_request_key})
      RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, ${this.user_key2}.user_id as ${this.requester_key}
    `;

    const result = await this.neo4j_service.write(create_cancel_service_request_query, { provider_id, service_request_id, date  });
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      provider_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_date: date,
      requester_id: this.neo4j_service.getSingleResultProperty(result, this.requester_key)
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
