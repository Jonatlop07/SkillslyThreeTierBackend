import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import GetMyEventCollectionInputModel from "@core/domain/event/use-case/input-model/get_my_event_collection.input_model";
import { GetMyEventCollectionInteractor } from "@core/domain/event/use-case/interactor/get_my_event_collection.interactor";
import GetMyEventCollectionOutputModel from "@core/domain/event/use-case/output-model/get_my_event_collection.output_model";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import CreateUserAccountInputModel from "@core/domain/user/use-case/input-model/create_user_account.input_model";
import { CreateUserAccountInteractor } from "@core/domain/user/use-case/interactor/create_user_account.interactor";
import { defineFeature, loadFeature } from "jest-cucumber";
import { createTestModule } from "../create_test_module";

const feature = loadFeature('test/bdd-functional/features/event/get_my_event_collection.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string; 
  let create_user_account_interactor: CreateUserAccountInteractor;
  let get_my_event_collection_interactor: GetMyEventCollectionInteractor;
  let output: GetMyEventCollectionOutputModel;

  async function getMyEventCollection(input: GetMyEventCollectionInputModel) {
    try {
      output = await get_my_event_collection_interactor.execute(input);
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
    when('the user tries to get his events', 
      async () => {
        await getMyEventCollection({
          user_id
        });
      });
  }
  
  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    get_my_event_collection_interactor = module.get<GetMyEventCollectionInteractor>(EventDITokens.GetMyEventCollectionInteractor);
  });

  test('A user gets a collection of his events',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenTheUserTriesToGetEventsOfHisFriends(when);
      then('a collection of event is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});