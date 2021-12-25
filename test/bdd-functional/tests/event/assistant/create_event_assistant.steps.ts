import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { EventException } from '@core/domain/event/use-case/exception/event.exception';
import CreateEventAssistantInputModel from '@core/domain/event/use-case/input-model/assistant/create_event_assistant.input_model';
import CreateEventInputModel from '@core/domain/event/use-case/input-model/create_event.input_model';
import { CreateEventAssistantInteractor } from '@core/domain/event/use-case/interactor/assistant/create_event_assistant.interactor';
import { CreateEventInteractor } from '@core/domain/event/use-case/interactor/create_event.interactor';
import CreateEventAssistantOutputModel from '@core/domain/event/use-case/output-model/assistant/create_event_assistant.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/event/assistant/create_event_assistant.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = createUserMock();
  const event_mock: CreateEventInputModel = {
    name: 'Poolparty',
    description: 'amazing poolparty in my beach house',
    lat: -71.3,
    long: 12.34,
    date: new Date(),
    user_id: '1'
  };

  let user_id: string;
  let event_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_event_interactor: CreateEventInteractor;
  let create_event_assistant_interactor: CreateEventAssistantInteractor;
  let output: CreateEventAssistantOutputModel;
  let exception: EventException = undefined;

  async function createEventAssistant(input: CreateEventAssistantInputModel) {
    try {
      output = await create_event_assistant_interactor.execute(input);
    } catch (e) {
      exception = e;
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

  function andAnEventExists(and) {
    and(/^an event exists, and has an id "([^"]*)"$/,
      async (id: string) => {
        event_id = id;
        try {
          await create_event_interactor.execute(event_mock);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenTheUserConfirmsAssistance(when) {
    when('the user confirms assistance to the event', async () => {
      await createEventAssistant({
        user_id,
        event_id
      });
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_event_interactor = module.get<CreateEventInteractor>(EventDITokens.CreateEventInteractor);
    create_event_assistant_interactor = module.get<CreateEventAssistantInteractor>(EventDITokens.CreateEventAssistantInteractor);

    exception = undefined;
  });

  test('A logged in user confirms assistance to an event',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnEventExists(and);
      whenTheUserConfirmsAssistance(when);
      then('an event assistant is created', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
