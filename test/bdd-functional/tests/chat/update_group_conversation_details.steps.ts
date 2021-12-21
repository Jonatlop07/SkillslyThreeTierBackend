import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import {
  ChatException, InvalidGroupConversationDetailsFormatChatException, NonExistentConversationChatException,
  UserDoesNotBelongToConversationChatException, UserDoesNotHavePermissionsInConversationChatException
} from '@core/domain/chat/use-case/exception/chat.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import UpdateGroupConversationDetailsInputModel
  from '@core/domain/chat/use-case/input-model/update_group_conversation_details.input_model';
import { UpdateGroupConversationDetailsInteractor } from '@core/domain/chat/use-case/interactor/update_group_conversation_details.interactor';
import UpdateGroupConversationDetailsOutputModel
  from '@core/domain/chat/use-case/output-model/update_group_conversation_details.output_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

const feature = loadFeature('test/bdd-functional/features/chat/update_group_conversation_details.feature');

defineFeature(feature, (test) => {
  let conversation_members: Array<string> = [];
  const edited_conversation_details: UpdateGroupConversationDetailsInputModel = {
    user_id: '',
    conversation_id: '',
    conversation_name: ''
  };
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let update_group_conversation_details_interactor: UpdateGroupConversationDetailsInteractor;
  let output: UpdateGroupConversationDetailsOutputModel;
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
        edited_conversation_details.conversation_id = provided_conversation_id;
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

  function andUserProvidesEditedConversationDetails(and) {
    and(/^the user identified by "([^"]*)" provides the edited details of the conversation: "([^"]*)"$/,
      (current_user_id: string, conversation_new_name: string) => {
        edited_conversation_details.user_id = current_user_id;
        edited_conversation_details.conversation_name = conversation_new_name;
      }
    );
  }

  function whenUserTriesToUpdateGroupConversationDetails(when) {
    when('the user tries to update the details of the conversation', async () => {
      try {
        output = await update_group_conversation_details_interactor
          .execute(edited_conversation_details);
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
    update_group_conversation_details_interactor = module.get<UpdateGroupConversationDetailsInteractor>(
      ChatDITokens.UpdateGroupConversationDetailsInteractor
    );
    exception = undefined;
  });

  test('A user successfully updates the details of a group conversation',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesEditedConversationDetails(and);
      whenUserTriesToUpdateGroupConversationDetails(when);
      then('the details of the conversation are successfully updated',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );
  test('A user tries to update the details of a group conversation but they are in an invalid format',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesEditedConversationDetails(and);
      whenUserTriesToUpdateGroupConversationDetails(when);
      then('an error occurs: the edited details of the conversation are in an invalid format',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(InvalidGroupConversationDetailsFormatChatException);
        }
      );
    }
  );
  test('A user that does not belong to a group conversation tries to update its details',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesEditedConversationDetails(and);
      whenUserTriesToUpdateGroupConversationDetails(when);
      then('an error occurs: the user does not belong to the group conversation',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(UserDoesNotBelongToConversationChatException);
        }
      );
    }
  );
  test('A user tries to update the details of a group conversation that does not exist',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      and(/^the user provides the conversation id: "([^"]*)"$/,
        (provided_conversation_id: string) => {
          edited_conversation_details.conversation_id = provided_conversation_id;
        }
      );
      andUserProvidesEditedConversationDetails(and);
      whenUserTriesToUpdateGroupConversationDetails(when);
      then('an error occurs: the group conversation does not exist',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(NonExistentConversationChatException);
        }
      );
    }
  );
  test('A user that is not an administrator of a group conversation tries to update its details',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAConversationExists(and);
      andUserProvidesEditedConversationDetails(and);
      whenUserTriesToUpdateGroupConversationDetails(when);
      then('an error occurs: the user is not an administrator of the conversation',
        () => {
          expect(exception).toBeDefined();
          expect(exception).toBeInstanceOf(UserDoesNotHavePermissionsInConversationChatException);
        }
      );
    }
  );
});
