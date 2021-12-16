import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import {
  GroupException,
  UnexistentGroupException,
} from '@core/domain/group/use-case/exception/group.exception';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import CreateGroupInputModel from '@core/domain/group/use-case/input-model/create_group.input_model';
import QueryGroupCollectionOutputModel from '@core/domain/group/use-case/output-model/query_group_collection.output_model';
import QueryGroupOutputModel from '@core/domain/group/use-case/output-model/query_group.output_model';
import { QueryGroupInteractor } from '@core/domain/group/use-case/interactor/query_group.interactor';
import { QueryGroupCollectionInteractor } from '@core/domain/group/use-case/interactor/query_group_collection.interactor';

const feature = loadFeature(
  'test/bdd-functional/features/group/query_groups.feature',
);

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  let search_name = '';
  let search_category = '';
  let user_id = '';
  let group_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let query_group_interactor: QueryGroupInteractor;
  let query_group_collection_interactor: QueryGroupCollectionInteractor;

  let output: QueryGroupOutputModel;
  let output_collection: QueryGroupCollectionOutputModel;
  let exception: GroupException = undefined;

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
        picture: input.picture,
      });
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
    and(
      /^there exists a group identified by "([^"]*)", owned by user with id "([^"]*)", with info being:$/,
      async (existing_group_id, group_owner_id, group_info) => {
        await createGroup({
          owner_id: group_owner_id,
          name: group_info[0].name,
          description: group_info[0].description,
          category: group_info[0].category,
          picture: group_info[0].picture,
        });
      },
    );
  }

  function andSearchParametersAreProvided(and) {
    and(
      /^the user provides the search parameters being "([^"]*)", "([^"]*)" or "([^"]*)"$/,
      (provided_user_id, provided_name, provided_category) => {
        user_id = provided_user_id;
        search_name = provided_name;
        search_category = provided_category;
      },
    );
  }

  function andUserIdAndGroupIdAreProvided(and) {
    and(
      /^the user provides the group identified by "([^"]*)" and the users id being "([^"]*)"$/,
      (provided_user_id, provided_group_id) => {
        user_id = provided_user_id;
        group_id = provided_group_id;
      },
    );
  }

  function andGroupCollectionExists(and) {
    and('there exists a collection of groups', async () => {
      await createGroup({
        owner_id: '2',
        name: 'TechStuff',
        description: 'Any',
        category: 'Arts',
        picture:
          'https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg',
      });
      await createGroup({
        owner_id: '2',
        name: 'Developing',
        description: 'Any',
        category: 'Development',
        picture:
          'https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg',
      });
      await createGroup({
        owner_id: '2',
        name: 'TechStuff',
        description: 'Any',
        category: 'Development',
        picture:
          'https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg',
      });
    });
  }

  function whenUserTriesToQueryGroupCollection(when) {
    when(
      'the user tries to get the collection of groups according to the search',
      async () => {
        try {
          output_collection = await query_group_collection_interactor.execute({
            user_id: user_id,
            name: search_name,
            category: search_category,
          });
        } catch (e) {
          exception = e;
        }
      },
    );
  }

  function whenUserTriesToQueryGroup(when) {
    when('the user tries query the specific group', async () => {
      try {
        output = await query_group_interactor.execute({
          user_id: user_id,
          group_id: group_id,
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor,
    );
    create_group_interactor = module.get<CreateGroupInteractor>(
      GroupDITokens.CreateGroupInteractor,
    );
    query_group_interactor = module.get<QueryGroupInteractor>(
      GroupDITokens.QueryGroupInteractor,
    );
    query_group_collection_interactor = module.get<QueryGroupCollectionInteractor>(
      GroupDITokens.QueryGroupCollectionInteractor,
    );
    exception = undefined;
  });

  test('A logged in user tries to query the groups they belong to', ({ given, and, when, then }) => {
    givenAUserExists(given);
    andSearchParametersAreProvided(and);
    whenUserTriesToQueryGroupCollection(when);
    then('the collection of groups they belong to is then returned', () => {
      expect(output_collection).toBeDefined();
    });
  });

  test('A logged in user tries to query a collection of groups by name', ({ given, and, when, then }) => {
    givenAUserExists(given);
    andGroupCollectionExists(and);
    andSearchParametersAreProvided(and);
    whenUserTriesToQueryGroupCollection(when);
    then('the collection of groups that match the searched name is returned', () => {
      expect(output_collection).toBeDefined();
    });
  });

  test('A logged in user tries to query a collection of groups by category', ({ given, and, when, then }) => {
    givenAUserExists(given);
    andGroupCollectionExists(and);
    andSearchParametersAreProvided(and);
    whenUserTriesToQueryGroupCollection(when);
    then('the collection of groups that match the searched category is returned', () => {
      expect(output_collection).toBeDefined();
    });
  });

  test('A logged in user tries to query a specific group', ({ given, and, when, then }) => {
    givenAUserExists(given);
    andAGroupIdentifiedByIdExists(and);
    andUserIdAndGroupIdAreProvided(and);
    whenUserTriesToQueryGroup(when);
    then('the group is then returned', () => {
      expect(output).toBeDefined();
    });
  });

  test('A logged in user tries to query a group that does not exist', ({ given, and, when, then }) => {
    givenAUserExists(given);
    andUserIdAndGroupIdAreProvided(and);
    whenUserTriesToQueryGroup(when);
    then(
      'an error occurs: the group with the provided id does not exist',
      () => {
        expect(exception).toBeInstanceOf(UnexistentGroupException);
      },
    );
  });
});
