export class CoreExceptionCodes {
  public static readonly ACCOUNT_ALREADY_EXISTS = 0;
  public static readonly INVALID_ACCOUNT_DATA_FORMAT = 1;
  public static readonly INVALID_CREDENTIALS = 2;

  // User excetion codes range form 100 to 199
  public static readonly NON_EXISTENT_USER = 100;
  public static readonly USER_FOLLOW_REQUEST_ALREADY_EXISTS = 101;
  public static readonly NON_EXISTENT_USER_FOLLOW_REQUEST = 102;
  public static readonly INVALID_FORMAT_USER_FOLLOW_REQUEST = 103;
  public static readonly NON_EXISTENT_USER_FOLLOW_RELATIONSHIP = 104;

  // Post exception codes range from 200 to 299
  public static readonly EMPTY_POST_CONTENT = 200;
  public static readonly NON_EXISTENT_POST = 201;
  public static readonly NON_EXISTENT_POST_OWNER = 202;

  // Chat exception codes range from 500 to 599
  public static readonly NON_EXISTENT_CONVERSATION_CHAT = 500;
  public static readonly NO_MEMBERS_IN_CONVERSATION_CHAT = 501;
  public static readonly EMPTY_MESSAGE_CHAT = 502;
  public static readonly USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT = 503;
  public static readonly SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT = 504;

  public static readonly NON_EXISTENT_POST = 600;
  public static readonly INVALID_REACTION_TYPE = 601;

  public static readonly REQUIRED_TEMP_POST_CONTENT = 900;
  public static readonly INVALID_TEMP_POST_REFERENCE = 901;
  public static readonly INVALID_TEMP_POST_REFERENCE_TYPE = 902;
  public static readonly NOT_FOUND_TEMP_POST = 903;
  public static readonly PRIVATE_CONVERSATION_ALREADY_EXISTS_CHAT = 504;
  public static readonly INVALID_GROUP_CONVERSATION_DETAILS_FORMAT = 505;

  public static readonly REACTION_NON_EXISTENT_POST = 600;
  public static readonly INVALID_REACTION_TYPE = 601;
}
