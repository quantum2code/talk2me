import { useCallback, useState } from "react";
import { type Message } from "shared/src/types";
import { postAnalysis, postTranscription, generateTitle } from "../utils/axios";
import { fromDataConstructor } from "../utils/formData";

export interface ProcessAudioOptions {
  isFirstMessage?: boolean;
  onFirstMessage?: (conversationId: string) => void;
}

export function useProcessAudio() {
  const [messages, setMessages] = useState<Message[]>([]);

  const processAudio = useCallback(
    async (
      blobData: Blob,
      conversationId: string,
      options?: ProcessAudioOptions,
    ) => {
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

        console.log("TRANSCRIPT RESULT: ", transcriptResult);

        // Generate title in parallel with analysis for first message
        if (options?.isFirstMessage) {
          generateTitle(
            transcriptResult.conversationId,
            transcriptResult.transcript,
          )
            .then((titleResult) => {
              console.log("TITLE GENERATED: ", titleResult.title);
            })
            .catch((err) => {
              console.error("Error generating title:", err);
            });

          // Call navigation callback after transcription completes
          if (options.onFirstMessage) {
            options.onFirstMessage(transcriptResult.conversationId);
          }
        }

        //analyze it
        const analyzeResult = await postAnalysis(
          transcriptResult.transcript,
          transcriptResult.messageId,
          transcriptResult.conversationId,
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
              : m,
          ),
        );
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("ERRORLOG: ", err);
        }
      }
    },
    [], // Stable callback - no dependencies on messages
  );
  return { messages, setMessages, processAudio };
}
