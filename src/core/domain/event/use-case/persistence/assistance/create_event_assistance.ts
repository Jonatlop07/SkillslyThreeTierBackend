import { AssistanceDTO } from '../../persistence-dto/assistance.dto';

export default interface CreateEventAssistance {
  createEventAssistant(params: AssistanceDTO): Promise<void>;
}
