import { Interactor } from '@core/common/use-case/interactor';
import SearchUsersInputModel from './input-model/search_users.input_model';
import SearchUsersOutputModel from './output-model/search_users.output_model';

export interface SearchUsersInteractor extends Interactor<SearchUsersInputModel, SearchUsersOutputModel>{}
