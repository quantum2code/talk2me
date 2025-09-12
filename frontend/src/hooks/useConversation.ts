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
    }
  }, [convId]);
  const getConversationId = async () => {
    let tempId = conversationId || localStorage.getItem("conversationId");
    if (!tempId) {
      tempId = await startConversation();
      setConversationId(tempId);
      localStorage.setItem("conversationId", tempId);
      return tempId;
    }
    return convId;
  };
  return { conversationId, setConversationId, getConversationId };
};
