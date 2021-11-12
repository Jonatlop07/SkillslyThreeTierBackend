import { Optional } from '@core/common/type/common_types';

export default interface Query<T> {
  queryById(id: string): Promise<Optional<T>>;
}
