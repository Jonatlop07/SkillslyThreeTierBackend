import { Optional } from '@core/common/type/common_types';

export default interface Find<T, V> {
  findAll(params: V): Promise<T[]>;
  findAllWithRelation(params: V): Promise<any>;
  findOne(params: V): Promise<Optional<T>>;
}
