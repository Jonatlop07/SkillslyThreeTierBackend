import { AssistanceDTO } from '../../persistence-dto/assistance.dto';

export default interface DeleteEventAssistance {
  deleteEventAssistant(params: AssistanceDTO): Promise<void>;
}
