import { Module, Provider } from '@nestjs/common';
import { ProfileController } from '@application/api/http-rest/controller/profile.controller';
import { ProfileNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/profile/neo4j_profile_repository.adapter';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { GetProfileService } from '@core/service/profile/get_profile.service';
import { EditProfileService } from '@core/service/profile/edit_profile.service';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';

const persistence_providers: Array<Provider> = [
  {
    provide: ProfileDITokens.ProfileRepository,
    useClass: ProfileNeo4jRepositoryAdapter,
  },
];

const use_case_providers: Array<Provider> = [
  {
    provide: ProfileDITokens.CreateProfileInteractor,
    useFactory: (gateway) => new CreateProfileService(gateway),
    inject: [ProfileDITokens.ProfileRepository],
  },
  {
    provide: ProfileDITokens.GetProfileInteractor,
    useFactory: (gateway) => new GetProfileService(gateway),
    inject: [ProfileDITokens.ProfileRepository],
  },
  {
    provide: ProfileDITokens.EditProfileInteractor,
    useFactory: (gateway, get_profile_interactor) => new EditProfileService(gateway, get_profile_interactor),
    inject: [ProfileDITokens.ProfileRepository, ProfileDITokens.GetProfileInteractor],
  },
];

@Module({
  controllers: [ProfileController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [
    ProfileDITokens.ProfileRepository
  ],
})

export class ProfileModule {}
