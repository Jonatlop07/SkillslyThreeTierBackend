import { Interactor } from '@core/common/use-case/interactor';
import GetChatMessageCollectionInputModel
  from '@core/domain/chat/use-case/input-model/get_chat_message_collection.input_model';
import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';

export interface GetChatMessageCollectionInteractor
  extends Interactor<GetChatMessageCollectionInputModel, GetChatMessageCollectionOutputModel> {}
