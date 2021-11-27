import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import {
  ChatException,
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { GetChatMessageCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_message_collection.interactor';
import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';

const feature = loadFeature('test/bdd-functional/features/chat/get_chat_message_collection.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let conversation_id: string;
  let conversation_members: Array<string> = [];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let get_chat_message_collection_interactor: GetChatMessageCollectionInteractor;
  let output: GetChatMessageCollectionOutputModel;
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
        conversation_id = provided_conversation_id;
        if (users) {
          conversation_members = [...users.map((user) => user.user_id)];
        }
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

  function andConversationIdIsProvided(and) {
    and(/^the user identified by "([^"]*)" provides the conversation id: "([^"]*)"$/,
      (_user_id: string, provided_conversation_id: string) => {
        user_id = _user_id;
        conversation_id = provided_conversation_id;
      }
    );
  }

  function whenUserTriesToGetTheMessagesOfTheConversation(when) {
    when('the user tries to get the messages of the conversation', async () => {
      try {
        output = await get_chat_message_collection_interactor.execute({
          user_id,
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
    get_chat_message_collection_interactor = module.get<GetChatMessageCollectionInteractor>(ChatDITokens.GetChatMessageCollectionInteractor);
    exception = undefined;
  });

  test('A user successfully get the messages of a conversation',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andConversationIdIsProvided(and);
      whenUserTriesToGetTheMessagesOfTheConversation(when);
      then('the messages of the conversation are successfully returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A user tries to get the messages of a conversation that does not exist',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andConversationIdIsProvided(and);
      whenUserTriesToGetTheMessagesOfTheConversation(when);
      then('an error occurs: the conversation does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentConversationChatException);
      });
    }
  );
  test('A user tries to get the messages of a conversation where they does not belong',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andConversationIdIsProvided(and);
      whenUserTriesToGetTheMessagesOfTheConversation(when);
      then('an error occurs: the user does not belong to the conversation', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(UserDoesNotBelongToConversationChatException);
      });
    }
  );
});
