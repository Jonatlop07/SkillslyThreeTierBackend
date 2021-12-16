import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_group_chat_conversation.interactor';
import { CreatePrivateChatConversationInteractor } from '@core/domain/chat/use-case/interactor/create_private_chat_conversation.interactor';
import GetChatConversationCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_conversation_collection.output_model';
import { GetChatConversationCollectionInteractor } from '@core/domain/chat/use-case/interactor/get_chat_conversation_collection.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

const feature = loadFeature('test/bdd-functional/features/chat/get_chat_conversation_collection.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let conversation_members: Array<string> = [];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_private_chat_conversation_interactor: CreatePrivateChatConversationInteractor;
  let create_group_chat_conversation_interactor: CreateGroupChatConversationInteractor;
  let get_chat_conversation_collection_interactor: GetChatConversationCollectionInteractor;
  let output: GetChatConversationCollectionOutputModel;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      return await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_private_chat_conversation_interactor = module.get<CreatePrivateChatConversationInteractor>(ChatDITokens.CreatePrivateChatConversationInteractor);
    create_group_chat_conversation_interactor = module.get<CreateGroupChatConversationInteractor>(ChatDITokens.CreateGroupChatConversationInteractor);
    get_chat_conversation_collection_interactor = module.get<GetChatConversationCollectionInteractor>(ChatDITokens.GetChatConversationCollectionInteractor);
  });

  test('A user get their conversations',
    ({ given, and, when, then }) => {
      given(/^these users exists:$/,
        (users: Array<CreateUserAccountInputModel>) => {
          users.forEach(async (user: CreateUserAccountInputModel) => {
            await createUserAccount(user);
          });
        }
      );
      and(/^the user that tries to get their conversations is identified by "([^"]*)"$/,
        (_user_id: string) => {
          user_id = _user_id;
        }
      );
      and(/^private conversations with these users exist:$/,
        (users: Array<{ user_id: string }>) => {
          if (users) {
            users.forEach(async (user) => {
              try {
                await create_private_chat_conversation_interactor.execute({
                  user_id,
                  partner_id: user.user_id
                });
              } catch (e) {
                console.log(e);
              }
            });
          }
        }
      );
      and(/^the group conversation exists with name "([^"]*)" and among the users:$/,
        async (conversation_name: string, users: Array<{ user_id: string }>) => {
          try {
            if (users) {
              conversation_members = [...users.map((user) => user.user_id)];
            } else {
              conversation_members = [];
            }
            await create_group_chat_conversation_interactor.execute({
              conversation_members,
              conversation_name
            });
          } catch (e) {
            console.log(e);
          }
        }
      );
      when('the user tries to get all their conversations', async () => {
        try {
          output = await get_chat_conversation_collection_interactor.execute({
            user_id
          });
        } catch (e) {

        }
      });
      then('the conversations are successfully returned', () => {
        expect(output).toBeDefined();
        expect(output.conversations).toBeDefined();
      });
    }
  );
});
