import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupException, JoinGroupRequestAlreadyExistsException } from '@core/domain/group/use-case/exception/group.exception';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import CreateJoinGroupRequestOutputModel from '@core/domain/group/use-case/output-model/join-request/create_join_group_request.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/group/join_request/create_group_join_request.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let group_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let create_join_group_request_interactor: CreateJoinGroupRequestInteractor;

  let output: CreateJoinGroupRequestOutputModel;
  let exception: GroupException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
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

  function andAGroupIdIsProvided(and) {
    and(/^the user provides the group id being "([^"]*)"$/,
      (provided_group_id) => {
        group_id = provided_group_id;
      }
    );
  }

  function andJoinGroupRequestExists(and) {
    and('there already exists a join request to the group from the user',
      async () => {
        try {
          await create_join_group_request_interactor.execute({
            user_id: user_id,
            group_id: group_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }


  function whenUserRequestsToJoinGroup(when) {
    when('the user requests to join the group', async () => {
      try {
        output = await create_join_group_request_interactor.execute({
          group_id: group_id,
          user_id: user_id
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
    exception = undefined;
  });

  test('A logged in user requests to join a group',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      whenUserRequestsToJoinGroup(when);
      then(
        'the join request is then created',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A logged in user requests to join a group but they have already requested to join',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      andJoinGroupRequestExists(and);
      whenUserRequestsToJoinGroup(when);

      then(
        'an error occurs: a join request to the group already exists or the user already belongs to the group',
        () => {
          expect(exception).toBeInstanceOf(JoinGroupRequestAlreadyExistsException);
        }
      );
    }
  );
});
