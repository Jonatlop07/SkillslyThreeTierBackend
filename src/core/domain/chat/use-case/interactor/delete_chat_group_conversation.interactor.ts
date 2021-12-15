import { Interactor } from '@core/common/use-case/interactor';
import DeleteChatGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/delete_chat_group_conversation.input_model';
import DeleteChatGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/delete_chat_group_conversation.output_model';

export interface DeleteChatGroupConversationInteractor
  extends Interactor<DeleteChatGroupConversationInputModel, DeleteChatGroupConversationOutputModel> {}
