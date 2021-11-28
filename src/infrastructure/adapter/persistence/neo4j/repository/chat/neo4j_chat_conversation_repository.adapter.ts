import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import * as moment from 'moment';
import { QueryResult } from 'neo4j-driver';

export class ChatConversationNeo4jRepositoryAdapter implements ChatConversationRepository {
  private readonly logger: Logger = new Logger(ChatConversationNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}

  async create(conversation: ConversationDTO): Promise<ConversationDTO> {
    const conversation_key = 'conversation';
    const user_key = 'user';
    const create_conversation_statement = `
      CREATE (${conversation_key}: Conversation)
      SET ${conversation_key} += $properties, ${conversation_key}.conversation_id = randomUUID()
      WITH ${conversation_key}
      UNWIND $member_ids as member_id
      MATCH (${user_key}: User { user_id: member_id })
      CREATE (${user_key})-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]->(${conversation_key})
      RETURN ${conversation_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        create_conversation_statement,
        {
          member_ids: conversation.members,
          properties: {
            name: conversation.name,
            created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
          }
        }
      ),
      conversation_key
    );
  }

  public async belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean> {
    const user_key = 'user';
    const conversation_key = 'conversation';
    const belongs_user_to_conversation_query = `
      MATCH
        (${user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${conversation_key}: Conversation { conversation_id: $conversation_id })
      RETURN ${user_key}
    `;
    const result = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(belongs_user_to_conversation_query, {
        user_id,
        conversation_id
      }),
      user_key
    );
    return !!result;
  }

  async existsSimpleConversationWithUser(user_id: string, other_user_id: string): Promise<boolean> {
    const user_key = 'user';
    const conversation_key = 'conversation';
    const exists_conversation_with_user_query = `
      MATCH
        (: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${conversation_key}: Conversation)
        <-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        -(: User { user_id: $other_user_id })
      WITH ${conversation_key}
      MATCH (${user_key}: User)
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${conversation_key})
      WITH COUNT(${user_key}) as user_count, ${conversation_key}
      WHERE user_count = 2
      RETURN ${conversation_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_conversation_with_user_query,
      {
        user_id,
        other_user_id
      }
    );
    return result.records.length > 0;
  }

  public async exists(conversation: ConversationDTO): Promise<boolean> {
    return await this.existsById(conversation.conversation_id);
  }

  public async existsById(id: string): Promise<boolean> {
    const conversation_key = 'conversation';
    const exists_conversation_by_id_query = `
      MATCH (${conversation_key}: Conversation { conversation_id: $conversation_id })
      RETURN ${conversation_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_conversation_by_id_query,
      {
        conversation_id: id
      }
    );
    return result.records.length > 0;
  }
}
