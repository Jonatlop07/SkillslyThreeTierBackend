export class ProjectDITokens {
  public static readonly CreateProjectInteractor: unique symbol = Symbol(
    'CreateProjectInteractor',
  );
  public static readonly QueryProjectInteractor: unique symbol = Symbol(
    'QueryProjectInteractor',
  );
  public static readonly UpdateProjectInteractor: unique symbol = Symbol(
    'UpdateProjectInteractor',
  );
  public static readonly DeleteProjectInteractor: unique symbol = Symbol(
    'DeleteProjectInteractor',
  );
  public static readonly ProjectRepository: unique symbol =
    Symbol('ProjectRepository');
}
