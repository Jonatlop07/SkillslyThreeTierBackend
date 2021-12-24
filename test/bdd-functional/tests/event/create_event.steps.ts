import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { EventException } from '@core/domain/event/use-case/exception/event.exception';
import CreateEventInputModel from '@core/domain/event/use-case/input-model/create_event.input_model';
import { CreateEventInteractor } from '@core/domain/event/use-case/interactor/create_event.interactor';
import CreateEventOutputModel from '@core/domain/event/use-case/output-model/create_event.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/event/create_event.feature');

defineFeature(feature, (test) => {

  const user_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let name: string;
  let description: string;
  let lat: number;
  let long : number;
  let date: Date;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_event_interactor: CreateEventInteractor;
  let output: CreateEventOutputModel;
  let exception: EventException = undefined;

  async function createEvent(input: CreateEventInputModel) {
    try {
      output = await create_event_interactor.execute(input);
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

  function andUserProvidesDataOfEvent(and) {
    and(
      /^user provides event data: "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (input_name, input_description, input_lat, input_long, input_date) => {
        name = input_name;
        description = input_description;
        lat = input_lat;
        long = input_long;
        date = new Date(input_date);
      },
    );
  }

  function whenUserTriesToCreateEvent(when) {
    when('user tries to create the event', async () => {
      await createEvent({
        user_id,
        name,
        description,
        lat,
        long,
        date
      });
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_event_interactor = module.get<CreateEventInteractor>(EventDITokens.CreateEventInteractor);
    exception = undefined;
  });

  test('A logged user tries to create an event with valid format data',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesDataOfEvent(and);
      whenUserTriesToCreateEvent(when);
      then(
        'the event is created with the data provided',
        () => {
          expect(output).toBeDefined();
        },
      );
    }
  );
});
