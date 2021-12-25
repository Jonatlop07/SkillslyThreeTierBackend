import ServiceOfferRepository from '@core/domain/service-offer/use-case/repository/service_offer.repository';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ServiceOfferNeo4jRepositoryAdapter implements ServiceOfferRepository {
  private readonly logger: Logger = new Logger(ServiceOfferNeo4jRepositoryAdapter.name);

  private readonly user_key = 'user';
  private readonly service_offer_key = 'service_offer';

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
    const { owner_id, title, service_brief, contact_information, category } = service_offer;
    const create_service_offer_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      CREATE (${this.service_offer_key}: ServiceOffer)
      SET ${this.service_offer_key} += $properties, ${this.service_offer_key}.service_offer_id = randomUUID()
      CREATE (${this.user_key})-[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]->(${this.service_offer_key})
      RETURN ${this.service_offer_key}
    `;
    const created_service_offer: ServiceOfferDTO = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        create_service_offer_statement,
        {
          user_id: owner_id,
          properties: {
            title,
            service_brief,
            contact_information,
            category,
            created_at: getCurrentDate()
          }
        }
      ),
      this.service_offer_key
    );
    return {
      ...created_service_offer,
      owner_id
    };
  }
}
