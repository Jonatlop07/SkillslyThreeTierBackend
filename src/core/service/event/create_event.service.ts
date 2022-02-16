import { CreateEventInteractor } from '@core/domain/event/use-case/interactor/create_event.interactor';
import { Inject } from '@nestjs/common';
import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import CreateEventInputModel from '@core/domain/event/use-case/input-model/create_event.input_model';
import CreateEventOutputModel from '@core/domain/event/use-case/output-model/create_event.output_model';
import { EmptyEventDescriptionException } from '@core/domain/event/use-case/exception/event.exception';
import CreateEventGateway from '@core/domain/event/use-case/gateway/create_event.gateway';
import { UserDITokens } from '../../domain/user/di/user_di_tokens';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';

export class CreateEventService implements CreateEventInteractor{
  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: CreateEventGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway
  ){}

  async execute(
    input: CreateEventInputModel,
  ): Promise<CreateEventOutputModel> {
    const exists_user = this.exists_user_gateway.exists({ user_id: input.user_id });
    if (!exists_user) {
      throw new UserAccountNotFoundException;
    }
    if (!input.description || !input.name) {
      throw new EmptyEventDescriptionException();
    }
    const result = await this.gateway.create(input);
    return {
      name: result.name
    } as CreateEventOutputModel;
  }
}
