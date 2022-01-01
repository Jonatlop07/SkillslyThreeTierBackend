import { Optional } from '@core/common/type/common_types';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface Find<T, V> {
  findAll(params: V, pagination?: PaginationDTO): Promise<T[]>;
  findAllWithRelation(params: V): Promise<any>;
  findOne(params: V): Promise<Optional<T>>;
}
