import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import * as moment from 'moment';
import { QueryResult } from 'neo4j-driver';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import { Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export class ChatConversationNeo4jRepositoryAdapter implements ChatConversationRepository {
  private readonly conversation_key = 'conversation';
  private readonly user_key = 'user';

  private readonly logger: Logger = new Logger(ChatConversationNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(conversation: ConversationDTO): Promise<ConversationDTO> {

    const create_conversation_statement = `
      CREATE (${this.conversation_key}: Conversation)
      SET ${this.conversation_key} += $properties, ${this.conversation_key}.conversation_id = randomUUID()
      WITH ${this.conversation_key}
      UNWIND $member_ids as member_id
      MATCH (${this.user_key}: User { user_id: member_id })
      CREATE (${this.user_key})-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]->(${this.conversation_key})
      RETURN ${this.conversation_key}
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
      this.conversation_key
    );
  }

  public async belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean> {
    const belongs_user_to_conversation_query = `
      MATCH
        (${this.user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: Conversation { conversation_id: $conversation_id })
      RETURN ${this.user_key}
    `;
    const result = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(belongs_user_to_conversation_query, {
        user_id,
        conversation_id
      }),
      this.user_key
    );
    return !!result;
  }

  public async existsSimpleConversationWithUser(user_id: string, other_user_id: string): Promise<boolean> {
    const exists_conversation_with_user_query = `
      MATCH
        (: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: Conversation)
        <-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        -(: User { user_id: $other_user_id })
      WITH ${this.conversation_key}
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key})
      WITH COUNT(${this.user_key}) as user_count, ${this.conversation_key}
      WHERE user_count = 2
      RETURN ${this.conversation_key}
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
    const exists_conversation_by_id_query = `
      MATCH (${this.conversation_key}: Conversation { conversation_id: $conversation_id })
      RETURN ${this.conversation_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_conversation_by_id_query,
      {
        conversation_id: id
      }
    );
    return result.records.length > 0;
  }

  public async findAll(params: ConversationQueryModel): Promise<Array<ConversationDetailsDTO>> {
    const get_all_conversations_by_user_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: Conversation)
      WITH ${this.conversation_key}
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key})
      RETURN ${this.conversation_key}, ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      get_all_conversations_by_user_statement,
      {
        user_id: params.user_id
      }
    );
    const conversation_collection: Array<ConversationDTO> = this.neo4j_service.getMultipleResultByKey(
      result,
      this.conversation_key
    );
    const users_map = new Map<string, UserDTO>();
    this.neo4j_service
      .getMultipleResultByKey(result, this.user_key)
      .forEach((user: UserDTO) => {
        users_map.set(user.user_id, user);
      });
    return conversation_collection.map(
      (conversation: ConversationDTO) => ({
        conversation_id: conversation.conversation_id,
        conversation_name: conversation.name || '',
        conversation_members: conversation.members.map(
          (member_id: string) => ({
            member_id,
            member_name: users_map.get(member_id).name
          })
        )
      })
    );
  }

  public async findOne(params: ConversationQueryModel): Promise<Optional<ConversationDetailsDTO>> {
    params;
    return Promise.resolve(undefined);
  }
}
