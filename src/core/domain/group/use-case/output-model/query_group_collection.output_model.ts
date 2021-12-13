import { BasicGroupDTO } from '../persistence-dto/basic_group_data.dto';

export default interface QueryGroupCollectionOutputModel {
  groups: Array<BasicGroupDTO>
}
