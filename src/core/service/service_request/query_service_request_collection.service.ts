import { QueryServiceRequestCollectionInteractor } from '@core/domain/service-request/use-case/interactor/query_service_request_collection.interactor';
import QueryServiceRequestCollectionOutputModel
  from '@core/domain/service-request/use-case/output-model/query_service_request_collection.output_model';
import QueryServiceRequestCollectionInputModel
  from '@core/domain/service-request/use-case/input-model/query_service_request_collection.input_model';
import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import QueryServiceRequestCollectionGateway
  from '@core/domain/service-request/use-case/gateway/query_service_request_collection.gateway';

export class QueryServiceRequestCollectionService implements QueryServiceRequestCollectionInteractor {
  private readonly logger: Logger = new Logger(QueryServiceRequestCollectionService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: QueryServiceRequestCollectionGateway
  ) {
  }

  public async execute(input: QueryServiceRequestCollectionInputModel): Promise<QueryServiceRequestCollectionOutputModel> {
    const { owner_id, categories, pagination } = input;
    return {
      service_requests:
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
