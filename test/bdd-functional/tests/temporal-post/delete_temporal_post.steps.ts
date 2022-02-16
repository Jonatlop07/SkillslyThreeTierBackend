import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateTemporalPostInteractor } from '@core/domain/temporal-post/use-case/interactor/create_temporal_post.interactor';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/create_temporal_post.input_model';
import CreateTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/create_temporal_post.output_model';
import { DeleteTemporalPostInteractor } from '@core/domain/temporal-post/use-case/interactor/delete_temporal_post.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { TempPostDITokens } from '@core/domain/temporal-post/di/temp-post_di_tokens';
import {
  NotFoundTemporalPostException,
  TempPostException
} from '@core/domain/temporal-post/use-case/exception/temporal_post.exception';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import DeleteTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/delete_temporal_post.output_model';

const feature = loadFeature('./test/bdd-functional/features/temporal-post/delete_temporal_post.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let created_post_id: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createTemporalPostInteractor: CreateTemporalPostInteractor;
  let deleteTemporalPostInteractor: DeleteTemporalPostInteractor;

  let temporal_post: CreateTemporalPostOutputModel;
  let output: DeleteTemporalPostOutputModel;

  let exception: TempPostException;

  const user_1 = createUserMock();

  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { id } = await createUserAccountInteractor.execute(input);
      owner_id = id;
      return owner_id;
    } catch (e) {
      console.log(e);
    }
  };

  const createTemporalPost = async (input: CreateTemporalPostInputModel) => {
    try {
      return await createTemporalPostInteractor.execute(input);
    } catch (e) {
      exception = e;
    }
  };

  const givenAnExistingUser = (given) => {
    given(/^an existing user$/, async () => {
      await createUserAccount(user_1);
    });
  };

  const andTemporalPostIdentifiedByIdExists = (and) => {
    and(/^there exists a temporal post identified by "([^"]*)", and belongs to that user:$/,
      async (temp_post_id, temp_post_content_table) => {
        created_post_id = temp_post_id;
        try {
          temporal_post = await createTemporalPost({
            description: temp_post_content_table[0].description,
            reference: temp_post_content_table[0].reference,
            referenceType: temp_post_content_table[0].reference_type,
            owner_id
          });
        } catch (e) {
          console.log(e);
          exception = e;
        }
      }
    );
  };

  const andUserProvidesTemporalPostId = (and) => {
    and(/^user provides temporal post id "([^"]*)"$/, (post_id) => {
      created_post_id = post_id;
    });
  };

  const whenUserDeletesTemporalPost = (when) => {
    when(/^user tries to delete the temporal post$/, async () => {
      try {
        output = await deleteTemporalPostInteractor.execute({
          temporal_post_id: created_post_id
        });
      } catch (e) {
        exception = e;
      }
    });
  };

  beforeEach(async () => {
    const module = await createTestModule();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor
    );
    createTemporalPostInteractor = module.get<CreateTemporalPostInteractor>(
      TempPostDITokens.CreateTempPostInteractor
    );
    deleteTemporalPostInteractor = module.get<DeleteTemporalPostInteractor>(
      TempPostDITokens.DeleteTemporalPostInteractor
    );
    created_post_id = undefined;
    temporal_post = undefined;
    output = undefined;
    exception = undefined;
  });
  test('A logged user tries to delete a created temporal post', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andTemporalPostIdentifiedByIdExists(and);
    whenUserDeletesTemporalPost(when);
    then(/^the temporal post is deleted successfully$/, () => {
      expect(output).toBeDefined();
      expect(temporal_post).toEqual(output.deleted_temporal_post);
    });
  });
  test('A logged user tries to delete a temporal post that does not exist', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserProvidesTemporalPostId(and);
    whenUserDeletesTemporalPost(when);
    then(/^an error occurs: temporal post does not exist$/, () => {
      expect(output).toBeUndefined();
      expect(exception).toBeInstanceOf(NotFoundTemporalPostException);
    });
  });
});
