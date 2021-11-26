import ChatMessageRepository from '@core/domain/chat/use-case/repository/chat_message.repository';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import * as moment from 'moment';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';
import { Optional } from '@core/common/type/common_types';
import { QueryResult } from 'neo4j-driver';

export class ChatMessageNeo4jRepositoryAdapter implements ChatMessageRepository {
  private readonly logger: Logger = new Logger(ChatMessageNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}

  async create(message: MessageDTO): Promise<MessageDTO> {
    const user_key = 'user';
    const conversation_key = 'conversation';
    const message_key = 'message';
    const create_message_statement = `
      MATCH (${user_key}: User { user_id: $user_id }),
      (${conversation_key}: Conversation { conversation_id: $conversation_id })
      CREATE (${message_key}: Message),
      (${user_key})-[:${Relationships.USER_MESSAGE_RELATIONSHIP}->(${message_key}),
      (${message_key})-[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}]->(${conversation_key})
      SET ${message_key} += $properties, ${message_key}.message_id = randomUUID()
      return ${message_key}
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
      message_key
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
    const conversation_key = 'conversation';
    const message_key = 'message_key';
    const find_last_20_messages = `
      MATCH (${message_key})
        -[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}
        ->(${conversation_key} { conversation_id: $conversation_id })
      WITH ${message_key} ORDER BY ${message_key}.created_at LIMIT 20
      RETURN ${message_key}
    `;
    return await this.neo4j_service.read(
      find_last_20_messages,
      {
        conversation_id: params.conversation_id
      }
    ).then(
      (result: QueryResult) =>
        result.records.map((record:any) => record._fields[0].properties)
    );
  }

  public async findOne(params: MessageQueryModel): Promise<Optional<MessageDTO>> {
    params;
    return Promise.resolve(undefined);
  }
}
