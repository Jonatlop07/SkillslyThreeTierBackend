import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { EventException } from "@core/domain/event/use-case/exception/event.exception";
import DeleteEventAssistantInputModel from "@core/domain/event/use-case/input-model/assistant/delete_event_assistant.input_model";
import CreateEventInputModel from "@core/domain/event/use-case/input-model/create_event.input_model";
import { CreateEventAssistantInteractor } from "@core/domain/event/use-case/interactor/assistant/create_event_assistant.interactor";
import { DeleteEventAssistantInteractor } from "@core/domain/event/use-case/interactor/assistant/delete_event_assistant.interactor";
import { CreateEventInteractor } from "@core/domain/event/use-case/interactor/create_event.interactor";
import DeleteEventAssistantOutputModel from "@core/domain/event/use-case/output-model/assistant/delete_event_assistant.output_model";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import CreateUserAccountInputModel from "@core/domain/user/use-case/input-model/create_user_account.input_model";
import { CreateUserAccountInteractor } from "@core/domain/user/use-case/interactor/create_user_account.interactor";
import { defineFeature, loadFeature } from "jest-cucumber";
import { createTestModule } from "../../create_test_module";

const feature = loadFeature('test/bdd-functional/features/event/assistant/delete_event_assistant.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };
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
  let delete_event_assistant_interactor: DeleteEventAssistantInteractor;
  let output: DeleteEventAssistantOutputModel;
  let exception: EventException = undefined;

  async function deleteEventAssistant(input: DeleteEventAssistantInputModel) {
    try {
      output = await delete_event_assistant_interactor.execute(input);
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
          const resp = await create_event_interactor.execute(event_mock);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAnAssistantRelationshipExists(and) {
    and('an event assistant relationship exists between the user and the event',
      async () => {
        try {
          const resp = await create_event_assistant_interactor.execute({user_id,event_id});
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenTheUserDeletesAssistance(when) {
    when('the user deletes his assistance to the event', async () => {
      await deleteEventAssistant({
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
    delete_event_assistant_interactor = module.get<DeleteEventAssistantInteractor>(EventDITokens.DeleteEventAssistantInteractor);
    exception = undefined;
  });

  test('A logged in user delete his assistance to an event',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnEventExists(and);
      andAnAssistantRelationshipExists(and);
      whenTheUserDeletesAssistance(when);
      then('the event assistant is deleted', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
