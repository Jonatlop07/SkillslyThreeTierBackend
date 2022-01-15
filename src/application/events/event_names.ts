export class EventsNames {
  public static readonly FOLLOW_REQUEST_ACCEPTED: unique symbol = Symbol('follow_request.accepted');
  public static readonly FOLLOW_REQUEST_DELETED: unique symbol = Symbol('follow_request.deleted');
  public static readonly FOLLOW_REQUEST_SENT: unique symbol = Symbol('follow_request.sent');
  public static readonly ADDED_MEMBERS_TO_GROUP_CONVERSATION: unique symbol = Symbol('conversation.added_members');
  public static readonly UPDATED_SERVICE_REQUEST: unique symbol = Symbol('service_request.updated');
  public static readonly DELETED_SERVICE_REQUEST: unique symbol = Symbol('service_request.deleted');
  public static readonly STATUS_UPDATE_REQUEST: unique symbol = Symbol('status_update_request.created');
}
