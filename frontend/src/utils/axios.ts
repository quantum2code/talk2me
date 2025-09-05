import type { AxiosResponse } from "axios";
import axios from "axios";
import {
  AnalysisResponseSchema,
  startConversationSchema,
  TranscriptResponseSchema,
} from "shared/src/types/zodTypes";
export const BACKEND_URL = "http://localhost:3000";

export const postTranscription = async (formData: FormData) => {
  const result: AxiosResponse = await axios.post(
    `${BACKEND_URL}/api/transcription`,
    formData
  );
  const parsed = TranscriptResponseSchema.safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR:\n${parsed.error.message}`);
  return parsed.data;
};

export const postAnalysis = async (
  transcript: string,
  msgID: string,
  convID: string
) => {
  const result: AxiosResponse = await axios.post(
    `${BACKEND_URL}/api/analysis`,
    {
      transcript,
      messageID: msgID,
      conversationID: convID,
    }
  );
  const parsed = AnalysisResponseSchema.safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data;
};

export const startConversation = async () => {
  const result: AxiosResponse = await axios.post(
    `${BACKEND_URL}/api/start-conversation`
  );
  const parsed = startConversationSchema.safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data.conversationID;
};
