import GroupQueryModel from '../../query-model/group.query_model';

export default interface ExistsJoinRequest{
  existsJoinRequest(param: GroupQueryModel): Promise<boolean>;
  existsGroupUserRelationship(param: GroupQueryModel): Promise<boolean>;
}
