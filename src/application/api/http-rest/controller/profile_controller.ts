import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post, Put, Query } from '@nestjs/common';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/create_profile.interactor';
import { CreateProfileAdapter } from '@infrastructure/adapter/use-case/profile/create_profile.adapter';
import { CreateProfileInvalidDataFormatException } from '@core/service/profile/create_profile.exception';
import { ValidationPipe } from '@application/api/http-rest/profile/pipes/validation.pipe';
import { CreateProfileDto } from '@application/api/http-rest/profile/dtos/http_create_profile.dto';
import { Public } from '@application/api/http-rest/authentication/decorator/public';
import { GetProfileInteractor } from '@core/domain/profile/use-case/get_profile.interactor';
import { GetProfileAdapter } from '@infrastructure/adapter/use-case/profile/get_profile.adapter';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { EditProfileInteractor } from '@core/domain/profile/use-case/edit_profile.interactor';
import { GetProfileNotFoundFormatException } from '../../../../../dist/core/service/profile/get_profile.exception';
import { EditProfileAdapter } from '@infrastructure/adapter/use-case/profile/edit_profile.adapter';
import { ProfileNotExistsException } from '@core/service/profile/gett_profile.exception';


@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(ProfileDITokens.CreateProfileInteractor)
    private readonly createProfileInteractor: CreateProfileInteractor,
    @Inject(ProfileDITokens.GetProfileInteractor)
    private readonly getProfileInteractor: GetProfileInteractor,
    @Inject(ProfileDITokens.EditProfileInteractor)
    private readonly editProfileInteractor: EditProfileInteractor,
  ) {
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  public async createProfile(@Body(new ValidationPipe()) body: CreateProfileDto) {
    try {
      return await this.createProfileInteractor.execute(CreateProfileAdapter.new({
        resume: body.resume,
        interests: body.interests,
        activities: body.activities,
        knowledge: body.knowledge,
        talents: body.talents,
        userEmail: body.userEmail,
      }));
    } catch (e) {
      if (e instanceof CreateProfileInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  public async getProfile(@Query() queryParams): Promise<ProfileDTO> {
    if (Object.keys(queryParams).length === 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Query data required',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.getProfileInteractor.execute(GetProfileAdapter.new({
        userEmail: queryParams['userEmail'],
      }));
    } catch (e) {
      if (e instanceof GetProfileNotFoundFormatException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Profile asociated to given profile doesn\'t exist',
        }, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  @Put()
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  public async editProfile(@Body(new ValidationPipe()) body: Partial<CreateProfileDto>) {
    if (Object.keys(body).length === 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Request cannot be empty',
      }, HttpStatus.BAD_REQUEST);
    } else if (Object.keys(body).length === 1 && Object.keys(body)[0] === 'userEmail') {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You must provide profile data to edit',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.editProfileInteractor.execute(EditProfileAdapter.new({ ...body }));
    } catch (e) {
      if (e instanceof ProfileNotExistsException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Profile asociated to given user doesn\'t exist',
        }, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }

    }
  }

}