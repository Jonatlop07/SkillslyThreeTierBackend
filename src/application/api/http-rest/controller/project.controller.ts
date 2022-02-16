import {
  Body,
  Controller, Delete,
  Get,
  HttpCode, HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth, ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { CreateProjectAdapter } from '@application/api/http-rest/http-adapter/project/create_project.adapter';
import {
  QueryProjectCollectionInteractor
} from '@core/domain/project/use-case/interactor/query_project_collection.interactor';
import {
  QueryProjectCollectionAdapter
} from '@application/api/http-rest/http-adapter/project/query_project_collection.adapter';
import { DeleteProjectInteractor } from '@core/domain/project/use-case/interactor/delete_project.interactor';
import { UpdateProjectInteractor } from '@core/domain/project/use-case/interactor/update_project.interactor';

@Controller('projects')
@Roles(Role.User)
@ApiTags('projects')
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred'
})
export class ProjectController {
  private readonly logger: Logger = new Logger(ProjectController.name);

  constructor(
    @Inject(ProjectDITokens.CreateProjectInteractor)
    private readonly create_project_interactor: CreateProjectInteractor,
    @Inject(ProjectDITokens.QueryProjectCollectionInteractor)
    private readonly query_project_collection_interactor: QueryProjectCollectionInteractor,
    @Inject(ProjectDITokens.DeleteProjectInteractor)
    private readonly delete_project_interactor: DeleteProjectInteractor,
    @Inject(ProjectDITokens.UpdateProjectInteractor)
    private readonly update_project_interactor: UpdateProjectInteractor
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createProject(
    @HttpUser() http_user: HttpUserPayload,
    @Body() body
  ) {
    try {
      return await this.create_project_interactor.execute(
        await CreateProjectAdapter.new({
          owner_id: http_user.id,
          title: body.title,
          members: body.members,
          description: body.description,
          reference: body.reference,
          reference_type: body.reference_type,
          annexes: body.annexes
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get('/:user_id')
  @HttpCode(HttpStatus.OK)
  public async queryProjectCollection(
    @Param('user_id') user_id: string
  ) {
    try {
      return await this.query_project_collection_interactor.execute(
        await QueryProjectCollectionAdapter.new({
          owner_id: user_id
        })
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put(':project_id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Project successfully updated' })
  @ApiBadRequestResponse({
    description: 'The content of the project should not be empty'
  })
  @ApiNotFoundResponse({
    description: 'The provided project does not exist'
  })
  public async updateProject(
    @HttpUser() http_user: HttpUserPayload,
    @Param('project_id') project_id: string,
    @Body() body
  ) {
    if (body.user_id !== http_user.id)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Cannot update a project that does not belong to you'
        },
        HttpStatus.UNAUTHORIZED
      );
    try {
      return await this.update_project_interactor.execute({
        project_id: project_id,
        owner_id: body.owner_id,
        title: body.title,
        members: body.members,
        description: body.description,
        reference: body.reference,
        reference_type: body.reference_type,
        annexes: body.annexes
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Delete(':project_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCreatedResponse({ description: 'Project has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid data format' })
  @ApiBadGatewayResponse({ description: 'Error while deleting project' })
  @ApiBearerAuth()
  public async deleteProject(
    @Param('project_id') project_id: string,
    @HttpUser() http_user: HttpUserPayload
  ) {
    try {
      return await this.delete_project_interactor.execute({
        project_id: project_id,
        owner_id: http_user.id
      });
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
