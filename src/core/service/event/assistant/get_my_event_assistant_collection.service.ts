import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import GetMyEventAssistantCollectionGateway from '@core/domain/event/use-case/gateway/assistance/get_my_event_assistance_collection.gateway';
import GetMyEventAssistantCollectionInputModel from '@core/domain/event/use-case/input-model/assistant/get_my_event_assistant_collection.input_model';
import { GetMyEventAssistantCollectionInteractor } from '@core/domain/event/use-case/interactor/assistant/get_my_event_assistant_collection.interactor';
import GetMyEventAssistantCollectionOutputModel from '@core/domain/event/use-case/output-model/assistant/get_my_event_assistant_collection.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject } from '@nestjs/common';

export class GetMyEventAssistantCollectionService implements GetMyEventAssistantCollectionInteractor{
  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: GetMyEventAssistantCollectionGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway,
  ) {}

  public async execute(
    input: GetMyEventAssistantCollectionInputModel,
  ): Promise<GetMyEventAssistantCollectionOutputModel> {
    const exists_user = this.exists_user_gateway.exists({
      user_id: input.user_id
    });
    if (!exists_user) {
      throw new UserAccountNotFoundException();
    }
    const result = await this.gateway.getMyEventAssistantCollection(input.user_id);
    return { events: result };
  }
}
