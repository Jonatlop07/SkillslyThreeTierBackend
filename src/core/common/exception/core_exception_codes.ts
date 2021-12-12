export class CoreExceptionCodes {

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

}