import CreateEventAssistantInputModel from "@core/domain/event/use-case/input-model/assistant/create_event_assistant.input_model";
import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class CreateEventAssistantAdapter implements CreateEventAssistantInputModel {
  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsString()
  public event_id: string;

  public static new(payload: CreateEventAssistantInputModel): CreateEventAssistantAdapter {
    return plainToClass(CreateEventAssistantAdapter, payload);
  }
}