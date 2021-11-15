import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post, Put, Query } from '@nestjs/common';
import { ValidationPipe } from '@application/api/http-rest/profile/pipes/validation.pipe';
import { CreateProfileDto } from '@application/api/http-rest/profile/dtos/http_create_profile.dto';
import { EditProfileAdapter } from '@infrastructure/adapter/use-case/profile/edit_profile.adapter';
import { CreateProfileAdapter } from '@infrastructure/adapter/use-case/profile/create_profile.adapter';
import { GetProfileAdapter } from '@infrastructure/adapter/use-case/profile/get_profile.adapter';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { EditProfileInteractor } from '@core/domain/profile/use-case/interactor/edit_profile.interactor';
import {
  ProfileInvalidDataFormatException,
  ProfileNotFoundException
} from '@core/domain/profile/use-case/exception/profile.exception';


@Controller('users/profile')
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
  public async createProfile(@Body(new ValidationPipe()) body: CreateProfileDto) {
    try {
      return await this.create_profile_interactor.execute(CreateProfileAdapter.new({
        resume: body.resume,
        interests: body.interests,
        activities: body.activities,
        knowledge: body.knowledge,
        talents: body.talents,
        user_email: body.user_email,
      }));
    } catch (e) {
      if (e instanceof ProfileInvalidDataFormatException) {
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
  @HttpCode(HttpStatus.OK)
  public async getProfile(@Query() queryParams): Promise<ProfileDTO> {
    if (Object.keys(queryParams).length === 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Query data required',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.get_profile_interactor.execute(GetProfileAdapter.new({
        user_email: queryParams['user_email'],
      }));
    } catch (e) {
      if (e instanceof ProfileNotFoundException) {
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
  @HttpCode(HttpStatus.ACCEPTED)
  public async editProfile(@Body(new ValidationPipe()) body: Partial<CreateProfileDto>) {
    if (Object.keys(body).length === 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Request cannot be empty',
      }, HttpStatus.BAD_REQUEST);
    } else if (Object.keys(body).length === 1 && Object.keys(body)[0] === 'user_email') {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You must provide profile data to edit',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.edit_profile_interactor.execute(EditProfileAdapter.new({ ...body }));
    } catch (e) {
      if (e instanceof ProfileNotFoundException) {
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
