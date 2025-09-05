import { useCallback, useState } from "react";
import { startConversation } from "../utils/axios";

export function useConversation() {
  const [conversationID, setConversationID] = useState<string | null>(
    () => localStorage.getItem("conversationID")
  );

  const startNewConversation = useCallback(async () => {
    const conversationID = await startConversation();
    setConversationID(conversationID);
    localStorage.setItem("conversationID", conversationID);
    return conversationID;
  }, []);

  const endConversation = useCallback(() => {
    setConversationID(null);
    localStorage.removeItem("conversationID");
  }, []);

  return { conversationID, startNewConversation, endConversation };
}
