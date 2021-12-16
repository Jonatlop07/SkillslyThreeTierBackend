export class ConversationEventsNames {
  public static readonly FOLLOW_REQUEST_ACCEPTED: unique symbol = Symbol('follow_request.accepted');
  public static readonly FOLLOW_REQUEST_REJECTED: unique symbol = Symbol('follow_request.rejected');
  public static readonly FOLLOW_REQUEST_DELETED: unique symbol = Symbol('follow_request.deleted');
  public static readonly FOLLOW_REQUEST_SENT: unique symbol = Symbol('follow_request.sent');
  public static readonly ADDED_MEMBERS_TO_GROUP_CONVERSATION: unique symbol = Symbol('conversation.added_members');
}
