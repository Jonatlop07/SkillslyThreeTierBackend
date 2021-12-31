import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import CreateEventInputModel from '@core/domain/event/use-case/input-model/create_event.input_model';
import { CreateEventInteractor } from '@core/domain/event/use-case/interactor/create_event.interactor';
import { DeleteEventInteractor } from '@core/domain/event/use-case/interactor/delete_event.interactor';
import DeleteEventOutputModel from '@core/domain/event/use-case/output-model/delete_event.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createEventMock } from '../utils/create_event_mock';
import { createUserMock } from '../utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/event/delete_event.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();
  const event_mock: CreateEventInputModel = createEventMock();

  let user_id: string;
  let event_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_event_interactor: CreateEventInteractor;
  let delete_event_interactor: DeleteEventInteractor;

  let output: DeleteEventOutputModel;

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

  function whenTheUserTriesToDeleteTheEvent(when) {
    when('the user tries to delete his event', async () => {
      try {
        output = await delete_event_interactor.execute({
          event_id,
          user_id,
        });
      } catch (e) {
        console.error(e.stack);
      }
    });
  }

  function thenTheEventIsDeleted(then) {
    then('the event no longer exists', () => {
      expect(output).toBeDefined();
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_event_interactor = module.get<CreateEventInteractor>(EventDITokens.CreateEventInteractor);
    delete_event_interactor = module.get<DeleteEventInteractor>(EventDITokens.DeleteEventInteractor);
  });

  test('A logged in user tries to delete his event',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAEventIdentifiedByIdExists(and);
      whenTheUserTriesToDeleteTheEvent(when);
      thenTheEventIsDeleted(then);
    }
  );
});
