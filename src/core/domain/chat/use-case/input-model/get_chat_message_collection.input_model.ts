import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface GetChatMessageCollectionInputModel {
  user_id: string;
  conversation_id: string;
  pagination: PaginationDTO;
}
