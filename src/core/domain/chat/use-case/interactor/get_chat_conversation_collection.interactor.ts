import { Interactor } from '@core/common/use-case/interactor';
import GetChatConversationCollectionInputModel
  from '@core/domain/chat/use-case/input-model/get_chat_conversation_collection.input_model';
import GetChatConversationCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_conversation_collection.output_model';

export interface GetChatConversationCollectionInteractor
  extends Interactor<GetChatConversationCollectionInputModel, GetChatConversationCollectionOutputModel> {}
