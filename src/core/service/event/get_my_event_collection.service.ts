import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import GetMyEventCollectionGateway from '@core/domain/event/use-case/gateway/get_my_event_collection.gateway';
import GetEventCollectionOfFriendsInputModel from '@core/domain/event/use-case/input-model/get_my_event_collection.input_model';
import { GetMyEventCollectionInteractor } from '@core/domain/event/use-case/interactor/get_my_event_collection.interactor';
import GetEventCollectionOfFriendsOutputModel from '@core/domain/event/use-case/output-model/get_my_event_collection.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject, Logger } from '@nestjs/common';

export class GetMyEventCollectionService implements GetMyEventCollectionInteractor {
  private readonly logger: Logger = new Logger(GetMyEventCollectionService.name);

  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly event_gateway: GetMyEventCollectionGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway,
  ) {}

  async execute(input: GetEventCollectionOfFriendsInputModel): Promise<GetEventCollectionOfFriendsOutputModel> {
    const {user_id, limit, offset} = input;
    const existsUser = await this.exists_user_gateway.exists({
      user_id
    });
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const events = await this.event_gateway.getMyEvents(user_id, {limit, offset});
    return {events};
  }
}
