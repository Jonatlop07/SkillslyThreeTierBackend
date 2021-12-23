import { AssistanceDTO } from "../../persistence-dto/assistance.dto";

export default interface ExistsEventAssistance {
  existsEventAssistant(params: AssistanceDTO): Promise<boolean>;
}