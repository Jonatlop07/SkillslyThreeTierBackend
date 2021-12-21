import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import AddMembersToGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/add_members_to_group_conversation.output_model';
import { AddMembersToGroupConversationInteractor } from '@core/domain/chat/use-case/interactor/add_members_to_group_conversation.interactor';
import {
  ChatException,
  NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException, UserDoesNotHavePermissionsInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import { createTestModule } from '../create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

const feature = loadFeature('test/bdd-functional/features/chat/add_members_to_group_conversation.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let conversation_id: string;
  let conversation_members: Array<string> = [];
  let members_to_add: Array<string> = [];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let add_members_to_group_conversation_interactor: AddMembersToGroupConversationInteractor;
  let output: AddMembersToGroupConversationOutputModel;
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

  function andUserProvidesMembersToAddToConversation(and) {
    and(/^the user identified by "([^"]*)" provides the ids of the members to add to the conversation:$/,
      (current_user_id: string, users: Array<{ user_id: string }>) => {
        user_id = current_user_id;
        members_to_add = users.map((user) => user.user_id);
      }
    );
  }

  function whenUserTriesToAddTheMembersToConversation(when) {
    when('the user tries add the members to the conversation', async () => {
      try {
        output = await add_members_to_group_conversation_interactor.execute({
          user_id,
          conversation_id,
          members_to_add
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_chat_conversation_interactor = module.get<CreateGroupChatConversationInteractor>(
      ChatDITokens.CreateGroupChatConversationInteractor
    );
    add_members_to_group_conversation_interactor = module.get<AddMembersToGroupConversationInteractor>(
      ChatDITokens.AddMembersToGroupConversationInteractor
    );
    exception = undefined;
  });

  test('A user successfully adds members to a group conversation',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesMembersToAddToConversation(and);
      whenUserTriesToAddTheMembersToConversation(when);
      then('the following members, identified by these ids, are added:',
        (users: Array<{ user_id: string }>) => {
          expect(output).toBeDefined();
          expect(
            output.added_members
              .map(
                (member_added) =>
                  member_added.user_id
              )
              .sort()
          ).toEqual(users.map(user => user.user_id).sort());
        }
      );
    }
  );
  test('A user that does not belong to a group conversation tries to add members to it',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesMembersToAddToConversation(and);
      whenUserTriesToAddTheMembersToConversation(when);
      then('an error occurs: the user does not belong to the conversation',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(UserDoesNotBelongToConversationChatException);
        }
      );
    }
  );
  test('A user tries to add members to a conversation that does not exist',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      and(/^the user provides the conversation id: "([^"]*)"$/,
        (provided_conversation_id: string) => {
          conversation_id = provided_conversation_id;
        }
      );
      andUserProvidesMembersToAddToConversation(and);
      whenUserTriesToAddTheMembersToConversation(when);
      then('an error occurs: the conversation does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentConversationChatException);
      });
    }
  );
  test('A user tries to add members to a conversation but is not an administrator',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesMembersToAddToConversation(and);
      whenUserTriesToAddTheMembersToConversation(when);
      then('an error occurs: the user is not an administrator of the conversation',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(UserDoesNotHavePermissionsInConversationChatException);
        }
      );
    }
  );
});
