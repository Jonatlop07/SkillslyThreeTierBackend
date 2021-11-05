import { Optional } from '@core/common/type/common_types';

export class Entity<TIdentifier extends string | number> {
  protected id: Optional<TIdentifier>;

  public getId(): TIdentifier {
    return this.id;
  }
}
