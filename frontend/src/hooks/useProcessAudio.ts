import { useCallback, useState } from "react";
import { type Message } from "shared/src/types";
import { postAnalysis, postTranscription } from "../utils/axios";
import { fromDataConstructor } from "../utils/formData";

export function useProcessAudio() {
  const [messages, setMessages] = useState<Message[]>([]);

  const processAudio = useCallback(
    async (blobData: Blob, conversationId: string) => {
      try {
        console.log("conv id: " + conversationId);
        const formData = fromDataConstructor(blobData, conversationId);

        const transcriptResult = await postTranscription(formData);
        setMessages((prev) => [
          ...prev,
          {
            conversationId: transcriptResult.conversationId,
            messageId: transcriptResult.messageId,
            status: "pending",
            transcript: transcriptResult.transcript,
          },
        ]);

        //analyze it
        const analyzeResult = await postAnalysis(
          transcriptResult.transcript,
          transcriptResult.messageId,
          transcriptResult.conversationId
        );

        console.log("ANALYZE RESULT: ", analyzeResult);
        setMessages((prev) =>
          prev.map((m) =>
            m.messageId === analyzeResult.messageId
              ? {
                  ...m,
                  status: "analyzed",
                  aiAnalysis: analyzeResult.aiAnalysis,
                }
              : m
          )
        );
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
