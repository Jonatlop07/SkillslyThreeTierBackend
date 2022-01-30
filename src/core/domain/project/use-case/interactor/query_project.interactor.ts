import { Interactor } from '@core/common/use-case/interactor';
import QueryProjectInputModel from "@core/domain/project/use-case/input-model/query_project.input_model";
import QueryProjectOutputModel from "@core/domain/project/use-case/output-model/query_project.output_model";


export interface QueryProjectInteractor
    extends Interactor<QueryProjectInputModel, QueryProjectOutputModel> {}