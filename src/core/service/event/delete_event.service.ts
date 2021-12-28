import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { EventNotFoundException } from "@core/domain/event/use-case/exception/event.exception";
import { DeleteEventGateway } from "@core/domain/event/use-case/gateway/delete_event.gateway";
import DeleteEventInputModel from "@core/domain/event/use-case/input-model/delete_event.input_model";
import { DeleteEventInteractor } from "@core/domain/event/use-case/interactor/delete_event.interactor";
import DeleteEventOutputModel from "@core/domain/event/use-case/output-model/delete_event.output_model";
import { EventDTO } from "@core/domain/event/use-case/persistence-dto/event.dto";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import { UserAccountNotFoundException } from "@core/domain/user/use-case/exception/user_account.exception";
import ExistsUsersGateway from "@core/domain/user/use-case/gateway/exists_user.gateway";
import { Inject, Logger } from "@nestjs/common";

export class DeleteEventService implements DeleteEventInteractor {
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: DeleteEventGateway, 
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: ExistsUsersGateway
  ) {}

  async execute(input: DeleteEventInputModel): Promise<DeleteEventOutputModel> {
    const exists_user = this.user_gateway.existsById(input.user_id);
    if (!exists_user) {
      throw new UserAccountNotFoundException;
    }
    const matching_event = await this.gateway.findOne({ event_id: input.event_id, user_id: input.user_id });
    if (!matching_event) {
      throw new EventNotFoundException();      
    }
    const deleted_event: EventDTO = await this.gateway.deleteById(input.event_id);
    return {};
  }
}