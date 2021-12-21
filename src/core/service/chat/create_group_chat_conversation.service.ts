import { Inject } from '@nestjs/common';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import CreateGroupChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_group_chat_conversation.input_model';
import CreateGroupChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_group_chat_conversation.output_model';
import { NoMembersInConversationChatException } from '@core/domain/chat/use-case/exception/chat.exception';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import CreateGroupChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_group_chat_conversation.gateway';

export class CreateGroupChatConversationService implements CreateGroupChatConversationInteractor {
  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: CreateGroupChatConversationGateway
  ) {}

  private readonly throwIfNotEnoughConversationMembers = (conversation_members: Array<string>) => {
    if (conversation_members.length == 0) {
      throw new NoMembersInConversationChatException();
    }
  };

  public async execute(input: CreateGroupChatConversationInputModel): Promise<CreateGroupChatConversationOutputModel> {
    const { creator_id, conversation_name, conversation_members } = input;
    this.throwIfNotEnoughConversationMembers(conversation_members);
    return await this.gateway.create({
      creator_id,
      name: conversation_name,
      members: conversation_members,
      messages: [],
      is_private: false
    });
  }
}
