import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { EventNotFoundException } from "@core/domain/event/use-case/exception/event.exception";
import GetEventAssistantCollectionGateway from "@core/domain/event/use-case/gateway/assistance/get_event_assistant_collection.gateway";
import ExistsEventGateway from "@core/domain/event/use-case/gateway/exists_event_gateway.gateway";
import GetEventAssistantCollectionInputModel from "@core/domain/event/use-case/input-model/assistant/get_event_assistant_collection.input_model";
import { GetEventAssistantCollectionInteractor } from "@core/domain/event/use-case/interactor/assistant/get_event_assistant.interactor";
import GetEventAssistantCollectionOutputModel from "@core/domain/event/use-case/output-model/assistant/get_event_assistant_collection.output_model";
import { Inject } from "@nestjs/common";

export class GetEventAssistantCollectionService implements GetEventAssistantCollectionInteractor{
  constructor(
    @Inject(EventDITokens.EventRepository)
    private readonly gateway: GetEventAssistantCollectionGateway,
    @Inject(EventDITokens.EventRepository)
    private readonly exists_event_gateway: ExistsEventGateway,
  ){}

  async execute(
    input: GetEventAssistantCollectionInputModel,
  ): Promise<GetEventAssistantCollectionOutputModel> {
    const exists_event = this.exists_event_gateway.existsById(input.event_id);
    if (!exists_event) { 
      throw new EventNotFoundException();
    }
    const result = await this.gateway.getEventAssistantCollection(input.event_id);
    return {users:result}; 
  }
}