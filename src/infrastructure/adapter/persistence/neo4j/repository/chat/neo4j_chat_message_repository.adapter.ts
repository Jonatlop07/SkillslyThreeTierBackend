import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';
import ChatMessageRepository from '@core/domain/chat/use-case/repository/chat_message.repository';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import { Optional } from '@core/common/type/common_types';

@Injectable()
export class ChatMessageNeo4jRepositoryAdapter implements ChatMessageRepository {
  private readonly message_key = 'message';
  private readonly user_key = 'user';
  private readonly conversation_key = 'conversation';

  private readonly logger: Logger = new Logger(ChatMessageNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(message: MessageDTO): Promise<MessageDTO> {
    const create_message_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.conversation_key}: Conversation { conversation_id: $conversation_id })
      CREATE (${this.message_key}: Message),
      (${this.user_key})-[:${Relationships.USER_MESSAGE_RELATIONSHIP}]->(${this.message_key}),
      (${this.message_key})-[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}]->(${this.conversation_key})
      SET ${this.message_key} += $properties, ${this.message_key}.message_id = randomUUID()
      return ${this.message_key}
    `;
    const { message_id, content, created_at } = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        create_message_statement,
        {
          user_id: message.user_id,
          conversation_id: message.conversation_id,
          properties: {
            content: message.content,
            created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
          }
        }
      ),
      this.message_key
    );
    return {
      message_id,
      content,
      created_at,
      conversation_id: message.conversation_id,
      user_id: message.user_id
    };
  }

  public async findAll(params: MessageQueryModel): Promise<MessageDTO[]> {
    const result_key = 'result';
    const find_last_20_messages = `
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_MESSAGE_RELATIONSHIP}]
        ->(${this.message_key}: Message)
        -[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: Conversation { conversation_id: $conversation_id })
      WITH ${this.user_key}, ${this.message_key} ORDER BY ${this.message_key}.created_at LIMIT 20
      WITH {
        message_id: ${this.message_key}.message_id,
        content: ${this.message_key}.content,
        created_at: ${this.message_key}.created_at,
        user_id: ${this.user_key}.user_id
      } AS ${result_key}
      RETURN ${result_key}
    `;
    return await this.neo4j_service.read(
      find_last_20_messages,
      {
        conversation_id: params.conversation_id
      }
    ).then(
      (result: QueryResult) =>
        result.records.map((record:any): MessageDTO => {
          const { content, message_id, created_at, user_id } = record._fields[0];
          return {
            message_id,
            content,
            created_at,
            user_id,
            conversation_id: params.conversation_id
          };
        })
    );
  }

  public async findOne(params: MessageQueryModel): Promise<Optional<MessageDTO>> {
    params;
    return Promise.resolve(undefined);
  }
}
