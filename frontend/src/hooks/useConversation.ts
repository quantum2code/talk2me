import { useEffect, useState } from "react";
import { startConversation } from "../utils/axios";
import { useParams } from "react-router";

export const useConversation = () => {
  const { convId } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(
    () => convId || localStorage.getItem("conversationId"),
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

  const ensureConversationId = async () => {
    // If we already have a conversationId, return it
    if (conversationId) return conversationId;

    // Otherwise, create a new conversation
    const newId = await startConversation();
    setConversationId(newId);
    localStorage.setItem("conversationId", newId);
    return newId;
  };

  return { conversationId, setConversationId, ensureConversationId };
};
