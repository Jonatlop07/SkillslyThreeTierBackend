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
import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

@Injectable()
export class ServiceRequestNeo4jRepositoryAdapter
implements ServiceRequestRepository {
  private readonly logger: Logger = new Logger(
    ServiceRequestNeo4jRepositoryAdapter.name
  );

  private readonly requester_key = 'requester';
  private readonly user_key = 'user';
  private readonly users_key = 'users';
  private readonly service_request_key = 'service_request';
  private readonly applicant_key = 'applicant';
  private readonly provider_key = 'provider';
  private readonly service_request_title_key = 'service_request_title';
  private readonly phase_key = 'phase';
  private readonly relationship = 'r';

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(
    service_request: ServiceRequestDTO
  ): Promise<ServiceRequestDTO> {
    const {
      owner_id,
      title,
      service_brief,
      contact_information,
      category,
      phase
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
            created_at: getCurrentDate()
          }
        }),
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
      owner_id
    });
  }

  deleteById(id: string): Promise<void> {
    id;
    throw new Error('Not implemented');
  }

  async createApplication(
    params: ServiceRequestApplicationDTO
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
      message
    });
    return {
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key)
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
      request_id
    });
    return {
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key)
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
      RETURN ${this.user_key}.user_id as ${this.applicant_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key},
       ${this.service_request_key}.phase as ${this.phase_key}
    `;

    const result = await this.neo4j_service.write(accept_applicaction_query, {
      applicant_id,
      request_id,
      phase: ServiceRequestPhase.Evaluation
    });
    return {
      request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      applicant_id: this.neo4j_service.getSingleResultProperty(result, this.applicant_key),
      request_phase: this.neo4j_service.getSingleResultProperty(result, this.phase_key),
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

    const result = await this.neo4j_service.write(confirm_applicaction_query, {
      applicant_id,
      request_id,
      phase: ServiceRequestPhase.Execution
    });
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

    const result = await this.neo4j_service.write(deny_applicaction_query, {
      applicant_id,
      request_id,
      phase: ServiceRequestPhase.Open
    });
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
      RETURN ${this.user_key}.user_id, ${this.user_key}.email, ${this.user_key}.name, ${this.service_request_key}.service_request_id, r.application_message
    `;
    const result = await this.neo4j_service
      .read(get_service_request_applications_query, { request_id })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            applicant_id: record._fields[0],
            applicant_email: record._fields[1],
            applicant_name: record._fields[2],
            request_id: record._fields[3],
            message: record._fields[4]
          };
        })
      );

    return result.map((application) => ({
      ...application
    }));
  }

  async getEvaluationApplicant(request_id: string): Promise<ServiceRequestApplicationDTO> {
    const get_service_request_evaluated_applicant_query = `
      MATCH (${this.user_key}:User)
      -[r:${Relationships.APPLICANT_SERVICE_REQUEST_EVALUATION_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$request_id })
      RETURN ${this.user_key}, ${this.service_request_key}.service_request_id as request, r as ${this.relationship}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      get_service_request_evaluated_applicant_query,
      { request_id }
    );
    const applicant = this.neo4j_service.getSingleResultProperties(result, this.user_key);
    if (!applicant){
      return null;
    }
    return {
      applicant_id: applicant.user_id,
      applicant_email: applicant.email,
      applicant_name: applicant.name,
      request_id: this.neo4j_service.getSingleResultProperty(result, 'request'), 
      request_phase: this.neo4j_service.getSingleResultProperty(result, this.relationship).type
    };
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
      (${this.requester_key}:Requester)
      -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      CREATE (${this.user_key})
      -[r:${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP} { request_date:$date }]
      ->(${this.service_request_key})
      RETURN ${this.user_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key},
       ${this.requester_key}, ${this.service_request_key}.title as ${this.service_request_title_key}
    `;
    const result = await this.neo4j_service.write(create_complete_service_request_query, {
      provider_id,
      service_request_id,
      date
    });

    const provider = this.neo4j_service.getSingleResultProperties(result, this.user_key);
    const requester: UserDTO = this.neo4j_service.getSingleResultProperties(result, this.requester_key);
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      service_request_title: this.neo4j_service.getSingleResultProperty(result, this.service_request_title_key),
      provider_id: provider.user_id,
      request_date: date,
      requester_id: requester.user_id,
      provider_name: provider.name
    };
  }

  async createCancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const { service_request_id, provider_id } = params;
    const date = getCurrentDate();
    const create_cancel_service_request_query = `
      MATCH (${this.user_key}:User { user_id:$provider_id })
      -[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id }),
      (${this.requester_key}: Requester)
      -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
      ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
      CREATE (${this.user_key})
      -[r:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} { request_date:$date }]
      ->(${this.service_request_key})
      RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key},
        ${this.service_request_key}.title as ${this.service_request_title_key}, ${this.requester_key}
    `;
    const result = await this.neo4j_service.write(create_cancel_service_request_query, {
      provider_id,
      service_request_id,
      date
    });
    const requester: UserDTO = this.neo4j_service.getSingleResultProperties(result, this.requester_key);
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      service_request_title: this.neo4j_service.getSingleResultProperty(result, this.service_request_title_key),
      provider_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_date: date,
      requester_id: requester.user_id,
      requester_name: requester.name
    };
  }

  public async completeRequest(params: UpdateRequestDTO,  requestedUpdateStatusIsCompletion: boolean): Promise<UpdateRequestDTO> {
    const { service_request_id, provider_id, requester_id } = params;
    let phase: string; 
    if (requestedUpdateStatusIsCompletion) {
      phase= ServiceRequestPhase.Finished;
    } else {
      phase = ServiceRequestPhase.Canceled;
    }
    const date = getCurrentDate();
    const complete_service_request_query = `
    MATCH (${this.user_key}:User { user_id:$provider_id })
    -[r:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
    ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id }), 
    (${this.requester_key}: Requester { user_id:$requester_id })
    -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
    ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
    SET ${this.service_request_key}.phase = $phase
    DELETE r
    CREATE (${this.user_key})
    -[:${Relationships.SERVICE_REQUEST_CLOSED_RELATIONSHIP} { request_date:$date }]
    ->(${this.service_request_key})
    RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key}, 
    ${this.service_request_key}.title as ${this.service_request_title_key}, ${this.requester_key}
    `;
    const result = await this.neo4j_service.write(complete_service_request_query, {
      provider_id,
      service_request_id,
      requester_id,
      date,
      phase
    });
    const requester: UserDTO = this.neo4j_service.getSingleResultProperties(result, this.requester_key);
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      service_request_title: this.neo4j_service.getSingleResultProperty(result, this.service_request_title_key),
      provider_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_date: date,
      requester_id: requester.user_id,
      requester_name: requester.name,
      phase
    };
  }

  public async cancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const { service_request_id, provider_id, requester_id } = params;
    const date = getCurrentDate();
    const cancel_service_request_query = `
    MATCH (${this.user_key}:User { user_id:$provider_id })
    -[r:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
    ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id }), 
    (${this.requester_key}: Requester { user_id:$requester_id })
    -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
    ->(${this.service_request_key}:ServiceRequest { service_request_id:$service_request_id })
    DELETE r
    RETURN ${this.user_key}.user_id as ${this.provider_key}, ${this.service_request_key}.service_request_id as ${this.service_request_key},
    ${this.service_request_key}.title as ${this.service_request_title_key}, ${this.requester_key}
    `;
    const result = await this.neo4j_service.write(cancel_service_request_query, {
      provider_id,
      service_request_id,
      requester_id,
      date
    });
    const requester: UserDTO = this.neo4j_service.getSingleResultProperties(result, this.requester_key);
    return {
      service_request_id: this.neo4j_service.getSingleResultProperty(result, this.service_request_key),
      service_request_title: this.neo4j_service.getSingleResultProperty(result, this.service_request_title_key),
      provider_id: this.neo4j_service.getSingleResultProperty(result, this.provider_key),
      request_date: date,
      requester_id: requester.user_id,
      requester_name: requester.name, 
    };
  }

  public async findOne(params: ServiceRequestQueryModel): Promise<Optional<ServiceRequestDTO>> {
    const find_service_request_query = `
      MATCH (${this.service_request_key}: ServiceRequest: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.requester_key}: Requester)
      WITH ${this.service_request_key}, ${this.requester_key}
      OPTIONAL MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.requester_key}, ${this.user_key} 
      OPTIONAL MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[:${Relationships.APPLICANT_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.users_key}: User)
      OPTIONAL MATCH (${this.service_request_key}: ServiceRequest { service_request_id: $service_request_id })
        <-[r:${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP}|${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
        -(${this.user_key}:User)
      RETURN ${this.service_request_key}, ${this.requester_key}, ${this.user_key}, ${this.users_key}, r as ${this.relationship}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_service_request_query,
      {
        service_request_id: params.service_request_id
      }
    );
    if (!result.records[0]) {
      return undefined;
    }
    let requested_status_update =  this.neo4j_service.getSingleResultProperty(result, this.relationship);
    if (requested_status_update) {
      requested_status_update = requested_status_update.type
    } else {
      requested_status_update = ''; 
    }
    return {
      ...this.neo4j_service.getSingleResultProperties(
        result,
        this.service_request_key
      ),
      owner_id: this.neo4j_service.getSingleResultProperties(
        result,
        this.requester_key
      ).user_id,
      service_provider: this.neo4j_service.getSingleResultProperties(
        result,
        this.user_key
      ),
      applicants: this.neo4j_service.getMultipleResultByKey(
        result,
        this.users_key
      ),
      requested_status_update
    };
  }

  public async findAll(params: ServiceRequestQueryModel, pagination: PaginationDTO): Promise<Array<ServiceRequestDTO>> {
    const { limit, offset } = pagination;
    const find_all_statement = `
      MATCH (${this.service_request_key}: ServiceRequest)
        <-[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.requester_key}: Requester)
      WITH ${this.service_request_key}, ${this.requester_key}
      OPTIONAL MATCH (${this.service_request_key})
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.requester_key}, ${this.user_key}
      OPTIONAL MATCH (${this.user_key})
        -[${this.relationship}: ${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} | ${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
        ->(${this.service_request_key})
      RETURN ${this.service_request_key}, ${this.requester_key}, ${this.user_key}, ${this.relationship}
      ORDER BY ${this.service_request_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_all_statement,
      {}
    );
    const service_requests_without_applicants = result.records.map(
      (record): ServiceRequestDTO =>
        ({
          ...record.get(this.service_request_key).properties,
          owner_id: record.get(this.requester_key).properties.user_id,
          service_provider: record.get(this.user_key) ? record.get(this.user_key).properties.user_id : null,
          applicants: [],
          provider_requested_status_update: !!record.get(this.relationship)
        })
    );
    return await Promise.all(
      service_requests_without_applicants
        .map(
          async (service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> =>
            ({
              ...service_request,
              applicants: (await this.getApplications(service_request.service_request_id))
                .map((applicant) => applicant.applicant_id)
            })
        )
    );
  }

  public async findAllByUserAndCategories(params: ServiceRequestQueryModel, pagination: PaginationDTO) {
    const { owner_id, categories } = params;
    const { limit, offset } = pagination;
    const find_all_by_user_and_categories_statement = `
      MATCH 
        (${this.requester_key}: Requester { user_id: $user_id })
        -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        ->(${this.service_request_key}: ServiceRequest)
      WHERE ${this.service_request_key}.category IN $categories
      WITH ${this.service_request_key}
      OPTIONAL MATCH (${this.service_request_key})
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.user_key}
      OPTIONAL MATCH (${this.user_key})
        -[${this.relationship}: ${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} | ${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
        ->(${this.service_request_key})
      RETURN ${this.service_request_key}, ${this.user_key}, ${this.relationship}
      ORDER BY ${this.service_request_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_all_by_user_and_categories_statement,
      {
        user_id: owner_id,
        categories
      }
    );
    const service_requests_without_applicants = result.records.map(
      (record): ServiceRequestDTO =>
        ({
          ...record.get(this.service_request_key).properties,
          owner_id,
          service_provider: record.get(this.user_key) ? record.get(this.user_key).properties.user_id : null,
          applicants: [],
          provider_requested_status_update: !!record.get(this.relationship)
        })
    );
    return await Promise.all(
      service_requests_without_applicants
        .map(
          async (service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> =>
            ({
              ...service_request,
              applicants: (await this.getApplications(service_request.service_request_id))
                .map((applicant) => applicant.applicant_id)
            })
        )
    );
  }

  public async findAllByCategories(categories: Array<string>, pagination: PaginationDTO)
    : Promise<Array<ServiceRequestDTO>> {
    const { limit, offset } = pagination;
    const find_all_by_categories_statement = `
      MATCH
        (${this.requester_key}: Requester)
        -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        ->(${this.service_request_key}: ServiceRequest)
      WHERE ${this.service_request_key}.category IN $categories
      WITH ${this.service_request_key}, ${this.requester_key}
      OPTIONAL MATCH (${this.service_request_key})
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.requester_key}, ${this.user_key}
      OPTIONAL MATCH (${this.user_key})
        -[${this.relationship}: ${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} | ${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
        ->(${this.service_request_key})
      RETURN ${this.service_request_key}, ${this.requester_key}, ${this.user_key}, ${this.relationship}
      ORDER BY ${this.service_request_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_all_by_categories_statement,
      {
        categories
      }
    );
    const service_requests_without_applicants = result.records.map(
      (record): ServiceRequestDTO =>
        ({
          ...record.get(this.service_request_key).properties,
          owner_id: record.get(this.requester_key).properties.user_id,
          service_provider: record.get(this.user_key) ? record.get(this.user_key).properties.user_id : null,
          applicants: [],
          provider_requested_status_update: !!record.get(this.relationship)
        })
    );
    return await Promise.all(
      service_requests_without_applicants
        .map(
          async (service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> =>
            ({
              ...service_request,
              applicants: (await this.getApplications(service_request.service_request_id))
                .map((applicant) => applicant.applicant_id)
            })
        )
    );
  }

  public async findAllByUser(user_id: string, pagination: PaginationDTO)
    : Promise<Array<ServiceRequestDTO>> {
    const { limit, offset } = pagination;
    const find_all_by_user_id = `
      MATCH 
        (${this.requester_key}: Requester { user_id: $user_id })
        -[:${Relationships.REQUESTER_SERVICE_REQUEST_RELATIONSHIP}]
        ->(${this.service_request_key}: ServiceRequest)
      WITH ${this.service_request_key}
      OPTIONAL MATCH (${this.service_request_key})
        <-[:${Relationships.SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP}]
        -(${this.user_key}: User)
      WITH ${this.service_request_key}, ${this.user_key}
      OPTIONAL MATCH (${this.user_key})
        -[${this.relationship}: ${Relationships.SERVICE_REQUEST_CANCEL_REQUESTED_RELATIONSHIP} | ${Relationships.SERVICE_REQUEST_COMPLETION_REQUESTED_RELATIONSHIP}]
        ->(${this.service_request_key})
      RETURN ${this.service_request_key}, ${this.user_key}, ${this.relationship}
      ORDER BY ${this.service_request_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_all_by_user_id,
      {
        user_id
      }
    );
    const service_requests_without_applicants = result.records.map(
      (record): ServiceRequestDTO =>
        ({
          ...record.get(this.service_request_key).properties,
          owner_id: user_id,
          service_provider: record.get(this.user_key) ? record.get(this.user_key).properties.user_id : null,
          applicants: [],
          provider_requested_status_update: !!record.get(this.relationship)
        })
    );
    return await Promise.all(
      service_requests_without_applicants
        .map(
          async (service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> =>
            ({
              ...service_request,
              applicants: (await this.getApplications(service_request.service_request_id))
                .map((applicant) => applicant.applicant_id)
            })
        )
    );
  }

  findAllWithRelation(params: ServiceRequestQueryModel): Promise<any> {
    params;
    return Promise.resolve(undefined);
  }
}
