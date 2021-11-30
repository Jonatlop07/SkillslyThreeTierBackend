import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionMapper {
  private static http_exceptions = {
    not_found: {
      mappings: new Set([
        CoreExceptionCodes.NON_EXISTENT_CONVERSATION_CHAT,
      ]),
      status_code: HttpStatus.NOT_FOUND
    },
    bad_request: {
      mappings: new Set([
        CoreExceptionCodes.NO_MEMBERS_IN_CONVERSATION_CHAT,
        CoreExceptionCodes.EMPTY_MESSAGE_CHAT
      ]),
      status_code: HttpStatus.BAD_REQUEST
    },
    conflict_exceptions: {
      mappings: new Set([
        CoreExceptionCodes.SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT
      ]),
      status_code: HttpStatus.CONFLICT
    },
    unauthorized_exceptions: {
      mappings: new Set([
        CoreExceptionCodes.USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT
      ]),
      status_code: HttpStatus.UNAUTHORIZED
    }
  };

  private static getHttpException(status: number, error: string) {
    return new HttpException({
      status,
      error,
    }, status);
  }

  public static toHttpException(exception: CoreException) {
    if (exception.code) {
      Object
        .keys(this.http_exceptions)
        .forEach(
          (key) => {
            if (exception.code in this.http_exceptions[key].mappings)
              return this.getHttpException(
                this.http_exceptions[key].status_code,
                exception.message
              );
          }
        );
    }
    return this.getHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}
