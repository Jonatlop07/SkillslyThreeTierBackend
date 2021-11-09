import { Module, Provider } from '@nestjs/common';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileInMemoryRepository } from '@infrastructure/persistence/profile_in_memory.repository';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { ProfileController } from '@application/api/http-rest/controller/profile_controller';


const persistence_providers: Provider[] = [
  {
    provide: ProfileDITokens.ProfileRepository,
    useFactory: () => new ProfileInMemoryRepository(new Map()),
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