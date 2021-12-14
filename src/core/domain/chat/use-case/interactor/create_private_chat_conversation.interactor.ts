import { Interactor } from '@core/common/use-case/interactor';
import CreatePrivateChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_private_chat_conversation.input_model';
import CreatePrivateChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_private_chat_conversation.output_model';

export interface CreatePrivateChatConversationInteractor extends Interactor<CreatePrivateChatConversationInputModel, CreatePrivateChatConversationOutputModel> {}
