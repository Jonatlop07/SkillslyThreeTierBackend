import { Interactor } from '@core/common/use-case/interactor';
import UpdateGroupConversationDetailsInputModel
  from '@core/domain/chat/use-case/input-model/update_group_conversation_details.input_model';
import UpdateGroupConversationDetailsOutputModel
  from '@core/domain/chat/use-case/output-model/update_group_conversation_details.output_model';

export interface UpdateGroupConversationDetailsInteractor
  extends Interactor<UpdateGroupConversationDetailsInputModel, UpdateGroupConversationDetailsOutputModel> {}
