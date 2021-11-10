import { Module, Provider } from '@nestjs/common';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';

import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { ProfileController } from '@application/api/http-rest/controller/profile_controller';
import { ProfileNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/profile/neo4j_profile_respository.adapter';


const persistence_providers: Provider[] = [
  {
    provide: ProfileDITokens.ProfileRepository,
    useClass: ProfileNeo4jRepositoryAdapter
  },
];

const use_case_providers: Provider[] = [
  {
    provide: ProfileDITokens.CreateProfileInteractor,
    useFactory: (gateway) => new CreateProfileService(gateway),
    inject: [ProfileDITokens.ProfileRepository],
  },
];

@Module({
  controllers: [ProfileController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [ProfileDITokens.ProfileRepository],
})

export class ProfileModule {
}