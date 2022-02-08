import { IsNotEmpty, IsString } from 'class-validator';

export class RequestResetPasswordDTO {

    @IsString()
    @IsNotEmpty()
    public email: string;
}