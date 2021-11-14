import { IsArray, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString() resume: string;
  @IsArray() knowledge: Array<string>;
  @IsArray() talents: Array<string>;
  @IsArray() activities: Array<string>;
  @IsArray() interests: Array<string>;
  @IsString() user_email: string;
}
