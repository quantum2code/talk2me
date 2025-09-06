import { useQuery } from "@tanstack/react-query";
import { getConversationById, getConversations } from "../utils/axios";
export const useFetchMessages = ({
  currentConversationId,
}: {
  currentConversationId: string;
}) => {
  // all conversations
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  // messages of active conversation
  const messagesQuery = useQuery({
    queryKey: ["messages", currentConversationId],
    queryFn: () => getConversationById(currentConversationId!),
    enabled: !!currentConversationId, // only runs when ID exists
  });
  return { conversationsQuery, messagesQuery };
};
