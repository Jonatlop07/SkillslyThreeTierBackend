import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { DeleteProjectInteractor } from '@core/domain/project/use-case/interactor/delete_project.interactor';
import DeleteProjectOutputModel from '@core/domain/project/use-case/output-model/delete_project.output_model';

const feature = loadFeature('test/bdd-functional/features/project/delete_project.feature');

defineFeature(feature, (test) => {
  let project_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_project_interactor: CreateProjectInteractor;
  let delete_project_interactor: DeleteProjectInteractor;
  const user_1_mock: CreateUserAccountInputModel = createUserMock();
  let output: DeleteProjectOutputModel;

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

  function andAProjectIdentifiedByIdExists(and) {
    and(/^there exists a project identified by "(.*)", and that belongs to user "(.*)"$/,
      async (project_id, project_owner_id, post_content_table) => {
        try {
          await create_project_interactor.execute({
            owner_id: project_owner_id,
            title: post_content_table[0].title,
            members: post_content_table[0].members,
            description: post_content_table[0].description,
            reference: post_content_table[0].reference,
            reference_type: post_content_table[0].reference_type,
            annexes: post_content_table[0].annexes
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAProjectIdIsProvided(and) {
    and(/^the user provides the project identified by "(.*)"$/,
      (provided_project_id) => {
        project_id = provided_project_id;
      }
    );
  }

  function whenTheUserTriesToDeleteTheProject(when) {
    when('the user tries to delete their project',
      async () => {
        output = await delete_project_interactor.execute({
          project_id
        });
      }
    );
  }

  function thenTheProjectNoLongerExists(then) {
    then('the project no longer exists', () => {
      expect(output).toBeDefined();
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_project_interactor = module.get<CreateProjectInteractor>(ProjectDITokens.CreateProjectInteractor);
    delete_project_interactor = module.get<DeleteProjectInteractor>(ProjectDITokens.DeleteProjectInteractor);
    output = undefined;
  });

  test('A logged in user tries to delete their project',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAProjectIdentifiedByIdExists(and);
      andAProjectIdIsProvided(and);
      whenTheUserTriesToDeleteTheProject(when);
      thenTheProjectNoLongerExists(then);
    }
  );
});
