import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { GroupException, InvalidGroupInfoException, UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupInfo } from '@core/domain/group/entity/type/group_info';
import UpdateGroupOutputModel from '@core/domain/group/use-case/output-model/update_group.output_model';
import { UpdateGroupInteractor } from '@core/domain/group/use-case/interactor/update_group.interactor';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/group/update_group.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let group_id: string;
  let group_info: GroupInfo;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let update_group_interactor: UpdateGroupInteractor;

  let output: UpdateGroupOutputModel;
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
    and(/^the user provides the group identified by "([^"]*)"$/,
      (provided_group_id) => {
        group_id = provided_group_id;
      }
    );
  }

  function andUserProvidesNewGroupInfo(and) {
    and('the user provides the new info of the group being:',
      (group_new_info) => {
        group_info = group_new_info;
      }
    );
  }

  function whenUserTriesToUpdateTheGroup(when) {
    when('the user tries to update the group info', async () => {
      try {
        output = await update_group_interactor.execute({
          id: group_id,
          user_id: user_id,
          name: group_info[0].name,
          description: group_info[0].description,
          category: group_info[0].category,
          picture: group_info[0].picture
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
    update_group_interactor = module.get<UpdateGroupInteractor>(GroupDITokens.UpdateGroupInteractor);
    exception = undefined;
  });

  test('A logged in user tries to update a group\'s information',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      andUserProvidesNewGroupInfo(and);
      whenUserTriesToUpdateTheGroup(when);

      then(
        'the group is then updated with the new info provided',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A logged in user tries to update a group\'s information with empty values',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      andUserProvidesNewGroupInfo(and);
      whenUserTriesToUpdateTheGroup(when);

      then(
        'an error occurs: the group information must have at least a name, a description and a category',
        () => {
          expect(exception).toBeInstanceOf(InvalidGroupInfoException);
        }
      );
    }
  );

  test('A logged in user tries to update a group\'s information but is not an owner of the group',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      andUserProvidesNewGroupInfo(and);
      whenUserTriesToUpdateTheGroup(when);

      then(
        'an error occurs: the user has to be an owner to update the group\'s information',
        () => {
          expect(exception).toBeInstanceOf(UnauthorizedGroupEditorException);
        }
      );
    }
  );

});
