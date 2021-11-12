export class UserDITokens {
  public static readonly UserRepository: unique symbol  = Symbol('UserRepository');

  public static readonly CreateUserAccountInteractor: unique symbol = Symbol('CreateUserAccountInteractor');

  public static readonly ValidateCredentialsInteractor: unique symbol = Symbol('ValidateCredentialsInteractor');

  public static readonly UpdateUserAccountInteractor: unique symbol = Symbol('UpdateUserAccountInteractor');

  public static readonly QueryUserAccountInteractor: unique symbol = Symbol('QueryUserAccountInteractor');

  public static readonly DeleteUserAccountInteractor: unique symbol = Symbol('DeleteUserAccountInteractor');
}
