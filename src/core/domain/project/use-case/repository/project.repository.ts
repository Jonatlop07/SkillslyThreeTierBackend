import CreateProjectGateway from '@core/domain/project/use-case/gateway/create_project.gateway';
import QueryProjectGateway from '@core/domain/project/use-case/gateway/query_project.gateway';
import DeleteProjectGateway from "@core/domain/project/use-case/gateway/delete_project.gateway";
import {UpdateProjectGateway} from "@core/domain/project/use-case/gateway/update_project.gateway";


export default interface ProjectRepository extends CreateProjectGateway, QueryProjectGateway, DeleteProjectGateway, UpdateProjectGateway{}
