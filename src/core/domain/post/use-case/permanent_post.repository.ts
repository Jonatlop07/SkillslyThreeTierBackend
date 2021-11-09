import CreatePermanentPostGateway from './gateway/create_permanent_post.gateway';
import { UpdatePermanentPostGateway } from './gateway/update_permanent_post.gateway';

export default interface PermanentPostRepository extends CreatePermanentPostGateway, UpdatePermanentPostGateway {}
