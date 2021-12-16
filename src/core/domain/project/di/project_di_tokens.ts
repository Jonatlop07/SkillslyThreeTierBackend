export class ProjectDITokens {
  public static readonly CreateProjectInteractor: unique symbol = Symbol(
    'CreateProjectInteractor',
  );
  public static readonly ProjectRepository: unique symbol =
    Symbol('ProjectRepository');
}
