import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupException } from '@core/domain/group/use-case/exception/group.exception';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import { GetJoinRequestsInteractor } from '@core/domain/group/use-case/interactor/join-request/get_join_requests.interactor';
import GetJoinRequestsOutputModel from '@core/domain/group/use-case/output-model/join-request/get_join_requests.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';

const feature = loadFeature('test/bdd-functional/features/group/join_request/get_join_group_requests.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
    is_investor: false,
    is_requester: false
  };

  let group_id: string;
  let group_request_user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let create_join_group_request_interactor: CreateJoinGroupRequestInteractor;
  let get_join_requests_interactor: GetJoinRequestsInteractor;

  let output: GetJoinRequestsOutputModel;
  let exception: GroupException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given('a user exists', async () => {
      await createUserAccount(user_1_mock);
    });
  }


  function andAGroupIdentifiedByIdExists(and) {
    and(/^there exists a group identified by "([^"]*)", owned by user with id "([^"]*)", with info being:$/,
      async (existing_group_id, group_owner_id, group_info) => {
        try {
          group_id = existing_group_id;
          await create_group_interactor.execute({
            owner_id: group_owner_id,
            name: group_info[0].name,
            description: group_info[0].description,
            category: group_info[0].category,
            picture: group_info[0].picture
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andJoinGroupRequestExists(and) {
    and(/^there exists a join request to the group with id "([^"]*)" from the user identified by "([^"]*)"$/,
      async (existing_request_group_id, existing_request_user_id) => {
        try {
          group_request_user_id = existing_request_user_id;
          await create_join_group_request_interactor.execute({
            user_id: group_request_user_id,
            group_id: existing_request_group_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenUserTriesToGetJoinRequests(when) {
    when('the user tries to get the join requests to the group',
      async () => {
        try {
          output = await get_join_requests_interactor.execute({
            group_id: group_id
          });
        } catch (e) {
          exception = e;
        }
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_group_interactor = module.get<CreateGroupInteractor>(GroupDITokens.CreateGroupInteractor);
    create_join_group_request_interactor = module.get<CreateJoinGroupRequestInteractor>(GroupDITokens.CreateJoinGroupRequestInteractor);
    get_join_requests_interactor = module.get<GetJoinRequestsInteractor>(GroupDITokens.GetJoinRequestsInteractor);
    exception = undefined;
  });

  test('A user gets the collection of join requests to a group',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andJoinGroupRequestExists(and);
      whenUserTriesToGetJoinRequests(when);
      then(
        'the collection of join requests is returned',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

});
