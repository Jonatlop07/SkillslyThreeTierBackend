import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import {
  ProjectException,
  NonExistentProjectException,
  NonExistentUserException,
} from '@core/domain/project/use-case/exception/project.exception';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';
import CreateProjectOutputModel from '@core/domain/project/use-case/output-model/create_project.output_model';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import { QueryProjectInteractor } from '@core/domain/project/use-case/interactor/query_project.interactor';
import QueryProjectOutputModel from '@core/domain/project/use-case/output-model/query_project.output_model';

const feature = loadFeature(
  'test/bdd-functional/features/project/query_project.feature',
);

defineFeature(feature, (test) => {
  let user_id: string;
  let project_id: string;
  let owner_id: string;
  let existing_project_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_project_interactor: CreateProjectInteractor;
  let query_project_interactor: QueryProjectInteractor;
  let created_project: CreateProjectOutputModel;
  let output: QueryProjectOutputModel;
  let exception: ProjectException;


  const user_1 = createUserMock();

  const user_2 = {
    email: 'newuser_1234@test.com',
    password: 'Abc1234_tr',
    name: 'Juana',
    date_of_birth: '02/01/2000',
    is_investor: false,
    is_requester: false,
  };

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const {id} = await create_user_account_interactor.execute(input);
      return id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createProject(input: CreateProjectInputModel) {
    try {
      return await create_project_interactor.execute(input);
    } catch (e) {
      exception = e;
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      user_id = await createUserAccount(user_1);
    });
  }

  function andProjectIdentifiedByIdExists(and) {
    and(
      /^there exists a project identified by "([^"]*)" and that belongs to user "([^"]*)", with content:$/,
      async (project_id, project_owner_id, project_content_table) => {
        try {
          created_project = await createProject({
            user_id: project_owner_id,
            id: project_id,
            title: project_content_table[0].title,
            members: project_content_table[0].members,
            description: project_content_table[0].description,
            reference: project_content_table[0].reference,
            reference_type: project_content_table[0].reference_type,
            annexes: project_content_table[0].annexes,
          });
        } catch (e) {
          console.log(e);
        }
      },
    );
  }

  function andUserProvidesIdOfTheProjectAndIdOfTheOwner(and) {
    and(
      /^the user provides the id of the id of the owner user being "([^"]*)"$/,
      (project_owner_id) => {
        owner_id = project_owner_id;
      },
    );
  }
  function andUserIdentifiedByIdExists(and) {
    and(
      /^there exists a user with id being "([^"]*)"$/,
      async (project_owner_id) => {
        owner_id = project_owner_id;
        try {
          await createUserAccount(user_2);
        } catch (e) {
          console.log(e);
        }
      },
    );
  }

  function whenUserTriesQueryAProject(when) {
    when('the user tries to query the project', async () => {
      try {
        output = await query_project_interactor.execute({
          user_id: owner_id,
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
    create_project_interactor = module.get<CreateProjectInteractor>(
        ProjectDITokens.CreateProjectInteractor,
    );
    query_project_interactor = module.get<QueryProjectInteractor>(
        ProjectDITokens.QueryProjectInteractor,
    );
    exception = undefined;
  });

  test('A logged in user tries to query a project', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andProjectIdentifiedByIdExists(and);
    andUserProvidesIdOfTheProjectAndIdOfTheOwner(and);
    whenUserTriesQueryAProject(when);
    then('the projects is then returned', () => {
      const expected_output: QueryProjectOutputModel = {
        projects: [
          {
            user_id: created_project.user_id,
            project_id: created_project.project_id,
            title: created_project.title,
            members: created_project.members,
            description: created_project.description,
            reference: created_project.reference,
            reference_type: created_project.reference_type,
            annexes: created_project.annexes,
          }
        ],
      };

      expect(output).toBeDefined();
      expect(output).toEqual(expected_output);
    });
  });

  test('A logged in user tries to query a project from a user that does not exist', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesIdOfTheProjectAndIdOfTheOwner(and);
    whenUserTriesQueryAProject(when);

    then(
      'an error occurs: the user with the provided id does not exist',
      () => {
        expect(exception).toBeInstanceOf(NonExistentUserException);
      },
    );
  });
});
