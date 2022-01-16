import ServiceOfferRepository from '@core/domain/service-offer/use-case/repository/service_offer.repository';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver-core';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import { Optional } from '@core/common/type/common_types';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

@Injectable()
export class ServiceOfferNeo4jRepositoryAdapter implements ServiceOfferRepository {
  private readonly logger: Logger = new Logger(ServiceOfferNeo4jRepositoryAdapter.name);

  private readonly user_key = 'user';
  private readonly service_offer_key = 'service_offer';

  constructor(private readonly neo4j_service: Neo4jService) {
  }

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
            category,
            updated_at: getCurrentDate()
          }
        }
      ),
      this.service_offer_key
    );
  }

  public async delete(params: ServiceOfferQueryModel): Promise<void> {
    const { service_offer_id, owner_id } = params;
    const delete_service_offer_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer { service_offer_id: $service_offer_id })
        <-[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]
        -(${this.user_key}: User { user_id: $owner_id })
      DETACH DELETE ${this.service_offer_key}
    `;
    await this.neo4j_service.write(
      delete_service_offer_statement,
      {
        service_offer_id,
        owner_id
      }
    );
  }

  public async deleteById(id: string): Promise<void> {
    const delete_service_offer_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer { service_offer_id: $service_offer_id })
      DETACH DELETE ${this.service_offer_key}
    `;
    await this.neo4j_service.write(
      delete_service_offer_statement,
      {
        service_offer_id: id
      }
    );
  }

  public async findAll(params: ServiceOfferQueryModel, pagination: PaginationDTO): Promise<Array<ServiceOfferDTO>> {
    const { limit, offset } = pagination;
    const find_all_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer)
        <-[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]
        -(${this.user_key}: User)
      RETURN ${this.service_offer_key}, ${this.user_key}
      ORDER BY ${this.service_offer_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_all_statement,
      {}
    );
    return result.records.map(
      (record) =>
        ({
          ...record.get(this.service_offer_key).properties,
          owner_id: record.get(this.user_key).properties.user_id
        })
    );
  }

  public async findAllByUserAndCategories(params: ServiceOfferQueryModel, pagination: PaginationDTO) {
    const { owner_id, categories } = params;
    const { limit, offset } = pagination;
    const find_all_by_categories_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer)
        <-[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]
        -(${this.user_key}: User { user_id: $user_id })
      WHERE ${this.service_offer_key}.categories IN $categories
      RETURN DISTINCT ${this.service_offer_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.read(
        find_all_by_categories_statement,
        {
          user_id: owner_id,
          categories
        }
      ),
      this.service_offer_key
    ).map(
      (service_offer: ServiceOfferDTO) =>
        ({
          ...service_offer,
          owner_id
        })
    );
  }

  public async findAllByCategories(categories: Array<string>, pagination: PaginationDTO)
    : Promise<Array<ServiceOfferDTO>> {
    const { limit, offset } = pagination;
    const find_all_by_categories_statement = `
      MATCH (${this.service_offer_key}: ServiceOffer)
      WHERE ${this.service_offer_key}.category IN $categories
      RETURN DISTINCT ${this.service_offer_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.read(
        find_all_by_categories_statement,
        {
          categories
        }
      ),
      this.service_offer_key
    );
  }

  public async findAllByUser(user_id: string, pagination: PaginationDTO)
    : Promise<Array<ServiceOfferDTO>> {
    const { limit, offset } = pagination;
    const find_all_by_user_id = `
      MATCH (${this.service_offer_key}: ServiceOffer)
        <-[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]
        -(${this.user_key}: User { user_id: $user_id })
      RETURN DISTINCT ${this.service_offer_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.read(
        find_all_by_user_id,
        {
          user_id
        }
      ),
      this.service_offer_key
    ).map(
      (service_offer: ServiceOfferDTO) =>
        ({
          ...service_offer,
          owner_id: user_id
        })
    );
  }

  public async belongsServiceOfferToUser(service_offer_id: string, user_id: string): Promise<boolean> {
    const belongs_service_offer_to_user_query = `
      MATCH (${this.user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_SERVICE_OFFER_RELATIONSHIP}]
        ->(${this.service_offer_key}: ServiceOffer { service_offer_id: $service_offer_id })
      RETURN ${this.service_offer_key}
    `;
    const result = await this.neo4j_service.read(
      belongs_service_offer_to_user_query,
      {
        user_id,
        service_offer_id
      }
    );
    return result.records.length > 0;
  }

  findAllWithRelation(params: ServiceOfferQueryModel): Promise<any> {
    params;
    return Promise.resolve(undefined);
  }

  findOne(params: ServiceOfferQueryModel): Promise<Optional<ServiceOfferDTO>> {
    params;
    return Promise.resolve(undefined);
  }
}
