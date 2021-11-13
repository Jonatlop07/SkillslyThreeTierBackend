export class ProfileDITokens {
  public static readonly CreateProfileInteractor: unique symbol = Symbol('CreateProfileInteractor');
  public static readonly GetProfileInteractor: unique symbol = Symbol('GetProfileInteractor');
  public static readonly EditProfileInteractor: unique symbol = Symbol('EditProfileInteractor');
  public static readonly ProfileRepository: unique symbol = Symbol('ProfileRepository');
}
