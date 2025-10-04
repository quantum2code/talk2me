import { useEffect, useState } from "react";
import { startConversation } from "../utils/axios";
import { useParams } from "react-router";

export const useConversation = () => {
  const { convId } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(
    () => convId || localStorage.getItem("conversationId")
  );

  useEffect(() => {
    if (convId) {
      setConversationId(convId);
      localStorage.setItem("conversationId", convId);
    } else {
      setConversationId(null);
      localStorage.removeItem("conversationId");
    }
  }, [convId]);
  const getConversationId = async () => {
    if (!conversationId) {
      const tempId = await startConversation();
      setConversationId(tempId);
      localStorage.setItem("conversationId", tempId);
      return tempId;
    }
    return conversationId;
  };
  return { conversationId, setConversationId, getConversationId };
};
