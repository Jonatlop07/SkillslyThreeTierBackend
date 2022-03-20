import { Optional } from '@core/common/type/common_types';

export default interface Delete<F, R> {
  delete(params: F): Promise<Optional<R> | void>;
}
