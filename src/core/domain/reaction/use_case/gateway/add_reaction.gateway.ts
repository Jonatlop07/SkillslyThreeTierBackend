import Create from '@core/common/persistence/create';
import Delete from '@core/common/persistence/delete';
import Find from '@core/common/persistence/find';
import { ReactionDTO } from '../persistence-dto/reaction.dto';
import ReactionQueryModel from '../query-model/reaction.query_model';

export default interface AddReactionGateway extends Create<ReactionDTO>, Find<ReactionDTO, ReactionQueryModel>, Delete<ReactionDTO, ReactionQueryModel>{}