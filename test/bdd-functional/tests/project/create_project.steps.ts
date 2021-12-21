import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import {
  EmptyProjectContentException,
  ProjectException,
} from '@core/domain/project/use-case/exception/project.exception';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';
import CreateProjectOutputModel from '@core/domain/project/use-case/output-model/create_project.output_model';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

const feature = loadFeature(
  'test/bdd-functional/features/project/create_project.feature',
);

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_project_interactor: CreateProjectInteractor;

  let input: CreateProjectInputModel;

  let output: CreateProjectOutputModel;
  let exception: ProjectException;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
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
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesTheContentOfTheProject(and) {
    and(
      /^the user identified by "(.*)", provides the content of the proyect being:$/,
      (owner_user_id, project_content_table) => {
        input = {
          user_id: owner_user_id,
          title: project_content_table[0].title,
          members: project_content_table[0].members,
          description: project_content_table[0].description,
          reference: project_content_table[0].reference,
          reference_type: project_content_table[0].reference_type,
          annexes: project_content_table[0].annexes,
        };
      },
    );
  }

  function whenUserTriesToCreateNewProject(when) {
    when('the user tries to create a new project', async () => {
      output = await createProject(input);
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
    exception = undefined;
  });

  test('A logged in user creates a project successfully', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfTheProject(and);
    whenUserTriesToCreateNewProject(when);

    then('a project is then created with the content provided', () => {
      expect(output).toBeDefined();
    });
  });

  test('A logged in user tries to create a project without any content', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfTheProject(and);
    whenUserTriesToCreateNewProject(when);

    then(
      'an error occurs: the project to create needs to have some kind of content',
      () => {
        expect(exception).toBeInstanceOf(EmptyProjectContentException);
      },
    );
  });
});
