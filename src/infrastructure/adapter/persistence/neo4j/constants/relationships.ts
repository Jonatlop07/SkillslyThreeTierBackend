export class Relationships {
  public static readonly USER_POST_RELATIONSHIP = 'HAS';
  public static readonly GROUP_POST_RELATIONSHIP = 'POSTED_IN';
  public static readonly USER_EVENT_RELATIONSHIP = 'SCHEDULE';
  public static readonly USER_PROJECT_RELATIONSHIP = 'HAS';
  public static readonly USER_PROFILE_RELATIONSHIP = 'HAS';
  public static readonly USER_FOLLOW_REQUEST_RELATIONSHIP = 'FOLLOWS_PENDING';
  public static readonly USER_FOLLOW_RELATIONSHIP = 'FOLLOWS';
  public static readonly USER_SHARE_RELATIONSHIP = 'SHARE';
  public static readonly POST_COMMENT_RELATIONSHIP = 'HAS';
  public static readonly COMMENT_USER_RELATIONSHIP = 'BELONGS_TO';
  public static readonly USER_CONVERSATION_RELATIONSHIP = 'BELONGS_TO';
  public static readonly USER_MESSAGE_RELATIONSHIP = 'SENT';
  public static readonly MESSAGE_CONVERSATION_RELATIONSHIP = 'SENT_TO';
  public static readonly REACTION_TYPES_RELATIONSHIP = 'LIKE|INTERESTED|FUN';
  public static readonly USER_ADMINS_GROUP_RELATIONSHIP = 'ADMINISTRATES';
  public static readonly USER_JOIN_GROUP_REQUEST_RELATIONSHIP = 'JOIN_PENDING';
  public static readonly USER_JOINED_GROUP_RELATIONSHIP = 'JOINED';
  public static readonly USER_TEMP_POST_RELATIONSHIP = 'HAS';
  public static readonly EVENT_ASSISTANT_RELATIONSHIP = 'ASSIST';
  public static readonly USER_SERVICE_OFFER_RELATIONSHIP = 'OFFERS';
  public static readonly REQUESTER_SERVICE_REQUEST_RELATIONSHIP = 'REQUESTS';
  public static readonly APPLICANT_SERVICE_REQUEST_RELATIONSHIP = 'APPLIES';
  public static readonly SERVICE_PROVIDER_SERVICE_REQUEST_RELATIONSHIP = 'PROVIDES';
}
