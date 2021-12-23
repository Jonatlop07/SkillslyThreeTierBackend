import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { GroupException, InvalidGroupInfoException } from '@core/domain/group/use-case/exception/group.exception';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import CreateGroupOutputModel from '@core/domain/group/use-case/output-model/create_group.output_model';
import CreateGroupInputModel from '@core/domain/group/use-case/input-model/create_group.input_model';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';

const feature = loadFeature('test/bdd-functional/features/group/create_group.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let name, description, category, picture: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let output: CreateGroupOutputModel;
  let exception: GroupException = undefined;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
    is_investor: false,
    is_requester: false
  };

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createGroup(input: CreateGroupInputModel) {
    try {
      return await create_group_interactor.execute({
        owner_id: input.owner_id,
        name: input.name,
        description: input.description,
        category: input.category,
        picture: input.picture
      });
    } catch (e){
      exception = e;
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesGroupInfo(and) {
    and(
      /^the user provides the information of the group being: "([^"]*)", "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (group_name, group_description, group_category, group_picture) => {
        name = group_name;
        description = group_description;
        category = group_category;
        picture = group_picture;
      }
    );
  }

  function whenUserTriesToCreateNewGroup(when) {
    when('the user tries to create a new group',
      async () => {
        output = await createGroup({
          owner_id: user_id,
          name,
          description,
          category,
          picture,
        });
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor
    );
    create_group_interactor = module.get<CreateGroupInteractor>(
      GroupDITokens.CreateGroupInteractor
    );
    exception = undefined;
  });

  test('A logged in user creates a group successfully',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesGroupInfo(and);
      whenUserTriesToCreateNewGroup(when);

      then(
        'a group is then created with the information provided',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A logged in user tries to create a group with information in an invalid format',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesGroupInfo(and);
      whenUserTriesToCreateNewGroup(when);

      then(
        'an error occurs: the group must have at least a name, a description and a category',
        () => {
          expect(exception).toBeInstanceOf(InvalidGroupInfoException);
        }
      );
    }
  );


});
