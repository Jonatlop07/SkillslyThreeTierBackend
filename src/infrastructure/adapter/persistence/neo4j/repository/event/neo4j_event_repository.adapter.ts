import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';
import EventRepository from '@core/domain/event/use-case/repository/event.repository';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '../../constants/relationships';
import { Neo4jService } from '../../service/neo4j.service';
import { getCurrentDate } from '@core/common/util/date/moment_utils';

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

}
