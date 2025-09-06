import { useState } from "react";
import { startConversation } from "../utils/axios";

export const useConversation = () => {
  const [conversationId, setConversationId] = useState<string | null>(() =>
    localStorage.getItem("conversationId")
  );

  const getConversationId = async () => {
    let convId = conversationId || localStorage.getItem("conversationId");
    if (!convId) {
      convId = await startConversation();
      setConversationId(convId);
      localStorage.setItem("conversationId", convId);
      return convId;
    }
    return convId;
  };
  return { conversationId, setConversationId, getConversationId };
};
