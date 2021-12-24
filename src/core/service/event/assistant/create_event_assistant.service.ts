import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { EventNotFoundException } from '@core/domain/event/use-case/exception/event.exception';
import CreateEventAssistantGateway from '@core/domain/event/use-case/gateway/assistance/create_event_assistance.gateway';
import ExistsEventGateway from '@core/domain/event/use-case/gateway/exists_event_gateway.gateway';
import CreateEventAssistantInputModel from '@core/domain/event/use-case/input-model/assistant/create_event_assistant.input_model';
import { CreateEventAssistantInteractor } from '@core/domain/event/use-case/interactor/assistant/create_event_assistant.interactor';
import CreateEventAssistantOutputModel from '@core/domain/event/use-case/output-model/assistant/create_event_assistant.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject } from '@nestjs/common';

export class CreateEventAssistantService implements CreateEventAssistantInteractor{
  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: CreateEventAssistantGateway,
    @Inject(EventDITokens.EventRepository)
    private readonly exists_event_gateway: ExistsEventGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway
  ){}

  public async execute(
    input: CreateEventAssistantInputModel,
  ): Promise<CreateEventAssistantOutputModel> {
    const exists_user = this.exists_user_gateway.existsById(input.user_id);
    if (!exists_user) {
      throw new UserAccountNotFoundException;
    }
    const exists_event = this.exists_event_gateway.existsById(input.event_id);
    if (!exists_event) {
      throw new EventNotFoundException();
    }
    await this.gateway.createEventAssistant(input);
    return {};
  }
}
