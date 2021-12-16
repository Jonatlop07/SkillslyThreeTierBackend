import { Interactor } from '@core/common/use-case/interactor';
import ExitChatGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/exit_chat_group_conversation.input_model';
import ExitChatGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/exit_chat_group_conversation.output_model';

export interface ExitChatGroupConversationInteractor
  extends Interactor<ExitChatGroupConversationInputModel, ExitChatGroupConversationOutputModel> {}
