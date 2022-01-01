import { QueryServiceOfferCollectionInteractor } from '@core/domain/service-offer/use-case/interactor/query_service_offer_collection.interactor';
import QueryServiceOfferCollectionInputModel
  from '@core/domain/service-offer/use-case/input-model/query_service_offer_collection.input_model';
import QueryServiceOfferCollectionOutputModel
  from '@core/domain/service-offer/use-case/output-model/query_service_offer_collection.output_model';
import { Inject } from '@nestjs/common';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import QueryServiceOfferCollectionGateway
  from '@core/domain/service-offer/use-case/gateway/query_service_offer_collection.gateway';

export class QueryServiceOfferCollectionService implements QueryServiceOfferCollectionInteractor {
  constructor(
    @Inject(ServiceOfferDITokens.ServiceOfferRepository)
    private readonly gateway: QueryServiceOfferCollectionGateway
  ) {
  }

  public async execute(input: QueryServiceOfferCollectionInputModel): Promise<QueryServiceOfferCollectionOutputModel> {
    const { owner_id, categories, pagination } = input;
    return {
      service_offers:
        owner_id && categories ?
          await this.gateway.findAllByUserAndCategories({
            owner_id,
            categories
          }, pagination)
          : owner_id ?
            await this.gateway.findAllByUser(owner_id, pagination)
            : categories ?
              await this.gateway.findAllByCategories(categories, pagination)
              : await this.gateway.findAll({}, pagination)
    };
  }
}
