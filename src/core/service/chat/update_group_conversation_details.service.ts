import { UpdateGroupConversationDetailsInteractor } from '@core/domain/chat/use-case/interactor/update_group_conversation_details.interactor';
import UpdateGroupConversationDetailsInputModel
  from '@core/domain/chat/use-case/input-model/update_group_conversation_details.input_model';

import UpdateGroupConversationDetailsOutputModel
  from '@core/domain/chat/use-case/output-model/update_group_conversation_details.output_model';
import { Inject } from '@nestjs/common';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import UpdateGroupConversationDetailsGateway
  from '@core/domain/chat/use-case/gateway/update_group_conversation_details.gateway';
import {
  InvalidGroupConversationDetailsFormatChatException,
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException, UserDoesNotHavePermissionsInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { isValidGroupConversationName } from '@core/common/util/validators/chat.validators';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
export class UpdateGroupConversationDetailsService implements UpdateGroupConversationDetailsInteractor {
  constructor(
    @Inject(ChatDITokens.ChatConversationRepository)
    private readonly gateway: UpdateGroupConversationDetailsGateway
  ) {}

  public async execute(input: UpdateGroupConversationDetailsInputModel)
    : Promise<UpdateGroupConversationDetailsOutputModel> {
    const { user_id, conversation_id, conversation_name } = input;
    if (!await this.gateway.existsById(conversation_id))
      throw new NonExistentConversationChatException();
    if (!await this.gateway.belongsUserToConversation(user_id, conversation_id))
      throw new UserDoesNotBelongToConversationChatException();
    if (!isValidGroupConversationName(conversation_name))
      throw new InvalidGroupConversationDetailsFormatChatException();
    if (!await this.gateway.isAdministratorOfTheGroupConversation(user_id, conversation_id))
      throw new UserDoesNotHavePermissionsInConversationChatException();
    const updated_group_conversation: ConversationDTO = await this.gateway.update({
      conversation_id,
      name: conversation_name,
      members: [],
      messages: []
    });
    return {
      conversation_name: updated_group_conversation.name
    };
  }
}
