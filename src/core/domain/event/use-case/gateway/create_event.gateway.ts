import Create from "@core/common/persistence/create";
import { EventDTO } from "../persistence-dto/event.dto";

export default interface CreateEventGateway extends Create<EventDTO> {}