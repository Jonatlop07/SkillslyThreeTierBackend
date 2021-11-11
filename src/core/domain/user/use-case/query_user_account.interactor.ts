import { Interactor } from '@core/common/use-case/interactor';
import QueryUserAccountInputModel from '@core/domain/user/input-model/query_user_interactor.input_model';
import QueryUserAccountOutputModel from '@core/domain/user/use-case/output-model/query_user_interactor.output_model';

export interface QueryUserAccountInteractor extends Interactor<QueryUserAccountInputModel, QueryUserAccountOutputModel> {}
