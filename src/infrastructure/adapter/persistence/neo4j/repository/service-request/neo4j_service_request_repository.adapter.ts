import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Injectable, Logger } from '@nestjs/common';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';

@Injectable()
export class ServiceRequestNeo4jRepositoryAdapter implements ServiceRequestRepository {
  private readonly logger: Logger = new Logger(ServiceRequestNeo4jRepositoryAdapter.name);

  private readonly requester_key = 'requester';
  private readonly service_request_key = 'service_request';

  constructor(private readonly neo4j_service: Neo4jService) {}

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
}
