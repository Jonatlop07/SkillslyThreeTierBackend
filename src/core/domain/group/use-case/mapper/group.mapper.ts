import { Group } from '../../entity/group';
import { GroupDTO } from '../persistence-dto/group.dto';

export class GroupMapper {
  public static toGroupDTO(group: Group): GroupDTO {
    return {
      // id: group.id,
      name: group.name,
      description: group.description,
      category: group.category,
      picture: group.picture
    };
  }

  public static toGroup(groupDTO: GroupDTO): Group {
    return new Group({
      id: groupDTO.id,
      owner_id: groupDTO.owner_id,
      name: groupDTO.name,
      description: groupDTO.description,
      category: groupDTO.category,
      picture: groupDTO.picture
    });
  }
}