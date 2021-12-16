import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupException, UnexistentGroupException } from '@core/domain/group/use-case/exception/group.exception';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import { UpdateGroupUserInteractor } from '@core/domain/group/use-case/interactor/join-request/update_group_user.interactor';
import { QueryGroupUsersInteractor } from '@core/domain/group/use-case/interactor/query_group_users.interactor';
import QueryGroupUsersOutputModel from '@core/domain/group/use-case/output-model/query_group_users.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';

const feature = loadFeature('test/bdd-functional/features/group/query_group_users.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let group_id: string;
  let owner_id: string;
  let group_request_user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let create_join_group_request_interactor: CreateJoinGroupRequestInteractor;
  let accept_deny_remove_user_interactor: UpdateGroupUserInteractor;
  let query_group_users_interactor: QueryGroupUsersInteractor;

  let output: QueryGroupUsersOutputModel;
  let exception: GroupException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      owner_id = id;
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

  function andUserIsPartOfGroup(and) {
    and(/^a user identified by "([^"]*)" is part of the group with id "([^"]*)"$/,
      async (group_user_id, group_id) => {
        try {
          group_request_user_id = group_user_id;
          group_id = group_id;
          await create_join_group_request_interactor.execute({
            user_id: group_request_user_id,
            group_id: group_id
          });
          await accept_deny_remove_user_interactor.execute({
            owner_id: owner_id,
            user_id: group_request_user_id,
            group_id: group_id,
            action: 'accept'
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAGroupIdIsProvided(and) {
    and(/^the user provides the group identified by "([^"]*)"$/,
      (provided_group_id) => {
        group_id = provided_group_id;
      }
    );
  }

  function whenUserTriesToQueryGroupUsers(when) {
    when('the user tries to query the users of the group',
      async () => {
        try {
          output = await query_group_users_interactor.execute({
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
    accept_deny_remove_user_interactor = module.get<UpdateGroupUserInteractor>(GroupDITokens.UpdateGroupUserInteractor);
    query_group_users_interactor = module.get<QueryGroupUsersInteractor>(GroupDITokens.QueryGroupUsersInteractor);
    exception = undefined;
  });

  test('A logged in user tries to query a groups users',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andUserIsPartOfGroup(and);
      andAGroupIdIsProvided(and);
      whenUserTriesToQueryGroupUsers(when);
      then(
        'the users collection is then returned',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A logged in user tries to query a groups users but the group does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdIsProvided(and);
      whenUserTriesToQueryGroupUsers(when);
      then(
        'an error occurs: the group with the provided id does not exist',
        () => {
          expect(exception).toBeInstanceOf(UnexistentGroupException);
        }
      );
    }
  );

});