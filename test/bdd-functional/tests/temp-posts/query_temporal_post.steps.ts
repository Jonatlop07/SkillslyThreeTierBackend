import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/create_temporal_post.interactor';
import CreateTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/create_temporal_post.input_model';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/create_temporal_post.output_model';
import { QueryTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post.interactor';
import QueryTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/query_temporal_post.output_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { QueryTemporalPostCollectionInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post_collection.interactor';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import {
  NotFoundTemporalPostException,
  TempPostException,
} from '@core/domain/temp-post/use-case/exception/temp-post.exception';


const feature = loadFeature('./test/bdd-functional/features/temp-posts/query_temporal_post.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let owner_id: string;
  let existing_post_id: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createTemporalPostInteractor: CreateTemporalPostInteractor;
  let queryTemporalPostInteractor: QueryTemporalPostInteractor;
  let queryTemporalPostCollectionInteractor: QueryTemporalPostCollectionInteractor;

  let temporal_post: CreateTemporalPostOutputModel;
  let output: QueryTemporalPostOutputModel;
  let output_collection: Array<TemporalPostDTO>;

  let exception: TempPostException;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
    is_investor: false,
    is_requester: false
  };

  const user_2 = {
    email: 'newuser_1234@test.com',
    password: 'Abc1234_tr',
    name: 'Juana',
    date_of_birth: '02/01/2000',
    is_investor: false,
    is_requester: false
  };


  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await createUserAccountInteractor.execute(input);
      user_id = id;
      return user_id;
    } catch (e) {
      exception = e;
    }
  }

  async function createTemporalPost(input: CreateTemporalPostInputModel) {
    try {
      return await createTemporalPostInteractor.execute(input);
    } catch (e) {
      exception = e;
    }
  }

  function givenAnExistingUser(given) {
    given(/^an existing user$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesIdOfThePostAndIdOfTheOwner(and) {
    and(/^user provides owner user id being "([^"]*)" and temporal post id being "([^"]*)"$/,
      (post_id, post_owner_id) => {
        existing_post_id = post_id;
        owner_id = post_owner_id;
      },
    );
  }

  function andUserIdentifiedByIdExists(and) {
    and(/^there exists a user with id being "([^"]*)"$/,
      async (post_owner_id) => {
        owner_id = post_owner_id;
        try {
          await createUserAccount(user_2);
        } catch (e) {
          exception = e;
        }
      },
    );
  }

  function andTemporalPostIdentifiedByIdExists(and) {
    and(/^there exists a temporal post identified by "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
      async (post_id, post_owner_id, post_content_table) => {
        try {
          temporal_post = await createTemporalPost({
            id: post_id,
            description: post_content_table[0].description,
            reference: post_content_table[0].reference,
            referenceType: post_content_table[0].reference_type,
            user_id: user_id,
          });
        } catch (e) {
          exception = e;
        }
      },
    );
  }

  function andUserProvidesIdOfTheTemportalPostAndIdOfTheOwner(and) {
    and(/^user provides temporal post id being "([^"]*)" and owner user id being "([^"]*)"$/,
      (post_id, post_owner_id) => {
        existing_post_id = post_id;
        owner_id = post_owner_id;
      },
    );
  }

  function andTemporalPostCollectionFromUserIdentifiedByIdExists(and) {
    and(/^there exists a collection of posts that belongs to user with id "([^"]*)"$/,
      async (post_owner_id) => {
        owner_id = post_owner_id;
        const tempPosts: CreateTemporalPostInputModel[] = [
          {
            id: '1',
            description: 'test of a temporal post 1',
            reference: 'https://www.gstatic.com/webp/gallery/2.jpg',
            referenceType: 'jpg',
            user_id: owner_id,
          },
          {
            id: '2',
            description: 'test of a temporal post 2',
            reference: 'https://www.gstatic.com/webp/gallery/3.jpg',
            referenceType: 'jpg',
            user_id: owner_id,
          },
          {
            id: '3',
            description: 'test of a temporal post 3',
            reference: 'https://www.gstatic.com/webp/gallery/4.jpg',
            referenceType: 'jpg',
            user_id: owner_id,
          },
        ];
        for (const tempPost of tempPosts) {
          await createTemporalPost(tempPost);
        }
      },
    );
  }

  function whenUserTriesQueryTemporalPost(when) {
    when('user tries to query temporal post',
      async () => {
        try {
          output = await queryTemporalPostInteractor.execute({
            user_id: owner_id,
            temporal_post_id: existing_post_id,
          });

        } catch (e) {
          exception = e;
        }
      });
  }

  function whenUserTriesQueryCollectionOfTemporalPosts(when) {
    when('user tries to query a collection of temporal posts',
      async () => {
        try {
          output_collection = await queryTemporalPostCollectionInteractor.execute({
            user_id: owner_id,
          });
        } catch (e) {
          exception = e;
        }
      });

  }

  beforeEach(async () => {
    const module = await createTestModule();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor,
    );
    createTemporalPostInteractor = module.get<CreateTemporalPostInteractor>(
      TempPostDITokens.CreateTempPostInteractor,
    );
    queryTemporalPostInteractor = module.get<QueryTemporalPostInteractor>(
      TempPostDITokens.QueryTemporalPostInteractor,
    );
    queryTemporalPostCollectionInteractor = module.get<QueryTemporalPostCollectionInteractor>(
      TempPostDITokens.QueryTemporalPostCollectionInteractor,
    );
    exception = undefined;
    output = undefined;
  });


  test('A logged user tries to query a specific temporal post', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andTemporalPostIdentifiedByIdExists(and);
    andUserProvidesIdOfTheTemportalPostAndIdOfTheOwner(and);
    whenUserTriesQueryTemporalPost(when);
    then('temporal post is returned', () => {
      expect(output).toBeDefined();
      expect(output.temporal_post_id).toEqual(temporal_post.temporal_post_id);
    });
  });

  test('A logged user tries to query a collection of temporal posts', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserIdentifiedByIdExists(and);
    andTemporalPostCollectionFromUserIdentifiedByIdExists(and);
    whenUserTriesQueryCollectionOfTemporalPosts(when);
    then('the collection of temporal posts is returned', () => {
      expect(output_collection).toBeDefined();
      expect(output_collection.length).toEqual(3);
    });
  });

  test('A logged user tries to query a temporal post that does not exist', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserIdentifiedByIdExists(and);
    andUserProvidesIdOfThePostAndIdOfTheOwner(and);
    whenUserTriesQueryTemporalPost(when);
    then('an error occurs: temporal post with provided id does not exist', () => {
      expect(output).toBeUndefined();
      expect(exception).toBeInstanceOf(NotFoundTemporalPostException);
    });
  });

})
;
