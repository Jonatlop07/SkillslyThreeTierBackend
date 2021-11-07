import { Optional } from '@core/common/type/common_types';

export class Entity<TIdentifier extends string | number> {
  protected _id: Optional<TIdentifier>;

  public get id(): TIdentifier {
    return this._id;
  }
}
