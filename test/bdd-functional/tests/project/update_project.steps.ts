import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import {
    EmptyProjectContentException,
    NonExistentProjectException, ProjectException
} from "@core/domain/project/use-case/exception/project.exception";
import {CreateProjectInteractor} from "@core/domain/project/use-case/interactor/create_project.interactor";
import {ProjectDITokens} from "@core/domain/project/di/project_di_tokens";
import {UpdateProjectInteractor} from "@core/domain/project/use-case/interactor/update_project.interactor";
import {UpdateProjectOutputModel} from "@core/domain/project/use-case/output-model/update_project.output_model";

const feature = loadFeature(
  'test/bdd-functional/features/project/update_project.feature',
);

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let owner_id: string;
  let project_to_update_id: string;

  let new_title: string;
  let new_members: Array<string>;
  let new_description: string;
  let new_reference: string;
  let new_reference_type: string;
  let new_annex: Array<string>;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_project_interactor: CreateProjectInteractor;
  let update_project_interactor: UpdateProjectInteractor;

  let output: UpdateProjectOutputModel;
  let exception: ProjectException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = owner_id = id;
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
    and(
      /^there exists a project identified by "(.*)", and that belongs to user "(.*)", with content:$/,
      async (project_id, project_owner_id, project_content_table) => {
        try {
          await create_project_interactor.execute({
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

  function andAProjectIdIsProvided(and) {
    and(
      /^the user provides the project identified by "([^"]*)"$/,
      (provided_project_id) => {
          project_to_update_id = provided_project_id;
      },
    );
  }

  function andTheUserProvidesNewContentOfTheProject(and) {
    and(
      'the user provides the new content of the project being:',
      (project_new_content_table) => {
        new_title= project_new_content_table[0].title;
        new_members= project_new_content_table[0].members;
        new_description= project_new_content_table[0].description;
        new_reference= project_new_content_table[0].reference;
        new_reference_type= project_new_content_table[0].reference_type;
        new_annex= project_new_content_table[0].annex;
      },
    );
  }

  function whenTheUserTriesToUpdateTheProject(when) {
    when('the user tries to update the project', async () => {
      try {
        output = await update_project_interactor.execute({
          project_id: project_to_update_id,
          user_id,
          title: new_title,
          members: new_members,
          description: new_description,
          reference: new_reference,
          reference_type: new_reference_type,
          annexes: new_annex,
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  function thenTheProjectIsUpdatedWithTheContentProvided(then) {
    then('the project is updated with the new content provided', () => {
      expect(output).toBeDefined();
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
    update_project_interactor = module.get<UpdateProjectInteractor>(
        ProjectDITokens.UpdateProjectInteractor,
    );
    exception = undefined;
  });

  test('A logged in user tries to update a project with multimedia content and descriptions', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andAProjectIdentifiedByIdExists(and);
    andAProjectIdIsProvided(and);
    andTheUserProvidesNewContentOfTheProject(and);
    whenTheUserTriesToUpdateTheProject(when);
    thenTheProjectIsUpdatedWithTheContentProvided(then);
  });

  test('A logged in user tries to create a project without any content', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andAProjectIdentifiedByIdExists(and);
    andAProjectIdIsProvided(and);
    andTheUserProvidesNewContentOfTheProject(and);
    whenTheUserTriesToUpdateTheProject(when);
    then(
      'an error occurs: the project to create needs to have some kind of content',
      () => {
        expect(exception).toBeInstanceOf(EmptyProjectContentException);
      },
    );
  });

  test('A logged in user tries to update a project with only text', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andAProjectIdentifiedByIdExists(and);
    andAProjectIdIsProvided(and);
    andTheUserProvidesNewContentOfTheProject(and);
    whenTheUserTriesToUpdateTheProject(when);
    thenTheProjectIsUpdatedWithTheContentProvided(then);
  });

  test('A logged in user tries to update a project with only multimedia content', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andAProjectIdentifiedByIdExists(and);
    andAProjectIdIsProvided(and);
    andTheUserProvidesNewContentOfTheProject(and);
    whenTheUserTriesToUpdateTheProject(when);
    thenTheProjectIsUpdatedWithTheContentProvided(then);
  });

  test('A logged in user tries to update a project that does not exist', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andAProjectIdIsProvided(and);
    andTheUserProvidesNewContentOfTheProject(and);
    whenTheUserTriesToUpdateTheProject(when);
    then(
      'an error occurs: the project with the provided id does not exist',
      () => {
        expect(exception).toBeInstanceOf(NonExistentProjectException);
      },
    );
  });
});
