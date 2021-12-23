import CreateEventInputModel from "@core/domain/event/use-case/input-model/create_event.input_model";
import { Expose, plainToClass } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateEventAdapter implements CreateEventInputModel {
  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsNumber()
  public lat: number;

  @Expose()
  @IsNumber()
  public long: number;

  @Expose()
  @IsDate()
  public date: Date;

  public static new(payload: CreateEventInputModel): CreateEventAdapter {
    return plainToClass(CreateEventAdapter, payload);
  }
}