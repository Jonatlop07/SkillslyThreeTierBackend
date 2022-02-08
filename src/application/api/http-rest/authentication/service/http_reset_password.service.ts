import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import { RequestResetPasswordDTO } from '@application/api/http-rest/authentication/types/request_reset_password.dto';
import { v4 } from 'uuid';
import RequestResetPassword from '@core/domain/user/use-case/gateway/request_reset_passwrod.gateway';
import {
  UserAccountInvalidDataFormatException,
  UserAccountNotFoundException,
} from '@core/domain/user/use-case/exception/user_account.exception';
import { ResetPasswordDTO } from '@application/api/http-rest/authentication/types/reset_password.dto';
import ResetPassword from '@core/domain/user/use-case/gateway/reset_password.gateway';
import { isValidPassword } from '@core/common/util/validators/account_data.validators';
import generateHashedPassword from '@core/common/util/validators/generate_hash_password';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class HttpResetPasswordService {
  private readonly logger: Logger = new Logger(HttpResetPasswordService.name);

  constructor(
    private readonly mailerService: MailerService,
    @Inject(UserDITokens.UserRepository)
    private readonly user_repository: UserRepository,
    @Inject(UserDITokens.UserRepository)
    private readonly request_reset_password: RequestResetPassword,
    @Inject(UserDITokens.UserRepository)
    private readonly reset_password: ResetPassword,
  ) {}

  public async requestResetPassword(
    requestResetPasswordDTO: RequestResetPasswordDTO,
  ): Promise<void> {
    const { email } = requestResetPasswordDTO;
    const resulting_user: UserDTO = await this.request_reset_password.findOne({
      email: email,
    });
    if (!resulting_user) {
      throw new UserAccountNotFoundException();
    }
    const token = v4();
    await this.request_reset_password.partialUpdate(
      {
        email,
      },
      {
        reset_password_token: token,
      },
    );
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: 'skillsly_team@skillsly.com',
        subject: 'Request Reset Password Skillsly',
        text: 'Skillsly',

        html:
          '<b> Porfavor ingrese al siguiente enlace para recuperar su contraseña:</b>' +
          `<a href="${token}" target="_blank"> Recuperador de contraseñas Skillsly.com</a>`,
      });
    } catch (e) {
      console.log(e)
    }

  }

  public async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<void> {
    const { reset_password_token, password } = resetPasswordDTO;
    const resulting_user: UserDTO = await this.reset_password.findOne({
      reset_password_token,
    });
    if (!resulting_user) {
      throw new UserAccountNotFoundException();
    }
    if (!isValidPassword(password)) {
      throw new UserAccountInvalidDataFormatException();
    }
    const email = resulting_user.email;
    await this.request_reset_password.partialUpdate(
      {
        email,
      },
      {
        password: generateHashedPassword(password),
        reset_password_token: null,
      },
    );
  }
}
