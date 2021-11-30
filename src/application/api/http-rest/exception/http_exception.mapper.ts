import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionMapper {
  private static readonly not_found_exceptions = new Set([
    CoreExceptionCodes.NON_EXISTENT_CONVERSATION_CHAT,
    CoreExceptionCodes.NON_EXISTENT_POST,
  ]);

  private static readonly bad_request_exceptions = new Set([
    CoreExceptionCodes.NO_MEMBERS_IN_CONVERSATION_CHAT,
    CoreExceptionCodes.EMPTY_MESSAGE_CHAT,
  ]);

  private static readonly conflict_exceptions = new Set([
    CoreExceptionCodes.SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT
  ]);

  private static readonly unauthorized_exceptions = new Set([
    CoreExceptionCodes.USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT
  ]);

  private static readonly forbidden_exceptions = new Set([
    CoreExceptionCodes.INVALID_REACTION_TYPE,
  ]);

  private static getHttpException(status: number, error: string) {
    return new HttpException({
      status,
      error,
    }, status);
  }

  public static toHttpException(exception: CoreException) {
    if (exception.code) {
      if (this.not_found_exceptions.has(exception.code)) {
        return this.getHttpException(HttpStatus.NOT_FOUND, exception.message);
      } else if (this.bad_request_exceptions.has(exception.code)) {
        return this.getHttpException(HttpStatus.BAD_REQUEST, exception.message);
      } else if (this.conflict_exceptions.has(exception.code) ) {
        return this.getHttpException(HttpStatus.CONFLICT, exception.message);
      } else if (this.unauthorized_exceptions.has(exception.code)) {
        return this.getHttpException(HttpStatus.UNAUTHORIZED, exception.message);
      } else if (this.forbidden_exceptions.has(exception.code)) {
        return this.getHttpException(HttpStatus.FORBIDDEN, exception.message);
      }
    }
    return this.getHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}
