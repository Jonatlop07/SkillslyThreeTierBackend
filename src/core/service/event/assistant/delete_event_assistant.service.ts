import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { EventAssistantNotFoundException, EventNotFoundException } from '@core/domain/event/use-case/exception/event.exception';
import DeleteEventAssistantGateway from '@core/domain/event/use-case/gateway/assistance/delete_event_assistance.gateway';
import DeleteEventAssistantInputModel from '@core/domain/event/use-case/input-model/assistant/delete_event_assistant.input_model';
import { DeleteEventAssistantInteractor } from '@core/domain/event/use-case/interactor/assistant/delete_event_assistant.interactor';
import DeleteEventAssistantOutputModel from '@core/domain/event/use-case/output-model/assistant/delete_event_assistant.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject } from '@nestjs/common';

export class DeleteEventAssistantService implements DeleteEventAssistantInteractor{
  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: DeleteEventAssistantGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway
  ) {}

  public async execute(
    input: DeleteEventAssistantInputModel,
  ): Promise<DeleteEventAssistantOutputModel> {
    const exists_user = this.exists_user_gateway.exists({
      user_id: input.user_id
    });
    if (!exists_user) {
      throw new UserAccountNotFoundException;
    }
    const exists_event = this.gateway.exists({
      event_id: input.event_id
    });
    if (!exists_event) {
      throw new EventNotFoundException();
    }
    const exists_event_assistant = this.gateway.existsEventAssistant(input);
    if (!exists_event_assistant) {
      throw new EventAssistantNotFoundException();
    }
    await this.gateway.deleteEventAssistant(input);
    return {};
  }
}
