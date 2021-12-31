import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';
import EventRepository from '@core/domain/event/use-case/repository/event.repository';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '../../constants/relationships';
import { Neo4jService } from '../../service/neo4j.service';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { AssistanceDTO } from '@core/domain/event/use-case/persistence-dto/assistance.dto';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import eventQuery_model from '@core/domain/event/use-case/query-model/event.query_model';

@Injectable()
export class EventNeo4jRepositoryAdapter implements EventRepository {

  private readonly event_key = 'event';

  private readonly logger: Logger = new Logger(EventNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(event: EventDTO): Promise<EventDTO> {
    const user_key = 'user';
    const create_event_query = `
      MATCH 
        (${user_key}: User { user_id: $user_id })
      CREATE (${this.event_key}: Event), 
      (${user_key})-[:${Relationships.USER_EVENT_RELATIONSHIP}]->(${this.event_key})
      SET ${this.event_key} += $properties, ${this.event_key}.event_id = randomUUID()
      RETURN ${this.event_key}
    `;
    const created_event = await this.neo4j_service.write(create_event_query, {
      properties: {
        name: event.name,
        description: event.description,
        lat: event.lat,
        long: event.long,
        date: moment(event.date).local().format('YYYY/MM/DD HH:mm:ss'),
        created_at: getCurrentDate()
      },
      user_id: event.user_id
    });

    return this.neo4j_service.getSingleResultProperties(created_event, this.event_key) as EventDTO;
  }

  public async createEventAssistant(params: AssistanceDTO): Promise<void> {
    const user_key = 'user';
    const create_event_assistant_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${this.event_key}: Event { event_id: $event_id })
      CREATE (${user_key})-[:${Relationships.EVENT_ASSISTANT_RELATIONSHIP}]->(${this.event_key})
      RETURN ${this.event_key}
    `;
    await this.neo4j_service.write(
      create_event_assistant_query,
      {
        user_id: params.user_id,
        event_id: params.event_id
      }
    );
  }

  public exists(t: EventDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public async existsEventAssistant(params: AssistanceDTO): Promise<boolean> {
    const user_key = 'user';
    const exists_event_assistant_query = `
      MMATCH (${user_key}: User { user_id: $user_id }) , 
      (${this.event_key}: Event { event_id: $event_id }), 
      (${user_key})-[r:${Relationships.EVENT_ASSISTANT_RELATIONSHIP}]->(${this.event_key})
      RETURN r
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_event_assistant_query,
      {
        user_id: params.user_id,
        event_id: params.event_id
      }
    );
    return result.records.length > 0;
  }

  public async existsById(id: string): Promise<boolean> {
    const exists_event_query = `MATCH (${this.event_key}: Event { event_id: $id }) RETURN ${this.event_key}`;
    const result: QueryResult = await this.neo4j_service.read(
      exists_event_query,
      { id }
    );
    return result.records.length > 0;
  }

  public async getEventsOfFriends(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    const limit = pagination.limit || 25;
    const offset = pagination.offset || 0;
    const result_key = 'result';
    const friend_key = 'friend';
    const user_key = 'user';
    const get_friends_collection_query = `
      MATCH (${user_key}: User { user_id: $id })
      -[:${Relationships.USER_FOLLOW_RELATIONSHIP}]
      ->(${friend_key}: User)
      RETURN ${friend_key}
    `;
    const friends_ids = await this.neo4j_service
      .read(get_friends_collection_query, { id })
      .then((result: QueryResult) => result.records.map((record: any) => record._fields[0].properties.user_id));
    const get_posts_of_friends_collection_query = `
      UNWIND $friends_ids as friend_id
      MATCH (${friend_key}: User {user_id: friend_id})
        -[:${Relationships.USER_EVENT_RELATIONSHIP}]
        ->(${this.event_key}: Event)
      WITH {
        lat: ${this.event_key}.lat,
        long: ${this.event_key}.long,
        created_at: ${this.event_key}.created_at,
        date: ${this.event_key}.date,
        event_id: ${this.event_key}.event_id,
        description: ${this.event_key}.description,
        name: ${this.event_key}.name,
        user_id: ${friend_key}.user_id
      } AS ${result_key}
      RETURN DISTINCT ${result_key}
      ORDER BY ${result_key}.date 
      SKIP ${offset}
      LIMIT ${limit}
    `;
    return await this.neo4j_service
      .read(get_posts_of_friends_collection_query, { friends_ids })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          const { event_id, name, description, date, lat, long, created_at, user_id } = record._fields[0];
          return {
            event_id,
            name,
            description,
            date,
            lat,
            long,
            created_at,
            user_id
          };
        })
      );
  }

  public async getMyEvents(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    const limit = pagination.limit || 25;
    const offset = pagination.offset || 0;
    const result_key = 'result';
    const user_key = 'user';
    const get_posts_of_friends_collection_query = `
      MATCH (${user_key}: User {user_id: $user_id})
        -[:${Relationships.USER_EVENT_RELATIONSHIP}]
        ->(${this.event_key}: Event)
      WITH {
        lat: ${this.event_key}.lat,
        long: ${this.event_key}.long,
        created_at: ${this.event_key}.created_at,
        date: ${this.event_key}.date,
        event_id: ${this.event_key}.event_id,
        description: ${this.event_key}.description,
        name: ${this.event_key}.name,
        user_id: $user_id
      } AS ${result_key}
      RETURN DISTINCT ${result_key}
      ORDER BY ${result_key}.date 
      SKIP ${offset}
      LIMIT ${limit}
    `;
    return await this.neo4j_service
      .read(get_posts_of_friends_collection_query, { user_id: id })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          const { event_id, name, description, date, lat, long, created_at, user_id } = record._fields[0];
          return {
            event_id,
            name,
            description,
            date,
            lat,
            long,
            created_at,
            user_id
          };
        })
      );
  }

  public async getEventAssistantCollection(id: string): Promise<SearchedUserDTO[]> {
    const map_nodes_properties = (result: QueryResult) =>
      result.records.map(
        (record: any) => record._fields[0].properties
      );
    const map_user_data = (result: any) => ({
      email: result.email,
      user_id: result.user_id,
      date_of_birth: result.date_of_birth,
      name: result.name
    });
    const other_user_key = 'other_user';
    const get_event_assistant_collection_query = `
      MATCH (${this.event_key}: Event { event_id: $event_id }),
      (${other_user_key})-[:${Relationships.EVENT_ASSISTANT_RELATIONSHIP}]->(${this.event_key})
      RETURN ${other_user_key}
    `;
    const result_request = await this.neo4j_service.read(
      get_event_assistant_collection_query,
      {
        event_id: id
      }
    ).then(map_nodes_properties);
    const mapped_result_request = result_request.map(map_user_data);
    return mapped_result_request;
  }

  public async getMyEventAssistantCollection(id: string): Promise<EventDTO[]> {
    const map_nodes_properties = (result: QueryResult) =>
      result.records.map(
        (record: any) => record._fields[0].properties
      );
    const map_event_data = (result: any) => ({
      name: result.name,
      event_id: result.event_id,
      description: result.description,
      lat: result.lat,
      long: result.long,
      date: result.date
    });
    const user_key = 'user';
    const get_my_event_assistant_collection_query = `
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})-[:${Relationships.EVENT_ASSISTANT_RELATIONSHIP}]->(${this.event_key})
      RETURN ${this.event_key}
    `;
    const result_request = await this.neo4j_service.read(
      get_my_event_assistant_collection_query,
      {
        user_id: id
      }
    ).then(map_nodes_properties);
    const mapped_result_request = result_request.map(map_event_data);
    return mapped_result_request;
  }

  public findAll(params: eventQuery_model): Promise<EventDTO[]> {
    params;
    return Promise.resolve([]);
  }

  public findAllWithRelation(params: eventQuery_model): Promise<any> {
    params;
    return Promise.resolve();
  }

  public async findOne(params: eventQuery_model): Promise<EventDTO> {
    const { event_id, user_id } = params;
    const user_key = 'user';
    const user_id_key = 'user_id';
    const find_event_query = `
      MATCH (${user_key}: User {user_id: $user_id})
        -[:${Relationships.USER_EVENT_RELATIONSHIP}]
        ->(${this.event_key}: Event { event_id: $event_id })
      RETURN ${this.event_key}, ${user_key}.user_id AS ${user_id_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_event_query,
      {
        event_id,
        user_id
      }
    );
    const found_event = this.neo4j_service.getSingleResultProperties(result, this.event_key);
    return {
      event_id: found_event.post_id,
      name: found_event.name,
      description: found_event.description,
      lat: found_event.lat,
      long: found_event.long,
      date: found_event.date,
      user_id: this.neo4j_service.getSingleResultProperty(result, user_id_key)
    };
  }

  public async update(event: EventDTO): Promise<EventDTO> {
    const update_event_query = `
    MATCH (${this.event_key}: Event { event_id: $event_id })
    SET ${this.event_key} += $properties
    RETURN ${this.event_key}
    `;
    const result = await this.neo4j_service.write(update_event_query, {
      event_id: event.id,
      properties: {
        name: event.name,
        description: event.description,
        lat: event.lat,
        long: event.long,
        date: event.date,
        updated_at: moment().local().format('YYYY-MM-DD HH:mm:ss')
      }
    });
    const updated_event = this.neo4j_service.getSingleResultProperties(
      result,
      'event'
    );
    return {
      event_id: updated_event.post_id,
      name: updated_event.name,
      description: updated_event.description,
      lat: updated_event.lat,
      long: updated_event.long,
      date: updated_event.date,
      created_at: updated_event.created_at,
      updated_at: updated_event.updated_at,
      user_id: event.user_id
    };
  }

  public async deleteEventAssistant(params: AssistanceDTO): Promise<void> {
    const user_key = 'user';
    const delete_event_assistant_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${this.event_key}: Event { event_id: $event_id }),
      (${user_key})-[r:${Relationships.EVENT_ASSISTANT_RELATIONSHIP}]->(${this.event_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      delete_event_assistant_query,
      {
        user_id: params.user_id,
        event_id: params.event_id
      }
    );
  }

  public async delete(params: EventDTO): Promise<EventDTO> {
    params;
    return Promise.resolve(undefined);
  }

  public async deleteById(id: string): Promise<EventDTO> {
    const user_key = 'user';
    const delete_permanent_post_statement = `
      MATCH (${this.event_key}: Event { event_id: $id })
        <-[:${Relationships.USER_EVENT_RELATIONSHIP}]
        -(${user_key}: User)
      DETACH DELETE ${this.event_key}
    `;
    await this.neo4j_service.write(delete_permanent_post_statement, { id });
    return {};
  }

}
