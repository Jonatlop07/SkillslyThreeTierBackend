import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { Event } from "@core/domain/event/entity/event";
import { EventContentElement } from "@core/domain/event/entity/type/event_content_element";
import { EventNotFoundException } from "@core/domain/event/use-case/exception/event.exception";
import { UpdateEventGateway } from "@core/domain/event/use-case/gateway/update_event.gateway";
import UpdateEventInputModel from "@core/domain/event/use-case/input-model/update_event.input_model";
import { UpdateEventInteractor } from "@core/domain/event/use-case/interactor/update_event.interactor";
import UpdateEventOutputModel from "@core/domain/event/use-case/output-model/update_event.output_model";
import { EventDTO } from "@core/domain/event/use-case/persistence-dto/event.dto";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import { UserAccountInvalidCredentialsException, UserAccountNotFoundException } from "@core/domain/user/use-case/exception/user_account.exception";
import ExistsUsersGateway from "@core/domain/user/use-case/gateway/exists_user.gateway";
import { Inject, Logger } from "@nestjs/common";

export class UpdateEventService implements UpdateEventInteractor {
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: UpdateEventGateway, 
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: ExistsUsersGateway
  ) {}

  async execute(input: UpdateEventInputModel): Promise<UpdateEventOutputModel> {
    const exists_user = this.user_gateway.existsById(input.user_id);
    if (!exists_user) {
      throw new UserAccountNotFoundException;
    }
    const matching_event = await this.gateway.findOne({ event_id: input.id, user_id: input.user_id });
    if (!matching_event) {
      throw new EventNotFoundException();      
    }
    const updated_event: EventDTO = await this.gateway.update(input);
    return {
      user_id: updated_event.user_id, 
      id: updated_event.event_id,
      name: updated_event.name,
      description: updated_event.description, 
      lat: updated_event.lat, 
      long: updated_event.long, 
      date: updated_event.date
    };
  }
}