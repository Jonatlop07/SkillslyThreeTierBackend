import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { GroupException, UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { DeleteGroupInteractor } from '@core/domain/group/use-case/interactor/delete_group.interactor';
import DeleteGroupOutputModel from '@core/domain/group/use-case/output-model/delete_group.output_model';

const feature = loadFeature('test/bdd-functional/features/group/delete_group.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string;
  let group_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let delete_group_interactor: DeleteGroupInteractor;

  let output: DeleteGroupOutputModel;
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
        const { name, description, category, picture } = group_info[0];
        try {
          await create_group_interactor.execute({
            owner_id: group_owner_id,
            name: name,
            description: description,
            category: category,
            picture: picture
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

  function whenUserTriesToDeleteTheGroup(when) {
    when('the user tries to delete the group', async () => {
      try {
        output = await delete_group_interactor.execute({
          id: group_id,
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
    delete_group_interactor = module.get<DeleteGroupInteractor>(GroupDITokens.DeleteGroupInteractor);
    exception = undefined;
  });

  test('A logged in user tries to delete a group they own',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      whenUserTriesToDeleteTheGroup(when);
      then(
        'the group is then deleted and returned to the user',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A logged in user tries to delete a group they don\'t own',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      whenUserTriesToDeleteTheGroup(when);

      then(
        'an error occurs: only the owners can delete the group',
        () => {
          expect(exception).toBeInstanceOf(UnauthorizedGroupEditorException);
        }
      );
    }
  );

});