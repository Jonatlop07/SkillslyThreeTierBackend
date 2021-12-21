import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import {
  ChatException,
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { ExitChatGroupConversationInteractor } from '@core/domain/chat/use-case/interactor/exit_chat_group_conversation.interactor';
import ExitChatGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/exit_chat_group_conversation.output_model';
import ExitChatGroupConversationInputModel
  from '@core/domain/chat/use-case/input-model/exit_chat_group_conversation.input_model';

const feature = loadFeature('test/bdd-functional/features/chat/exit_chat_group_conversation.feature');

defineFeature(feature, (test) => {
  let conversation_members: Array<string> = [];
  const exit_group_conversation_input: ExitChatGroupConversationInputModel = {
    user_id: '',
    conversation_id: ''
  };
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let exit_chat_group_conversation_interactor: ExitChatGroupConversationInteractor;
  let output: ExitChatGroupConversationOutputModel;
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
        exit_group_conversation_input.conversation_id = provided_conversation_id;
        if (users) {
          conversation_members = [...users.map((user) => user.user_id)];
        }
        try {
          await create_chat_conversation_interactor.execute({
            creator_id: conversation_members[0],
            conversation_name,
            conversation_members
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenUserTriesToExitGroupConversation(when) {
    when(/^the user identified by "([^"]*)" tries to exit the conversation$/,
      async (user_id: string) => {
        try {
          exit_group_conversation_input.user_id = user_id;
          output = await exit_chat_group_conversation_interactor.execute(exit_group_conversation_input);
        } catch (e) {
          exception = e;
        }
      }
    );
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_chat_conversation_interactor = module.get<CreateGroupChatConversationInteractor>(
      ChatDITokens.CreateGroupChatConversationInteractor
    );
    exit_chat_group_conversation_interactor = module.get<ExitChatGroupConversationInteractor>(
      ChatDITokens.ExitChatGroupConversationInteractor
    );
    exception = undefined;
  });

  test('A user successfully exits a group conversation',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      whenUserTriesToExitGroupConversation(when);
      then('the user successfully exits the conversation',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );
  test('A user that does not belong to a group conversation tries to exit to it',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      whenUserTriesToExitGroupConversation(when);
      then('an error occurs: the user does not belong to the group conversation',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(UserDoesNotBelongToConversationChatException);
        }
      );
    }
  );
  test('A user tries to exit a group conversation that does not exist',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      and(/^the user provides the conversation id: "([^"]*)"$/,
        (provided_conversation_id: string) => {
          exit_group_conversation_input.conversation_id = provided_conversation_id;
        }
      );
      whenUserTriesToExitGroupConversation(when);
      then('an error occurs: the group conversation does not exist',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(NonExistentConversationChatException);
        }
      );
    }
  );
});
