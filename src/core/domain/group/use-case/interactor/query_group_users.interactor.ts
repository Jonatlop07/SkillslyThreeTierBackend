import { Interactor } from '@core/common/use-case/interactor';
import QueryGroupUsersInputModel from '../input-model/query_group_users.input_model';
import QueryGroupUsersOutputModel from '../output-model/query_group_users.output_model';

export interface QueryGroupUsersInteractor
  extends Interactor<
  QueryGroupUsersInputModel,
  QueryGroupUsersOutputModel
  > { }
