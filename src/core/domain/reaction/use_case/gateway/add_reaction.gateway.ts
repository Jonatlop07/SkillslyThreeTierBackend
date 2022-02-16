import Create from '@core/common/persistence/create/create';
import Delete from '@core/common/persistence/delete';
import Find from '@core/common/persistence/find';
import { ReactionDTO } from '../persistence-dto/reaction.dto';
import ReactionQueryModel from '../query-model/reaction.query_model';
import CreateReactionPersistenceDTO
  from '@core/domain/reaction/use_case/persistence-dto/create_reaction.persistence_dto';

export default interface AddReactionGateway
  extends Create<CreateReactionPersistenceDTO, ReactionDTO>,
  Find<ReactionDTO, ReactionQueryModel>, Delete<ReactionDTO, ReactionQueryModel>{}
