import { Interactor } from '@core/common/use-case/interactor';
import CreateGroupChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_group_chat_conversation.input_model';
import CreateGroupChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_group_chat_conversation.output_model';

export interface CreateGroupChatConversationInteractor extends Interactor<CreateGroupChatConversationInputModel, CreateGroupChatConversationOutputModel> {}
