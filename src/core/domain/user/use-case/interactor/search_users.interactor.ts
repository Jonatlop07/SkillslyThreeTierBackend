import { Interactor } from '@core/common/use-case/interactor';
import SearchUsersInputModel from '@core/domain/user/use-case/input-model/search_users.input_model';
import SearchUsersOutputModel from '@core/domain/user/use-case/output-model/search_users.output_model';

export interface SearchUsersInteractor extends Interactor<SearchUsersInputModel, SearchUsersOutputModel> {}
