import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import GetEventCollectionOfFriendsInputModel from "@core/domain/event/use-case/input-model/get_event_collection_of_friends.input_model";
import { GetEventCollectionOfFriendsInteractor } from "@core/domain/event/use-case/interactor/get_event_collection_of_friends.interactor";
import GetEventCollectionOfFriendsOutputModel from "@core/domain/event/use-case/output-model/get_event_collection_of_friends.output_model";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import CreateUserAccountInputModel from "@core/domain/user/use-case/input-model/create_user_account.input_model";
import { CreateUserAccountInteractor } from "@core/domain/user/use-case/interactor/create_user_account.interactor";
import { defineFeature, loadFeature } from "jest-cucumber";
import { createTestModule } from "../create_test_module";

const feature = loadFeature('test/bdd-functional/features/event/get_event_collection_of_friends.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string; 
  let create_user_account_interactor: CreateUserAccountInteractor;
  let get_event_collection_of_friends_interactor: GetEventCollectionOfFriendsInteractor;
  let output: GetEventCollectionOfFriendsOutputModel;

  async function getEventCollectionOfFriends(input: GetEventCollectionOfFriendsInputModel) {
    try {
      output = await get_event_collection_of_friends_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id (.*)$/,
      async (id: string) => {
        user_id = id;
        try {
          const resp = await create_user_account_interactor.execute(user_mock);
          user_id = resp.id; 
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenTheUserTriesToGetEventsOfHisFriends(when) {
    when('the user tries to get events of his friends', 
      async () => {
        await getEventCollectionOfFriends({
          user_id
        });
      });
  }
  
  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    get_event_collection_of_friends_interactor = module.get<GetEventCollectionOfFriendsInteractor>(EventDITokens.GetEventCollectionOfFriendsInteractor);
  });

  test('A user gets a collection of events of his friends',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenTheUserTriesToGetEventsOfHisFriends(when);
      then('a collection of event is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});