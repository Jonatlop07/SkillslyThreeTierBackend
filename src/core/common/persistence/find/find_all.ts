import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface FindAll<F, R> {
  findAll(params: F, pagination?: PaginationDTO): Promise<R[]>;
}
