import Update from "@core/common/persistence/update";
import Find from "@core/common/persistence/find";
import {ProjectDTO} from "@core/domain/project/use-case/persistence-dto/project.dto";
import ProjectQueryModel from "@core/domain/project/use-case/query-model/project.query_model";

export interface UpdateProjectGateway extends Update<ProjectDTO>, Find<ProjectDTO, ProjectQueryModel> {}