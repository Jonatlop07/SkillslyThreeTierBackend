import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface QueryServiceOfferCollectionInputModel extends ServiceOfferQueryModel {
  pagination?: PaginationDTO
}
