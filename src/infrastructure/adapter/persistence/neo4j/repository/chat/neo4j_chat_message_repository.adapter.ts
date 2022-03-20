import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import MessageQueryModel from '@core/domain/chat/use-case/query-model/message.query_model';
import ChatMessageRepository from '@core/domain/chat/use-case/repository/chat_message.repository';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import CreateMessagePersistenceDTO from '@core/domain/chat/use-case/persistence-dto/create_message.persistence_dto';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

@Injectable()
export class ChatMessageNeo4jRepositoryAdapter implements ChatMessageRepository {
  private readonly message_key = 'message';
  private readonly user_key = 'user';
  private readonly conversation_key = 'conversation';

  private readonly logger: Logger = new Logger(ChatMessageNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(create_message_dto: CreateMessagePersistenceDTO): Promise<MessageDTO> {
    const create_message_statement = `
      MATCH (${this.user_key}: User { user_id: $owner_id }),
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
          owner_id: create_message_dto.owner_id,
          conversation_id: create_message_dto.conversation_id,
          properties: {
            content: create_message_dto.content,
            created_at: getCurrentDate(),
          },
        },
      ),
      this.message_key,
    );
    return {
      message_id,
      content,
      created_at,
      conversation_id: create_message_dto.conversation_id,
      owner_id: create_message_dto.owner_id,
    };
  }

  public async findAll(params: MessageQueryModel, pagination: PaginationDTO): Promise<MessageDTO[]> {
    const result_key = 'result';
    const find_messages = `
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_MESSAGE_RELATIONSHIP}]
        ->(${this.message_key}: Message)
        -[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: Conversation { conversation_id: $conversation_id })
      WITH ${this.user_key}, ${this.message_key}
      ORDER BY ${this.message_key}.created_at
      SKIP ${pagination.offset}
      LIMIT ${pagination.limit}
      WITH {
        message_id: ${this.message_key}.message_id,
        content: ${this.message_key}.content,
        created_at: ${this.message_key}.created_at,
        owner_id: ${this.user_key}.user_id
      } AS ${result_key}
      RETURN ${result_key}
    `;
    return await this.neo4j_service.read(
      find_messages,
      {
        conversation_id: params.conversation_id,
      },
    ).then(
      (result: QueryResult) =>
        result.records.map((record: any): MessageDTO => {
          const { content, message_id, created_at, owner_id } = record._fields[0];
          return {
            message_id,
            content,
            created_at,
            owner_id,
            conversation_id: params.conversation_id,
          };
        }),
    );
  }
}
