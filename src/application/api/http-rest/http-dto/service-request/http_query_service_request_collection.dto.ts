import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryServiceRequestCollectionDTO {
  @IsString() @IsOptional() @ApiProperty() owner_id: string;
  @IsArray() @IsOptional() @ApiProperty() categories: string;
  @IsNumber() @IsOptional() @IsPositive() limit;
  @IsNumber() @IsOptional() @IsPositive() offset;
}
