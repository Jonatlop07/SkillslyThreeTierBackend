export class CoreExceptionCodes {
  // User excetion codes range form 100 to 199 
  public static readonly NON_EXISTENT_USER = 100;
  public static readonly USER_FOLLOW_REQUEST_ALREADY_EXISTS = 101;
  public static readonly NON_EXISTENT_USER_FOLLOW_REQUEST = 102; 
  public static readonly INVALID_FORMAT_USER_FOLLOW_REQUEST = 103; 
  public static readonly NON_EXISTENT_USER_FOLLOW_RELATIONSHIP = 104; 


  // Chat exception codes range from 500 to 599
  public static readonly NON_EXISTENT_CONVERSATION_CHAT = 500;
  public static readonly NO_MEMBERS_IN_CONVERSATION_CHAT = 501;
  public static readonly EMPTY_MESSAGE_CHAT = 502;
  public static readonly USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT = 503;
  public static readonly SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT = 504;

  public static readonly REACTION_NON_EXISTENT_POST = 600;
  public static readonly INVALID_REACTION_TYPE = 601;
}
