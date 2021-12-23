import GetEventAssistantCollectionInputModel from "@core/domain/event/use-case/input-model/assistant/get_event_assistant_collection.input_model";
import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class GetEventAssistantCollectionAdapter implements GetEventAssistantCollectionInputModel {
  @Expose()
  @IsString()
  public event_id: string;

  public static new(payload: GetEventAssistantCollectionInputModel): GetEventAssistantCollectionAdapter {
    return plainToClass(GetEventAssistantCollectionAdapter, payload);
  }
}