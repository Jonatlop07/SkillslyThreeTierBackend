import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
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
import { Role } from '@core/domain/user/entity/type/role.enum';
import { CreateProjectAdapter } from '@application/api/http-rest/http-adapter/project/create_project.adapter';
import { QueryPermanentPostAdapter } from '@application/api/http-rest/http-adapter/post/query_permanent_post.adapter';
import {QueryProjectInteractor} from "@core/domain/project/use-case/interactor/query_project.interactor";
import {QueryProjectAdapter} from "@application/api/http-rest/http-adapter/project/query_project.adapter";

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
    @Inject(ProjectDITokens.QueryProjectInteractor)
    private readonly query_project_interactor: QueryProjectInteractor,
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

  @Get('/:user_id')
  @HttpCode(HttpStatus.OK)
  public async queryProject(
    @Param('user_id') user_id: string,
  ) {
    try {
      return await this.query_project_interactor.execute(
        await QueryProjectAdapter.new({
          user_id: user_id,
        }),
      );
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
