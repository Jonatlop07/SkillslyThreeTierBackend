
import ProjectQueryModel from '@core/domain/project/use-case/query-model/project.query_model';
import Find from '@core/common/persistence/find';
import {ProjectDTO} from "@core/domain/project/use-case/persistence-dto/project.dto";

export default interface QueryProjectGateway extends Find<ProjectDTO, ProjectQueryModel> {}