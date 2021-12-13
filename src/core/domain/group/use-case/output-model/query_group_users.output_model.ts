import { GroupUserDTO } from '../persistence-dto/group_users.dto';
export default interface QueryGroupUsersOutputModel {
  groupUsers: GroupUserDTO[]; 
}