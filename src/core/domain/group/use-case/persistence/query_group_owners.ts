import GroupQueryModel from '../query-model/group.query_model';

export default interface QueryOwners {
  userIsOwner(param: GroupQueryModel): Promise<boolean>;
  groupHasMoreOwners(group_id: string): Promise<boolean>;
}
