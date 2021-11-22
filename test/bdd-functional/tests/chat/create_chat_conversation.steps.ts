import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

const feature = loadFeature('test/bdd-functional/features/chat/create_chat_conversation.feature');

defineFeature(feature, (test) => {
  let conversation_members: Array<string>;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateChatConversationInteractor;
  let output: CreateChatConversationOutputModel;
  let exception: ChatException;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      return await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenTheseUsersExists(given) {
    given(/^these users exists:$/,
      (users: Array<CreateUserAccountInputModel>) => {
        users.forEach(async (user: CreateUserAccountInputModel) => {
          const { id } = await createUserAccount(user);
          conversation_members.push(id);
        });
      }
    );
  }

  function andUserWantsToInitiateConversationWithUsers(and) {
    and(/^the user identified by "([^"]*)" wants to initiate a conversation with users:$/,
      (user_id: string, users: Array<string>) => {
        conversation_members = [
          user_id,
          ...users
        ];
      }
    );
  }

  function whenUserTriesToCreateConversation(when) {
    when('the user tries to create a conversation', async () => {
      try {
        output = await create_chat_conversation_interactor.execute({
          conversation_members
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_chat_conversation_interactor = module.get<CreateChatConversationInteractor>(ChatDITokens.CreateChatConversationInteractor);
    exception = undefined;
  });


  test('A user tries to create a conversation with other user',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      whenUserTriesToCreateConversation(when);
      then(/^$/, () => {

      });
    }
  );
  test('A user tries to create a conversation with multiple users',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserWantsToInitiateConversationWithUsers(and);
      whenUserTriesToCreateConversation(when);
      then(/^$/, () => {

      });
    }
  );
  test('A user tries to create a conversation but does not indicate other users',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserWantsToInitiateConversationWithUsers(and);
      whenUserTriesToCreateConversation(when);
      then(/^$/, () => {

      });
    }
  );
});
