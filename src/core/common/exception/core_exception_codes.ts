export class CoreExceptionCodes {
  public static readonly ACCOUNT_ALREADY_EXISTS = 0;
  public static readonly INVALID_ACCOUNT_DATA_FORMAT = 1;
  public static readonly INVALID_CREDENTIALS = 2;
  public static readonly NO_SPECIAL_ROLE_TO_OBTAIN = 3;
  public static readonly USER_ALREADY_HAS_SPECIAL_ROLES = 4;
  public static readonly USER_ALREADY_HAS_REQUESTER_ROLE = 5;
  public static readonly USER_ALREADY_HAS_INVESTOR_ROLE = 6;

  // User exception codes range form 100 to 199
  public static readonly NON_EXISTENT_USER = 100;
  public static readonly USER_FOLLOW_REQUEST_ALREADY_EXISTS = 101;
  public static readonly NON_EXISTENT_USER_FOLLOW_REQUEST = 102;
  public static readonly INVALID_FORMAT_USER_FOLLOW_REQUEST = 103;
  public static readonly NON_EXISTENT_USER_FOLLOW_RELATIONSHIP = 104;

  // Post exception codes range from 200 to 299
  public static readonly EMPTY_POST_CONTENT = 200;
  public static readonly NON_EXISTENT_POST = 201;
  public static readonly NON_EXISTENT_POST_OWNER = 202;

  // Profile exception codes range from 300 to 399
  public static readonly INVALID_FORMAT_PROFILE_DATA = 300;
  public static readonly PROFILE_EMPTY_DETAILS = 301;
  public static readonly NOT_FOUND_PROFILE = 302;

  // Chat exception codes range from 500 to 599
  public static readonly NON_EXISTENT_CONVERSATION_CHAT = 500;
  public static readonly NO_MEMBERS_IN_CONVERSATION_CHAT = 501;
  public static readonly EMPTY_MESSAGE_CHAT = 502;
  public static readonly USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT = 503;
  public static readonly PRIVATE_CONVERSATION_ALREADY_EXISTS_CHAT = 504;
  public static readonly INVALID_GROUP_CONVERSATION_DETAILS_FORMAT = 505;
  public static readonly USER_DOES_NOT_HAVE_PERMISSIONS_IN_CONVERSATION = 506;

  public static readonly REQUIRED_TEMP_POST_CONTENT = 900;
  public static readonly INVALID_TEMP_POST_REFERENCE = 901;
  public static readonly INVALID_TEMP_POST_REFERENCE_TYPE = 902;
  public static readonly NOT_FOUND_TEMP_POST = 903;
  public static readonly NOT_FOUND_USER_TEMP_POSTS = 904;
  public static readonly NOT_FOUND_FRIENDS_TEMP_POSTS = 905;

  // Reaction exception codes range from 600 to 699
  public static readonly REACTION_NON_EXISTENT_POST = 600;
  public static readonly INVALID_REACTION_TYPE = 601;

  //Group exception codes range from 800 to 899
  public static readonly INVALID_GROUP_INFO_FORMAT = 800;
  public static readonly UNAUTHORIZED_GROUP_EDITOR = 801;
  public static readonly JOIN_REQUEST_ALREADY_EXISTS = 802;
  public static readonly NON_EXISTENT_JOIN_GROUP_REQUEST = 803;
  public static readonly UNIQUE_GROUP_OWNER = 804;
  public static readonly NON_EXISTENT_GROUP = 805;

  public static readonly EMPTY_PROJECT_CONTENT = 700;
  public static readonly NON_EXISTENT_PROJECT = 701;
  public static readonly NON_EXISTENT_PROJECT_OWNER = 702;

  // Event exception codes from 1000 to 1001
  public static readonly EMPTY_EVENT_DESCRIPTION_OR_NAME= 1000;
  public static readonly NON_EXISTENT_EVENT = 1001;
  public static readonly NON_EXISTENT_EVENT_ASSISTANT = 1002;

  public static readonly INVALID_SERVICE_OFFER_DETAILS_FORMAT = 1100;
  public static readonly NON_EXISTENT_SERVICE_OFFER = 1101;
  public static readonly SERVICE_OFFER_DOES_NOT_BELONG_TO_USER = 1102;

  public static readonly INVALID_SERVICE_REQUEST_DETAILS_FORMAT = 1200;
  public static readonly NON_EXISTENT_SERVICE_REQUEST = 1201;
  public static readonly INVALID_PHASE_TO_DELETE_SERVICE_REQUEST = 1202;
  public static readonly NON_EXISTENT_SERVICE_REQUEST_APPLICATION = 1203;
  public static readonly UNAUTHORIZED_SERVICE_REQUEST_APPLICATION_ACTION = 1204;
  public static readonly SERVICE_REQUEST_STATUS_UPDATE_REQUEST_ALREADY_EXISTS = 1205;
  public static readonly NON_EXISTENT_SERVICE_REQUEST_STATUS_UPDATE_REQUEST = 1206;

}
