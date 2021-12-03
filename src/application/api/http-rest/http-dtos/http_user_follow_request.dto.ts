import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateUserFollowRequestDTO {
  @IsString() @ApiModelProperty() action: string;
}

export class DeleteUserFollowRequestDTO {
  @IsString() @ApiModelProperty() action: string;
}