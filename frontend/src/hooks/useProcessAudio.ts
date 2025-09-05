import { useCallback, useState } from "react";
import {
  Role,
  Status,
  type AIMessage,
  type ChatMessage,
  type UserMessage,
} from "shared/src/types";
import { postAnalysis, postTranscription } from "../utils/axios";
import { fromDataConstructor } from "../utils/formData";

export function useProcessAudio() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const processAudio = useCallback(
    async (blobData: Blob, conversationID: string) => {
      const formData = fromDataConstructor(blobData, conversationID);
      try {
        //trancript
        const transcriptResult = await postTranscription(formData);
        setMessages((prev) => [
          ...prev,
          {
            conversationID: transcriptResult.conversationID,
            id: transcriptResult.messageID,
            role: Role.User,
            transcript: transcriptResult.transcript,
            status: transcriptResult.status,
          } as UserMessage,
        ]);

        //analyze it
        const analyzeResult = await postAnalysis(
          transcriptResult.transcript,
          transcriptResult.messageID,
          transcriptResult.conversationID
        );
        setMessages((prev) =>
          prev.map((m) =>
            m.id === analyzeResult.user.id
              ? ({
                  ...m,
                  spans: analyzeResult.user.spans,
                  status: Status.Completed,
                } as UserMessage)
              : m
          )
        );
        setMessages((prev) => [
          ...prev,
          {
            id: analyzeResult.ai.id,
            conversationID: analyzeResult.conversationID,
            critique: analyzeResult.ai.critique,
            suggestions: analyzeResult.ai.suggestions,
            score: analyzeResult.ai.score,
            status: analyzeResult.status,
          } as AIMessage,
        ]);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("ERRORLOG: ", err);
        }
      }
    },
    []
  );
  return { messages, setMessages, processAudio };
}
