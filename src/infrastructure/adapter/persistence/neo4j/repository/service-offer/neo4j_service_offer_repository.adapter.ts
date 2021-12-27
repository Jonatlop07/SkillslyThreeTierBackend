import ServiceOfferRepository from '@core/domain/service-offer/use-case/repository/service_offer.repository';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver-core';

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

  public async exists(t: ServiceOfferDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public async existsById(id: string): Promise<boolean> {
    const exists_service_offer_query = `
      MATCH (${this.service_offer_key}: ServiceOffer { service_offer_id: $service_offer_id })
      RETURN ${this.service_offer_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_service_offer_query,
      {
        service_offer_id: id
      }
    );
    return result.records.length > 0;
  }

  public async update(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
    const { service_offer_id, title, service_brief, contact_information, category } = service_offer;
    const update_service_offer_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer { service_offer_id: $service_offer_id })
      SET ${this.service_offer_key} += $properties
      RETURN ${this.service_offer_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        update_service_offer_statement,
        {
          service_offer_id,
          properties: {
            title,
            service_brief,
            contact_information,
            category
          }
        }
      ),
      this.service_offer_key
    );
  }
}
