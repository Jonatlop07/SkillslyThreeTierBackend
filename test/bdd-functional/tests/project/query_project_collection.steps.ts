import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import {
  ProjectException,
  NonExistentUserException
} from '@core/domain/project/use-case/exception/project.exception';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';
import CreateProjectOutputModel from '@core/domain/project/use-case/output-model/create_project.output_model';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import {
  QueryProjectCollectionInteractor
} from '@core/domain/project/use-case/interactor/query_project_collection.interactor';
import QueryProjectOutputModel from '@core/domain/project/use-case/output-model/query_project_collection.output_model';

const feature = loadFeature(
  'test/bdd-functional/features/project/query_project_collection.feature'
);

defineFeature(feature, (test) => {
  let owner_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_project_interactor: CreateProjectInteractor;
  let query_project_collection_interactor: QueryProjectCollectionInteractor;
  let created_project_output: CreateProjectOutputModel;
  let output: QueryProjectOutputModel;
  let exception: ProjectException;

  const user_1 = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
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
      await createUserAccount(user_1);
    });
  }

  function andProjectIdentifiedByIdExists(and) {
    and(
      /^there exists a project identified by "([^"]*)" and that belongs to user "([^"]*)", with content:$/,
      async (project_id, project_owner_id, project_content_table) => {
        try {
          created_project_output = await createProject({
            owner_id: project_owner_id,
            title: project_content_table[0].title,
            members: project_content_table[0].members,
            description: project_content_table[0].description,
            reference: project_content_table[0].reference,
            reference_type: project_content_table[0].reference_type,
            annexes: project_content_table[0].annexes
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andUserProvidesIdOfTheProjectAndIdOfTheOwner(and) {
    and(
      /^the user provides the id of the id of the owner user being "([^"]*)"$/,
      (project_owner_id) => {
        owner_id = project_owner_id;
      }
    );
  }

  function whenUserTriesQueryAProject(when) {
    when('the user tries to query the projects', async () => {
      try {
        output = await query_project_collection_interactor.execute({
          owner_id
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor
    );
    create_project_interactor = module.get<CreateProjectInteractor>(
      ProjectDITokens.CreateProjectInteractor
    );
    query_project_collection_interactor = module.get<QueryProjectCollectionInteractor>(
      ProjectDITokens.QueryProjectCollectionInteractor
    );
    exception = undefined;
  });

  test('A logged in user tries to query the projects of a user',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andProjectIdentifiedByIdExists(and);
      andUserProvidesIdOfTheProjectAndIdOfTheOwner(and);
      whenUserTriesQueryAProject(when);
      then('the projects are then returned', () => {
        const { created_project } = created_project_output;
        const expected_output: QueryProjectOutputModel = {
          projects: [
            {
              owner_id: created_project.owner_id,
              project_id: created_project.project_id,
              title: created_project.title,
              members: created_project.members,
              description: created_project.description,
              reference: created_project.reference,
              reference_type: created_project.reference_type,
              annexes: created_project.annexes
            }
          ]
        };

        expect(output).toBeDefined();
        expect(output).toEqual(expected_output);
      });
    });

  test('A logged in user tries to query a project from a user that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesIdOfTheProjectAndIdOfTheOwner(and);
      whenUserTriesQueryAProject(when);

      then(
        'an error occurs: the user with the provided id does not exist',
        () => {
          expect(exception).toBeInstanceOf(NonExistentUserException);
        }
      );
    });
});
