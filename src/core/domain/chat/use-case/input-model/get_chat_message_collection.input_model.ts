import IncludesPagination from '@core/common/use-case/includes_pagination';

export default interface GetChatMessageCollectionInputModel extends IncludesPagination {
  user_id: string;
  conversation_id: string;
}
