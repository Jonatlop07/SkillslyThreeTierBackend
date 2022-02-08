import {IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class ResetPasswordDTO {
    @IsString()
    @IsNotEmpty()
    @IsUUID('4')
    public reset_password_token: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}