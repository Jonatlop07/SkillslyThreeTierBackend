import { Optional } from '@core/common/type/common_types';

export default interface Find<T, V> {
  findOneByParam(param: string, value: any): Promise<Optional<T>>;
  findAll(params: V): Promise<T[]>;
  findOne(params: V): Promise<Optional<T>>;
}
