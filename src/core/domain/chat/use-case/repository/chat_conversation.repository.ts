import CreatePrivateChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_private_chat_conversation.gateway';
import CreateGroupChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_group_chat_conversation.gateway';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import GetChatConversationCollectionGateway
  from '@core/domain/chat/use-case/gateway/get_chat_conversation_collection.gateway';
import AddMembersToGroupConversationGateway
  from '@core/domain/chat/use-case/gateway/add_members_to_group_conversation.gateway';
import UpdateGroupConversationDetailsGateway
  from '@core/domain/chat/use-case/gateway/update_group_conversation_details.gateway';
import DeleteChatGroupConversationGateway
  from '@core/domain/chat/use-case/gateway/delete_chat_group_conversation.gateway';
import ExitChatGroupConversationGateway from '@core/domain/chat/use-case/gateway/exit_chat_group_conversation.gateway';

export default interface ChatConversationRepository
  extends CreatePrivateChatConversationGateway,
  CreateGroupChatConversationGateway, BelongsUserToChatConversationGateway,
  GetChatConversationCollectionGateway, AddMembersToGroupConversationGateway,
  UpdateGroupConversationDetailsGateway, DeleteChatGroupConversationGateway,
  ExitChatGroupConversationGateway {}
