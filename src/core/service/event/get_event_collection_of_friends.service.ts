import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import GetEventCollectionOfFriendsGateway from '@core/domain/event/use-case/gateway/get_event_collection_of_friends.gateway';
import GetEventCollectionOfFriendsInputModel from '@core/domain/event/use-case/input-model/get_event_collection_of_friends.input_model';
import { GetEventCollectionOfFriendsInteractor } from '@core/domain/event/use-case/interactor/get_event_collection_of_friends.interactor';
import GetEventCollectionOfFriendsOutputModel from '@core/domain/event/use-case/output-model/get_event_collection_of_friends.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject, Logger } from '@nestjs/common';

export class GetEventCollectionOfFriendsService implements GetEventCollectionOfFriendsInteractor {
  private readonly logger: Logger = new Logger(GetEventCollectionOfFriendsService.name);

  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly event_gateway: GetEventCollectionOfFriendsGateway,
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
    const events = await this.event_gateway.getEventsOfFriends(user_id, {limit, offset});
    return {events};
  }
}
