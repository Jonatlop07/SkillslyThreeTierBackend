import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags
} from '@nestjs/swagger';
import { ValidationPipe } from '@application/api/http-rest/common/pipes/validation.pipe';
import { CreateProfileDto } from '@application/api/http-rest/http-dto/profile/http_create_profile.dto';
import { Roles } from '@application/api/http-rest/authorization/decorator/roles.decorator';
import { CreateProfileAdapter } from '@application/api/http-rest/http-adapter/profile/create_profile.adapter';
import { GetProfileAdapter } from '@application/api/http-rest/http-adapter/profile/get_profile.adapter';
import { EditProfileAdapter } from '@application/api/http-rest/http-adapter/profile/edit_profile.adapter';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { EditProfileInteractor } from '@core/domain/profile/use-case/interactor/edit_profile.interactor';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpExceptionMapper } from '@application/api/http-rest/exception/http_exception.mapper';

@Controller('users/profile')
@Roles(Role.User)
@ApiTags('profile')
@ApiInternalServerErrorResponse({ description: 'An internal server error occurred' })
export class ProfileController {
  constructor(
    @Inject(ProfileDITokens.CreateProfileInteractor)
    private readonly create_profile_interactor: CreateProfileInteractor,
    @Inject(ProfileDITokens.GetProfileInteractor)
    private readonly get_profile_interactor: GetProfileInteractor,
    @Inject(ProfileDITokens.EditProfileInteractor)
    private readonly edit_profile_interactor: EditProfileInteractor,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'The details of the profile were provided in an invalid format' })
  public async createProfile(@Body(new ValidationPipe()) body: CreateProfileDto, @HttpUser() http_user: HttpUserPayload) {
    try {
      return await this.create_profile_interactor.execute(CreateProfileAdapter.new({
        resume: body.resume,
        interests: body.interests,
        activities: body.activities,
        knowledge: body.knowledge,
        talents: body.talents,
        user_id: http_user.id,
      }));
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'The user does not have a profile' })
  public async getProfile(@HttpUser() http_user: HttpUserPayload): Promise<ProfileDTO> {
    try {
      return await this.get_profile_interactor.execute(GetProfileAdapter.new({
        user_id: http_user.id,
      }));
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'No new changes to the profile were provided' })
  public async editProfile(@Body(new ValidationPipe()) body: Partial<CreateProfileDto>, @HttpUser() http_user: HttpUserPayload) {
    if (Object.keys(body).length === 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Request cannot be empty',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.edit_profile_interactor.execute(EditProfileAdapter.new({ ...body, user_id: http_user.id }));
    } catch (e) {
      throw HttpExceptionMapper.toHttpException(e);
    }
  }
}
