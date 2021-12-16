import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import { Optional } from '@core/common/type/common_types';
import { AddMembersToGroupConversationDTO } from '@core/domain/chat/use-case/persistence-dto/add_members_to_group_conversation.dto';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import * as moment from 'moment';

@Injectable()
export class ChatConversationNeo4jRepositoryAdapter implements ChatConversationRepository {
  private readonly conversation_key = 'conversation';
  private readonly user_key = 'user';
  private readonly message_key = 'message';

  private readonly logger: Logger = new Logger(ChatConversationNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(conversation: ConversationDTO): Promise<ConversationDTO> {
    const create_conversation_statement = `
      CREATE (${this.conversation_key}: Conversation : ${conversation.is_private ? 'PrivateConversation' : 'GroupConversation'})
      SET ${this.conversation_key} += $properties, ${this.conversation_key}.conversation_id = randomUUID()
      WITH ${this.conversation_key}
      UNWIND $member_ids as member_id
      MATCH (${this.user_key}: User { user_id: member_id })
      CREATE (${this.user_key})-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]->(${this.conversation_key})
      RETURN ${this.conversation_key}
    `;
    return {
      ...this.neo4j_service.getSingleResultProperties(
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
      ),
      members: conversation.members
    };
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

  public async existsPrivateConversationWithUser(user_id: string, other_user_id: string): Promise<boolean> {
    const exists_conversation_with_user_query = `
      MATCH
        (: User { user_id: $user_id })
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key}: PrivateConversation)
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
    type ConversationType = 'PrivateConversation' | 'GroupConversation';
    const getConversationCollection = async (type: ConversationType) => {
      const get_all_conversations_by_user_query = `
        MATCH (${this.user_key}: User { user_id: $user_id })
          -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
          ->(${this.conversation_key}: ${type})
        RETURN ${this.conversation_key}
      `;
      const get_conversation_members_query = `
        MATCH (${this.user_key}: User)
          -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
          ->(${this.conversation_key}: ${type} { conversation_id: $id })
        RETURN ${this.user_key}
      `;
      const conversation_collection: Array<ConversationDTO> = this.neo4j_service.getMultipleResultByKey(
        await this.neo4j_service.read(
          get_all_conversations_by_user_query,
          {
            user_id: params.user_id
          }
        ),
        this.conversation_key
      );
      const result: Array<ConversationDetailsDTO> = [];
      for (const conversation of conversation_collection) {
        const conversation_members = this.neo4j_service
          .getMultipleResultByKey(
            await this.neo4j_service.read(
              get_conversation_members_query,
              { id: conversation.conversation_id }
            ),
            this.user_key
          ).map((user) => ({
            member_id: user.user_id,
            member_name: user.name
          }));
        result.push(
          {
            conversation_id: conversation.conversation_id,
            conversation_name: conversation.name,
            conversation_members,
            is_private: type === 'PrivateConversation'
          }
        );
      }
      return result;
    };
    return [
      ...await getConversationCollection('PrivateConversation'),
      ...await getConversationCollection('GroupConversation')
    ];
  }

  public async findOne(params: ConversationQueryModel): Promise<Optional<ConversationDetailsDTO>> {
    const get_conversation_by_id_with_members = `
      MATCH (${this.conversation_key}: Conversation { conversation_id: $conversation_id }),
        (${this.user_key}: User)
        -[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key})
      RETURN ${this.conversation_key}, ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      get_conversation_by_id_with_members,
      {
        conversation_id: params.conversation_id
      }
    );
    const conversation: ConversationDTO = this.neo4j_service.getSingleResultProperties(
      result,
      this.conversation_key
    );
    return {
      conversation_id: conversation.conversation_id,
      conversation_name: conversation.name,
      conversation_members: this.neo4j_service.getMultipleResultByKey(result, this.user_key),
      is_private: params.is_private
    };
  }

  public findAllWithRelation() {
    return null;
  }


  public async addMembersToGroupConversation(dto: AddMembersToGroupConversationDTO): Promise<Array<UserDTO>> {
    const add_members_to_group_conversation_statement = `
      MATCH (${this.conversation_key}: GroupConversation { conversation_id: $conversation_id })
      WITH ${this.conversation_key}
      UNWIND $new_member_ids as new_member_id
      MATCH (${this.user_key}: User { user_id: new_member_id })
      CREATE (${this.user_key})-[:${Relationships.USER_CONVERSATION_RELATIONSHIP}]->(${this.conversation_key})
      RETURN ${this.user_key}
    `;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.write(
        add_members_to_group_conversation_statement,
        {
          conversation_id: dto.conversation_id,
          new_member_ids: dto.members_to_add
        }),
      this.user_key
    );
  }

  public async update(conversation: ConversationDTO): Promise<ConversationDTO> {
    const update_group_conversation_details_statement = `
      MATCH (${this.conversation_key}: GroupConversation { conversation_id: $conversation_id })
      SET ${this.conversation_key} += $properties
      RETURN ${this.conversation_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.write(
        update_group_conversation_details_statement,
        {
          conversation_id: conversation.conversation_id,
          properties: {
            name: conversation.name
          }
        }
      ),
      this.conversation_key
    );
  }

  public async delete(params: ConversationQueryModel): Promise<ConversationDTO> {
    params;
    return Promise.resolve(undefined);
  }

  public async deleteById(conversation_id: string): Promise<ConversationDTO> {
    const delete_group_conversation_statement = `
      MATCH (${this.conversation_key}: GroupConversation { conversation_id: $conversation_id })
      WITH ${this.conversation_key}
      OPTIONAL MATCH
        (${this.message_key}: Message)
        -[:${Relationships.MESSAGE_CONVERSATION_RELATIONSHIP}]
        ->(${this.conversation_key})
      DETACH DELETE ${this.message_key}
      DETACH DELETE ${this.conversation_key}
    `;
    await this.neo4j_service.write(delete_group_conversation_statement, { conversation_id });
    return null;
  }

  public async exit(user_id: string, conversation_id: string): Promise<void> {
    const user_conversation_relationship_key = 'r';
    const exit_group_conversation_statement = `
      MATCH
        (${this.conversation_key}: GroupConversation { conversation_id: $conversation_id })
        <-[${user_conversation_relationship_key}: ${Relationships.USER_CONVERSATION_RELATIONSHIP}]
        -(${this.user_key}: User { user_id: $user_id })
      DELETE ${user_conversation_relationship_key}
    `;
    await this.neo4j_service.write(exit_group_conversation_statement, { user_id, conversation_id });
  }
}
