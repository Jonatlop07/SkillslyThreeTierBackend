import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import * as moment from 'moment';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import { Optional } from '@core/common/type/common_types';
import { AddMembersToGroupConversationDTO } from '@core/domain/chat/use-case/persistence-dto/add_members_to_group_conversation.dto';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export class ChatConversationInMemoryRepository implements ChatConversationRepository {
  private currently_available_conversation_id: string;

  constructor(private readonly conversations: Map<string, ConversationDTO>) {
    this.currently_available_conversation_id = '1';
  }

  public create(conversation: ConversationDTO): Promise<ConversationDTO> {
    const new_conversation: ConversationDTO = {
      conversation_id: this.currently_available_conversation_id,
      name: conversation.name,
      members: conversation.members,
      messages: conversation.messages,
      created_at: moment().local().format('YYYY/MM/DD HH:mm:ss'),
    };
    this.conversations.set(this.currently_available_conversation_id, new_conversation);
    this.currently_available_conversation_id = `${Number(this.currently_available_conversation_id) + 1}`;
    return Promise.resolve(new_conversation);
  }

  public belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean> {
    return Promise.resolve(
      !!this.conversations
        .get(conversation_id)
        .members
        .find((member) => member === user_id),
    );
  }

  public existsPrivateConversationWithUser(user_id: string, other_user_id: string): Promise<boolean> {
    for (const conversation of this.conversations.values()) {
      if (user_id in conversation.members && other_user_id in conversation.members)
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public exists(conversation: ConversationDTO): Promise<boolean> {
    return this.existsById(conversation.conversation_id);
  }

  public existsById(id: string): Promise<boolean> {
    for (const _conversation of this.conversations.values())
      if (_conversation.conversation_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public async findAll(params: ConversationQueryModel): Promise<Array<ConversationDetailsDTO>> {
    const user_conversations: Array<ConversationDetailsDTO> = [];
    for (const conversation of this.conversations.values()) {
      if (params.conversation_id === conversation.conversation_id) {
        user_conversations.push({
          conversation_id: conversation.conversation_id,
          conversation_name: conversation.name,
          conversation_members: conversation.members.map((member_id: string) => ({
            member_id,
            member_name: '',
          })),
          is_private: false,
        });
      }
    }
    return Promise.resolve(user_conversations);
  }

  public async findOne(params: ConversationQueryModel): Promise<Optional<ConversationDetailsDTO>> {
    params;
    return Promise.resolve(undefined);
  }

  public findAllWithRelation() {
    return null;
  }

  public async addMembersToGroupConversation(dto: AddMembersToGroupConversationDTO): Promise<Array<UserDTO>> {
    const conversation: ConversationDTO = this.conversations.get(dto.conversation_id);
    const members_to_add: Array<string> = dto.members_to_add.filter(member => !conversation.members.includes(member));
    conversation.members = conversation.members.concat(members_to_add);
    this.conversations.set(conversation.conversation_id, conversation);
    return Promise.resolve(members_to_add.map((member) => ({
      user_id: member,
      email: '',
      password: '',
      name: '',
      date_of_birth: '',
    })));
  }

  public async update(conversation: ConversationDTO): Promise<ConversationDTO> {
    const conversation_to_update = this.conversations.get(conversation.conversation_id);
    conversation_to_update.name = conversation.name;
    this.conversations.set(conversation_to_update.conversation_id, conversation_to_update);
    return Promise.resolve(conversation_to_update);
  }

  public async delete(params: ConversationQueryModel): Promise<ConversationDTO> {
    params;
    return Promise.resolve(undefined);
  }

  public async deleteById(id: string): Promise<ConversationDTO> {
    this.conversations.delete(id);
    return Promise.resolve(null);
  }

  public async exit(user_id: string, conversation_id: string): Promise<void> {
    const conversation = this.conversations.get(conversation_id);
    conversation.members = conversation.members.filter((member) => member !== user_id);
    this.conversations.set(conversation_id, conversation);
    return Promise.resolve();
  }
}
