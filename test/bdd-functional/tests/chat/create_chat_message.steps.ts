import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';

const feature = loadFeature('test/bdd-functional/features/chat/create_chat_message.feature');

defineFeature(feature, (test) => {
  let message: string;
  let conversation_id: string;
  let conversation_members: Array<string>;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateChatConversationInteractor;
  let create_chat_message_interactor: CreateChatMessageInteractor;
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

  function andAConversationExists(and) {
    and(/^a conversation exists and is identified by "([^"]*)"$/,
      async (provided_conversation_id: string) => {
        conversation_id = provided_conversation_id;
        try {
          await create_chat_conversation_interactor.execute({
            conversation_members
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andMessageContentWithConversationIdIsProvided(and) {
    and(/^the user provides the message "([^"]*)" to be attached to the conversation identified by "([^"]*)"$/,
      (message_content: string, provided_conversation_id: string) => {
        message = message_content;
        conversation_id = provided_conversation_id;
      }
    );
  }

  function whenUserTriesToCreateMessage(when) {
    when('the user tries to create the message', async () => {
      try {
        await create_chat_message_interactor.execute({
          message,
          conversation_id
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
    create_chat_message_interactor = module.get<CreateChatMessageInteractor>(ChatDITokens.CreateChatMessageInteractor);
    exception = undefined;
  });

  test('',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then('the message is successfully created', () => {

      });
    }
  );

  test('',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then('an error occurs: the message provided by the user is empty', () => {

      });
    }
  );

  test('',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then(' an error occurs: the conversation does not exist', () => {

      });
    }
  );
});
