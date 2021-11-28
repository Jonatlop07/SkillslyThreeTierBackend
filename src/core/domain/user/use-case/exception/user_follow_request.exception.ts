abstract class UserFollowRequestException extends Error {}

class UserFollowRequestAlreadyExistsException extends UserFollowRequestException {}

export {
  UserFollowRequestException,
  UserFollowRequestAlreadyExistsException
}