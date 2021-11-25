import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { CreateChatMessageInteractor } from '@core/domain/chat/use-case/interactor/create_chat_message.interactor';
import CreateChatMessageOutputModel from '@core/domain/chat/use-case/output-model/create_chat_message.output_model';
import {
  ChatException,
  EmptyMessageChatException,
  NonExistentConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';

const feature = loadFeature('test/bdd-functional/features/chat/create_chat_message.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let message: string;
  let conversation_id: string;
  let conversation_members: Array<string> = [];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let create_chat_message_interactor: CreateChatMessageInteractor;
  let output: CreateChatMessageOutputModel;
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
          await createUserAccount(user);
        });
      }
    );
  }

  function andAConversationExists(and) {
    and(/^a conversation named "([^"]*)" exists and is identified by "([^"]*)" with the users:$/,
      async (conversation_name: string, provided_conversation_id: string, users: Array<{ user_id: string }>) => {
        conversation_members = [user_id];
        if (users) {
          conversation_members = [...conversation_members, ...users.map((user) => user.user_id)];
        }
        conversation_id = provided_conversation_id;
        try {
          await create_chat_conversation_interactor.execute({
            conversation_name,
            conversation_members
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andMessageContentWithConversationIdIsProvided(and) {
    and(/^the user identified by "([^"]*)" provides the message "([^"]*)" to be attached to the conversation identified by "([^"]*)"$/,
      (_user_id: string, message_content: string, provided_conversation_id: string) => {
        user_id = _user_id;
        message = message_content;
        conversation_id = provided_conversation_id;
      }
    );
  }

  function whenUserTriesToCreateMessage(when) {
    when('the user tries to create the message', async () => {
      try {
        output = await create_chat_message_interactor.execute({
          user_id,
          content: message,
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
    create_chat_conversation_interactor = module.get<CreateGroupChatConversationInteractor>(ChatDITokens.CreateGroupChatConversationInteractor);
    create_chat_message_interactor = module.get<CreateChatMessageInteractor>(ChatDITokens.CreateChatMessageInteractor);
    exception = undefined;
  });

  test('A user creates a message in a conversation',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then('the message is successfully created', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A user tries to create an empty message in a conversation',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then('an error occurs: the message provided by the user is empty', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(EmptyMessageChatException);
      });
    }
  );

  test('A user tries to create a message in a conversation that does not exist',
    ({given, and, when, then}) => {
      givenTheseUsersExists(given);
      andMessageContentWithConversationIdIsProvided(and);
      whenUserTriesToCreateMessage(when);
      then('an error occurs: the conversation does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentConversationChatException);
      });
    }
  );
});
