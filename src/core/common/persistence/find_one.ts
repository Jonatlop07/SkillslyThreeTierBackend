import { Optional } from '@core/common/type/common_types';

export default interface FindOne<F, R> {
  findOne(params: F): Promise<Optional<R>>;
}
