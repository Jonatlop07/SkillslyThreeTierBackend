import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/create_profile.interactor';
import { CreateProfileAdapter } from '@infrastructure/adapter/use-case/profile/create_profile.adapter';
import { CreateProfileInvalidDataFormatException } from '@core/service/profile/create_profile.exception';

import HttpProfileModel from '@application/api/http-rest/profile/http_profile.model';

@Controller('profiles')
export class ProfileController {
  constructor(
    @Inject(ProfileDITokens.CreateProfileInteractor)
    private readonly createProfileInteractor: CreateProfileInteractor,
  ) {
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  public async createProfile(@Body() body: HttpProfileModel ) {
    console.log(body);
    try {
      return await this.createProfileInteractor.execute(CreateProfileAdapter.new({
        resume: body.resume,
        interests: body.interests,
        activities: body.activities,
        knowledge: body.knowledge,
        talents: body.talents,
        userID: body.userID,
      }));
    } catch (e) {
      if (e instanceof CreateProfileInvalidDataFormatException) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Data provided in an invalid format',
        }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_GATEWAY,
          error: 'Internal error',
        }, HttpStatus.BAD_GATEWAY);
      }
    }
  }


}