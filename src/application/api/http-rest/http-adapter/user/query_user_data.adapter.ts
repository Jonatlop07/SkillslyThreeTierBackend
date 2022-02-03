import QueryUserAccountOutputModel from '@core/domain/user/use-case/output-model/query_user_interactor.output_model';
import { QueryUserDataDTO } from '../../http-dto/user/http_query_user_data_response.dto';

export class QueryUserDataAdapter {
  public static toResponseDTO(payload: QueryUserAccountOutputModel): QueryUserDataDTO {
    return {
      email: payload.email,
      name: payload.name,
    };
  }
}
