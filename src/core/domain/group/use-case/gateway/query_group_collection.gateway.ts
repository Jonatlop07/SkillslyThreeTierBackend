import FindGroups from '../persistence/find';
import QueryUsers from '../persistence/query_group_users';

export default interface QueryGroupCollectionGateway extends QueryUsers, FindGroups{}
