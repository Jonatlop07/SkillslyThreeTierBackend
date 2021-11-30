import { Interactor } from '@core/common/use-case/interactor';
import CreateSimpleChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_simple_chat_conversation.input_model';
import CreateSimpleChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_simple_chat_conversation.output_model';

export interface CreateSimpleChatConversationInteractor extends Interactor<CreateSimpleChatConversationInputModel, CreateSimpleChatConversationOutputModel> {}
