import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';

export class QueryServiceOfferCollectionDTO {
  @IsString() @IsOptional() @ApiProperty() owner_id: string;
  @IsArray() @IsOptional() @ApiProperty() categories: Array<string>;
  @IsOptional() @ApiProperty() pagination: PaginationDTO;
}
