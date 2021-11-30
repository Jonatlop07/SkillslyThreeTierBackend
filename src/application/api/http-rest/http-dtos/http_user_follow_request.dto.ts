import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateUserFollowRequestDTO {
  @IsString() @ApiModelProperty() user_destiny_id: string;
}