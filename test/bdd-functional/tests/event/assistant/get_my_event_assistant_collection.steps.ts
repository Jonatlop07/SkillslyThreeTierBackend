import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { EventException } from '@core/domain/event/use-case/exception/event.exception';
import GetMyEventAssistantCollectionInputModel from '@core/domain/event/use-case/input-model/assistant/get_my_event_assistant_collection.input_model';
import { GetMyEventAssistantCollectionInteractor } from '@core/domain/event/use-case/interactor/assistant/get_my_event_assistant_collection.interactor';
import GetMyEventAssistantCollectionOutputModel from '@core/domain/event/use-case/output-model/assistant/get_my_event_assistant_collection.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';
import { createUserMock } from '../../utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/event/assistant/get_my_event_assistant_collection.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let get_my_event_assistant_collection_interactor: GetMyEventAssistantCollectionInteractor;
  let output: GetMyEventAssistantCollectionOutputModel;
  let exception: EventException;

  async function getMyEventAssistantCollection(input: GetMyEventAssistantCollectionInputModel) {
    try {
      output = await get_my_event_assistant_collection_interactor.execute(input);
    } catch (e) {
      exception = e;
      console.log(exception);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id (.*)$/,
      async (id: string) => {
        user_id = id;
        try {
          await create_user_account_interactor.execute(user_mock);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenTheUserTriesToGetHisAssistants(when) {
    when('the assistant user tries to get his events',
      async () => {
        await getMyEventAssistantCollection({
          user_id
        });
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    get_my_event_assistant_collection_interactor = module.get<GetMyEventAssistantCollectionInteractor>(EventDITokens.GetMyEventAssistantCollectionInteractor);
    exception = undefined;
  });

  test('An assitant user gets a collection of events',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenTheUserTriesToGetHisAssistants(when);
      then('a collection of events is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
