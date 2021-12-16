import { Interactor } from '@core/common/use-case/interactor';
import AddMembersToGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/add_members_to_group_conversation.input_model';
import AddMembersToGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/add_members_to_group_conversation.output_model';

export interface AddMembersToGroupConversationInteractor
  extends Interactor<AddMembersToGroupConversationInputModel, AddMembersToGroupConversationOutputModel> {}
