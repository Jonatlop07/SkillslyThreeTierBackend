import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { Role } from '@core/domain/user/entity/role.enum';
import { CreateProjectAdapter } from '@application/api/http-rest/http-adapter/project/create_project.adapter';

@Controller('projects')
@Roles(Role.User)
@ApiTags('projects')
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred',
})
export class ProjectController {
  private readonly logger: Logger = new Logger(ProjectController.name);

  constructor(
    @Inject(ProjectDITokens.CreateProjectInteractor)
    private readonly create_project_interactor: CreateProjectInteractor,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createProject(
    @HttpUser() http_user: HttpUserPayload,
    @Body() body,
  ) {
    try {
      return await this.create_project_interactor.execute(
        await CreateProjectAdapter.new({
          user_id: http_user.id,
          title: body.title,
          members: body.members,
          description: body.description,
          reference: body.reference,
          reference_type: body.reference_type,
          annexes: body.annexes,
        }),
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
