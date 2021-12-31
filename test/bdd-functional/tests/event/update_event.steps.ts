import { CreateEventInteractor } from '@core/domain/event/use-case/interactor/create_event.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createUserMock } from '../utils/create_user_mock';
import CreateEventInputModel from '@core/domain/event/use-case/input-model/create_event.input_model';
import { createEventMock } from '../utils/create_event_mock';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { EventContentElement } from '@core/domain/event/entity/type/event_content_element';
import { createTestModule } from '../create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { UpdateEventInteractor } from '@core/domain/event/use-case/interactor/update_event.interactor';
import UpdateEventOutputModel from '@core/domain/event/use-case/output-model/update_event.output_model';

const feature = loadFeature('test/bdd-functional/features/event/update_event.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();
  const event_mock: CreateEventInputModel = createEventMock();

  let user_id: string;
  let event_id: string;

  let event_new_content: EventContentElement;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_event_interactor: CreateEventInteractor;
  let update_event_interactor: UpdateEventInteractor;

  let output: UpdateEventOutputModel;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id (.*)$/, async (input_id) => {
      user_id = input_id;
      await createUserAccount(user_1_mock);
    });
  }

  function andAEventIdentifiedByIdExists(and) {
    and(/there exists an event identified by "([^"]*)"$/,
      async (input_event_id) => {
        try {
          event_id = input_event_id;
          await create_event_interactor.execute(
            event_mock
          );
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andTheUserProvidesNewContentOfTheEvent(and) {
    and('the user provides the new content of the event being:',
      (event_new_content_table) => {
        event_new_content = event_new_content_table;
      }
    );
  }

  function whenTheUserTriesToUpdateTheEvent(when) {
    when('the user tries to update the event', async () => {
      try {
        output = await update_event_interactor.execute({
          id: event_id,
          name: event_new_content.name,
          description: event_new_content.description,
          lat: event_new_content.lat,
          long: event_new_content.long,
          date: event_new_content.date,
          user_id,
        });
      } catch (e) {
        console.error(e.stack);
      }
    });
  }

  function thenTheEventIsUpdatedWithTheContentProvided(then) {
    then('the event is updated with the new data provided', () => {
      expect(output).toBeDefined();
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_event_interactor = module.get<CreateEventInteractor>(EventDITokens.CreateEventInteractor);
    update_event_interactor = module.get<UpdateEventInteractor>(EventDITokens.UpdateEventInteractor);
  });

  test('A logged user tries to update an event with valid format data',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAEventIdentifiedByIdExists(and);
      andTheUserProvidesNewContentOfTheEvent(and);
      whenTheUserTriesToUpdateTheEvent(when);
      thenTheEventIsUpdatedWithTheContentProvided(then);
    }
  );
});
