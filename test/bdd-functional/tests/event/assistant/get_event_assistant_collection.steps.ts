import { EventDITokens } from "@core/domain/event/di/event_di_tokens";
import { EventException } from "@core/domain/event/use-case/exception/event.exception";
import GetEventAssistantCollectionInputModel from "@core/domain/event/use-case/input-model/assistant/get_event_assistant_collection.input_model";
import CreateEventInputModel from "@core/domain/event/use-case/input-model/create_event.input_model";
import { GetEventAssistantCollectionInteractor } from "@core/domain/event/use-case/interactor/assistant/get_event_assistant.interactor";
import { CreateEventInteractor } from "@core/domain/event/use-case/interactor/create_event.interactor";
import GetEventAssistantCollectionOutputModel from "@core/domain/event/use-case/output-model/assistant/get_event_assistant_collection.output_model";
import { defineFeature, loadFeature } from "jest-cucumber";
import { createTestModule } from "../../create_test_module";

const feature = loadFeature('test/bdd-functional/features/event/assistant/get_event_assistant_collection.feature');

defineFeature( feature, (test) => {
  const event_mock: CreateEventInputModel = {
    name: 'Poolparty', 
    description: 'amazing poolparty in my beach house',
    lat: -71.3, 
    long: 12.34, 
    date: new Date(), 
    user_id: '1'
  };

  let event_id: string;
  let create_event_interactor: CreateEventInteractor;
  let get_event_assistant_collection_interactor: GetEventAssistantCollectionInteractor;
  let output: GetEventAssistantCollectionOutputModel;
  let exception: EventException;

  async function getEventAssistantCollection(input: GetEventAssistantCollectionInputModel) {
    try {
      output = await get_event_assistant_collection_interactor.execute(input);
    } catch (e) {
      exception = e;
      console.log(exception);
    }
  }

  function givenAEventExists(given) {
    given(/^an event exists, and has an id (.*)$/,
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

  function whenTheEventTriesToGetHisAssistants(when) {
    when('the event tries to get his assitants',
      async () => {
        await getEventAssistantCollection({
          event_id
        });
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_event_interactor = module.get<CreateEventInteractor>(EventDITokens.CreateEventInteractor);
    get_event_assistant_collection_interactor = module.get<GetEventAssistantCollectionInteractor>(EventDITokens.GetEventAssistantCollectionInteractor);
    exception = undefined;
  });

  test('An event gets a collection of existing assitants',
    ({ given, when, then }) => {
      givenAEventExists(given);
      whenTheEventTriesToGetHisAssistants(when);
      then('a collection of assistants is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
