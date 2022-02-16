import { Inject, Logger } from '@nestjs/common';
import { CreatePrivateChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_private_chat_conversation.interactor';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import CreatePrivateChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_private_chat_conversation.input_model';
import CreatePrivateChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_private_chat_conversation.output_model';
import CreatePrivateChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_private_chat_conversation.gateway';
import { PrivateConversationAlreadyExistsChatException } from '@core/domain/chat/use-case/exception/chat.exception';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export class CreatePrivateChatConversationService implements CreatePrivateChatConversationInteractor {
  private readonly logger: Logger = new Logger(CreatePrivateChatConversationService.name);

  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: CreatePrivateChatConversationGateway
  ) {
  }

  public async execute(input: CreatePrivateChatConversationInputModel): Promise<CreatePrivateChatConversationOutputModel> {
    const { user_id, partner_id } = input;
    if (await this.gateway.existsPrivateConversationWithUser(user_id, partner_id))
      throw new PrivateConversationAlreadyExistsChatException();
    const created_private_chat_conversation: ConversationDTO = await this.gateway.create({
      members: [user_id, partner_id],
      creator_id: user_id,
      name: undefined,
      is_private: true
    });
    return {
      created_private_chat_conversation: {
        ...created_private_chat_conversation,
        members: [user_id, partner_id]
      }
    };
  }
}
