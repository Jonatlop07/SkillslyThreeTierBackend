import Find from '@core/common/persistence/find';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface QueryServiceOfferCollectionGateway extends Find<ServiceOfferDTO, ServiceOfferQueryModel> {
  findAllByCategories(categories: Array<string>, pagination?: PaginationDTO): Promise<Array<ServiceOfferDTO>>;
  findAllByUser(user_id: string, pagination?: PaginationDTO): Promise<Array<ServiceOfferDTO>>;
  findAllByUserAndCategories(params: ServiceOfferQueryModel, pagination?: PaginationDTO): Promise<Array<ServiceOfferDTO>>;
}
