export class ReactionDITokens {
  public static readonly ReactionRepository: unique symbol  = Symbol('ReactionRepository');
  public static readonly AddReactionInteractor: unique symbol = Symbol('AddReactionInteractor');
  public static readonly QueryReactionsInteractor: unique symbol = Symbol('QueryReactionsInteractor');
}
