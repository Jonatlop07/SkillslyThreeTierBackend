import { Optional } from '@core/common/type/common_types';

export default interface Find<T> {
  findOneByParam(param: string, value: any): Promise<Optional<T>>;
  findAll(params: any): Promise<T[]>;
}
