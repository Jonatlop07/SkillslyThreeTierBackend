import { Interactor } from '@core/common/use-case/interactor';
import AddReactionInputModel from '../../input-model/add_reaction.input_model';
import AddReactionOutputModel from '../output-model/add_reaction.output_model';

export interface AddReactionInteractor extends Interactor<AddReactionInputModel, AddReactionOutputModel> {}
