import Delete from "@core/common/persistence/delete";
import Find from "@core/common/persistence/find";
import {ProjectDTO} from "@core/domain/project/use-case/persistence-dto/project.dto";
import ProjectQueryModel from "@core/domain/project/use-case/query-model/project.query_model";

export default interface DeleteProjectGateway extends Delete<ProjectDTO, string>, Find<ProjectDTO, ProjectQueryModel>{}