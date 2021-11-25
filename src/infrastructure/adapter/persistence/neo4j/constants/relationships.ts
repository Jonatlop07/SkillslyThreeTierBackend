export class Relationships {
  public static readonly USER_POST_RELATIONSHIP = 'HAS';

  public static readonly USER_PROFILE_RELATIONSHIP = 'HAS';

  public static readonly USER_CONVERSATION_RELATIONSHIP = 'BELONGS_TO';

  public static readonly USER_MESSAGE_RELATIONSHIP = 'SENT';

  public static readonly MESSAGE_CONVERSATION_RELATIONSHIP = 'SENT_TO';
}
