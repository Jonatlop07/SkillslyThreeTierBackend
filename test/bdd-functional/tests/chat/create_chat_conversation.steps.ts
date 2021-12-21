import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import {
  CreateGroupChatConversationInteractor
} from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import {
  ChatException,
  NoMembersInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { CreatePrivateChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_private_chat_conversation.interactor';
import CreatePrivateChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_private_chat_conversation.output_model';
import CreateGroupChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_group_chat_conversation.output_model';
import CreateGroupChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_group_chat_conversation.input_model';

const feature = loadFeature('test/bdd-functional/features/chat/create_chat_conversation.feature');

defineFeature(feature, (test) => {
  const conversation_setup: CreateGroupChatConversationInputModel = {
    creator_id: null,
    conversation_name: null,
    conversation_members: []
  };
  let user_id: string;
  let other_user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_private_chat_conversation_interactor: CreatePrivateChatConversationInteractor;
  let create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let create_private_chat_conversation_output: CreatePrivateChatConversationOutputModel;
  let create_group_chat_conversation_output: CreateGroupChatConversationOutputModel;
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

  function andUserWantsToInitiateConversationWithOtherUser(and) {
    and(/^the user identified by "([^"]*)" wants to initiate a conversation with user "([^"]*)"$/,
      (provided_user_id: string, provided_other_user_id: string) => {
        user_id = provided_user_id;
        other_user_id = provided_other_user_id;
      }
    );
  }

  function andUserWantsToInitiateConversationWithUsers(and) {
    and(/^the user identified by "([^"]*)" wants to initiate a conversation named "([^"]*)" with the users:$/,
      (user_id: string, name: string, users: Array<{ user_id: string }>) => {
        conversation_setup.creator_id = user_id;
        if (users) {
          conversation_setup.conversation_members = [...users.map((user) => user.user_id)];
        } else {
          conversation_setup.conversation_members = [];
        }
        conversation_setup.conversation_name = name;
      }
    );
  }

  function whenUserTriesToCreateAPrivateConversation(when) {
    when('the user tries to create a private conversation', async () => {
      try {
        create_private_chat_conversation_output = await create_private_chat_conversation_interactor.execute({
          user_id,
          partner_id: other_user_id
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  function whenUserTriesToCreateAGroupConversation(when) {
    when('the user tries to create a group conversation', async () => {
      try {
        create_group_chat_conversation_output = await create_group_chat_conversation_interactor.execute(conversation_setup);
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_private_chat_conversation_interactor = module.get<CreatePrivateChatConversationInteractor>(ChatDITokens.CreatePrivateChatConversationInteractor);
    create_group_chat_conversation_interactor = module.get<CreateGroupChatConversationInteractor>(ChatDITokens.CreateGroupChatConversationInteractor);
    exception = undefined;
  });

  test('A user tries to create a conversation with other user',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserWantsToInitiateConversationWithOtherUser(and);
      whenUserTriesToCreateAPrivateConversation(when);
      then('the conversation with the other user is created successfully',
        () => {
          expect(create_private_chat_conversation_output).toBeDefined();
        }
      );
    }
  );
  test('A user tries to create a conversation with multiple users',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserWantsToInitiateConversationWithUsers(and);
      whenUserTriesToCreateAGroupConversation(when);
      then('the group conversation is created successfully',
        () => {
          expect(create_group_chat_conversation_output).toBeDefined();
        }
      );
    }
  );
  test('A user tries to create a conversation but does not indicate other users',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserWantsToInitiateConversationWithUsers(and);
      whenUserTriesToCreateAGroupConversation(when);
      then('an error occurs: the user did not indicate other participants in the conversation', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NoMembersInConversationChatException);
      });
    }
  );
});
