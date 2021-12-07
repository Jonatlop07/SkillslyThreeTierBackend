import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionMapper {

  private static http_exceptions = {
    not_found: {
      mappings: new Set([
        CoreExceptionCodes.REACTION_NON_EXISTENT_POST,
        CoreExceptionCodes.NON_EXISTENT_CONVERSATION_CHAT,
        CoreExceptionCodes.NON_EXISTENT_USER_FOLLOW_REQUEST,
        CoreExceptionCodes.NON_EXISTENT_USER_FOLLOW_RELATIONSHIP,
        CoreExceptionCodes.NON_EXISTENT_USER,
        CoreExceptionCodes.NON_EXISTENT_POST,
        CoreExceptionCodes.NON_EXISTENT_POST_OWNER
      ]),
      status_code: HttpStatus.NOT_FOUND
    },
    bad_request: {
      mappings: new Set([
        CoreExceptionCodes.NO_MEMBERS_IN_CONVERSATION_CHAT,
        CoreExceptionCodes.EMPTY_MESSAGE_CHAT,
        CoreExceptionCodes.INVALID_FORMAT_USER_FOLLOW_REQUEST,
        CoreExceptionCodes.EMPTY_POST_CONTENT
      ]),
      status_code: HttpStatus.BAD_REQUEST
    },
    conflict: {
      mappings: new Set([
        CoreExceptionCodes.ACCOUNT_ALREADY_EXISTS,
        CoreExceptionCodes.SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT,
        CoreExceptionCodes.USER_FOLLOW_REQUEST_ALREADY_EXISTS,
      ]),
      status_code: HttpStatus.CONFLICT
    },
    unauthorized: {
      mappings: new Set([
        CoreExceptionCodes.INVALID_CREDENTIALS,
        CoreExceptionCodes.USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT,
      ]),
      status_code: HttpStatus.UNAUTHORIZED
    },
    forbidden: {
      mappings: new Set([
        CoreExceptionCodes.INVALID_ACCOUNT_DATA_FORMAT,
        CoreExceptionCodes.INVALID_REACTION_TYPE
      ]),
      status_code: HttpStatus.FORBIDDEN
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
      for (const exception_type of Object.keys(this.http_exceptions)){
        if (this.http_exceptions[exception_type].mappings.has(exception.code)){
          return this.getHttpException(
            this.http_exceptions[exception_type].status_code,
            exception.message
          );
        }
      }
    }
    return this.getHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}

