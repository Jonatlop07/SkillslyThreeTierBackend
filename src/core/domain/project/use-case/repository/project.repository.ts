import CreateProjectGateway from '@core/domain/project/use-case/gateway/create_project.gateway';
import QueryProjectGateway from "@core/domain/project/use-case/gateway/query_project.gateway";


export default interface ProjectRepository extends CreateProjectGateway, QueryProjectGateway {}
