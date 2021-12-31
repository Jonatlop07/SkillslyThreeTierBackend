import DeleteEventAssistantInputModel from '@core/domain/event/use-case/input-model/assistant/delete_event_assistant.input_model';
import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteEventAssistantAdapter implements DeleteEventAssistantInputModel {
  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsString()
  public event_id: string;

  public static new(payload: DeleteEventAssistantInputModel): DeleteEventAssistantAdapter {
    return plainToClass(DeleteEventAssistantAdapter, payload);
  }
}
