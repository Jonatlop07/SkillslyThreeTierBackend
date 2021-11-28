import { Interactor } from '@core/common/use-case/interactor';
import CreateChatMessageInputModel from '@core/domain/chat/use-case/input-model/create_chat_message.input_model';
import CreateChatMessageOutputModel from '@core/domain/chat/use-case/output-model/create_chat_message.output_model';

export interface CreateChatMessageInteractor extends Interactor<CreateChatMessageInputModel, CreateChatMessageOutputModel> {}
