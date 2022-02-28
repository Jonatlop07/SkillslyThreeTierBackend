import Create from '@core/common/persistence/create/create';
import { ReactionDTO } from '../persistence-dto/reaction.dto';
import ReactionQueryModel from '../query-model/reaction.query_model';
import CreateReactionPersistenceDTO
  from '@core/domain/reaction/use_case/persistence-dto/create_reaction.persistence_dto';
import FindOne from '@core/common/persistence/find/find_one';
import Delete from '@core/common/persistence/delete/delete';

export default interface AddReactionGateway
  extends Create<CreateReactionPersistenceDTO, ReactionDTO>,
  FindOne<ReactionQueryModel, ReactionDTO>, Delete<ReactionQueryModel, ReactionDTO>{}
