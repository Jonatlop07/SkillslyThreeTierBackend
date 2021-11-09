import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString() resume: string;
  @IsArray() knowledge: Array<string>;
  @IsArray() talents: Array<string>;
  @IsArray() activities: Array<string>;
  @IsArray() interests: Array<string>;
  @IsNumber() userID: number;
}