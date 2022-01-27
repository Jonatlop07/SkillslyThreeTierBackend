import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

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
        CoreExceptionCodes.NON_EXISTENT_POST_OWNER,
        CoreExceptionCodes.NOT_FOUND_PROFILE,
        CoreExceptionCodes.NOT_FOUND_TEMP_POST,
        CoreExceptionCodes.NOT_FOUND_USER_TEMP_POSTS,
        CoreExceptionCodes.NOT_FOUND_FRIENDS_TEMP_POSTS,
        CoreExceptionCodes.NON_EXISTENT_POST_OWNER,
        CoreExceptionCodes.NON_EXISTENT_JOIN_GROUP_REQUEST,
        CoreExceptionCodes.NON_EXISTENT_GROUP,
        CoreExceptionCodes.NON_EXISTENT_SERVICE_OFFER,
        CoreExceptionCodes.NON_EXISTENT_SERVICE_REQUEST,
        CoreExceptionCodes.NON_EXISTENT_SERVICE_REQUEST_APPLICATION
      ]),
      status_code: HttpStatus.NOT_FOUND
    },
    bad_request: {
      mappings: new Set([
        CoreExceptionCodes.NO_MEMBERS_IN_CONVERSATION_CHAT,
        CoreExceptionCodes.EMPTY_MESSAGE_CHAT,
        CoreExceptionCodes.INVALID_FORMAT_USER_FOLLOW_REQUEST,
        CoreExceptionCodes.EMPTY_POST_CONTENT,
        CoreExceptionCodes.INVALID_GROUP_CONVERSATION_DETAILS_FORMAT,
        CoreExceptionCodes.REQUIRED_TEMP_POST_CONTENT,
        CoreExceptionCodes.INVALID_TEMP_POST_REFERENCE,
        CoreExceptionCodes.INVALID_TEMP_POST_REFERENCE_TYPE,
        CoreExceptionCodes.INVALID_GROUP_INFO_FORMAT,
        CoreExceptionCodes.INVALID_GROUP_CONVERSATION_DETAILS_FORMAT,
        CoreExceptionCodes.INVALID_SERVICE_OFFER_DETAILS_FORMAT,
        CoreExceptionCodes.NO_SPECIAL_ROLE_TO_OBTAIN,
        CoreExceptionCodes.INVALID_FORMAT_PROFILE_DATA,
        CoreExceptionCodes.PROFILE_EMPTY_DETAILS
      ]),
      status_code: HttpStatus.BAD_REQUEST,
    },
    conflict: {
      mappings: new Set([
        CoreExceptionCodes.ACCOUNT_ALREADY_EXISTS,
        CoreExceptionCodes.PRIVATE_CONVERSATION_ALREADY_EXISTS_CHAT,
        CoreExceptionCodes.USER_FOLLOW_REQUEST_ALREADY_EXISTS,
        CoreExceptionCodes.JOIN_REQUEST_ALREADY_EXISTS,
        CoreExceptionCodes.SERVICE_REQUEST_STATUS_UPDATE_REQUEST_ALREADY_EXISTS,
        CoreExceptionCodes.USER_ALREADY_HAS_SPECIAL_ROLES,
        CoreExceptionCodes.USER_ALREADY_HAS_REQUESTER_ROLE,
        CoreExceptionCodes.USER_ALREADY_HAS_INVESTOR_ROLE
      ]),
      status_code: HttpStatus.CONFLICT,
    },
    unauthorized: {
      mappings: new Set([
        CoreExceptionCodes.INVALID_CREDENTIALS,
        CoreExceptionCodes.USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT,
        CoreExceptionCodes.USER_DOES_NOT_HAVE_PERMISSIONS_IN_CONVERSATION,
        CoreExceptionCodes.UNAUTHORIZED_GROUP_EDITOR,
        CoreExceptionCodes.UNIQUE_GROUP_OWNER,
        CoreExceptionCodes.UNAUTHORIZED_SERVICE_REQUEST_APPLICATION_ACTION,
        CoreExceptionCodes.SERVICE_OFFER_DOES_NOT_BELONG_TO_USER
      ]),
      status_code: HttpStatus.UNAUTHORIZED,
    },
    forbidden: {
      mappings: new Set([
        CoreExceptionCodes.INVALID_ACCOUNT_DATA_FORMAT,
        CoreExceptionCodes.INVALID_REACTION_TYPE,
        CoreExceptionCodes.INVALID_PHASE_TO_DELETE_SERVICE_REQUEST
      ]),
      status_code: HttpStatus.FORBIDDEN,
    },
  };

  private static getHttpException(status: number, error: string) {
    return new HttpException({
      status,
      error,
    }, status);
  }

  public static toHttpException(exception: CoreException) {
    Logger.error(exception.stack || exception.message);
    if (exception.code) {
      for (const exception_type of Object.keys(this.http_exceptions)) {
        if (this.http_exceptions[exception_type].mappings.has(exception.code)) {
          return this.getHttpException(
            this.http_exceptions[exception_type].status_code,
            exception.message,
          );
        }
      }
    }
    return this.getHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}

