import {
  aiAnalysisResponseSchema,
  transcriptResponseSchema,
} from "../../../shared/src/types/zodTypes";
import type { AxiosResponse } from "axios";
import axios from "axios";
import z from "zod";
export const BACKEND_URL = "http://localhost:3000";

export const postTranscription = async (formData: FormData) => {
  const result: AxiosResponse = await axios.post(
    `${BACKEND_URL}/api/transcription`,
    formData
  );
  const parsed = transcriptResponseSchema.safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR:\n${parsed.error.message}`);
  return parsed.data;
};

export const postAnalysis = async (
  transcript: string,
  msgId: string,
  convId: string
) => {
  const result: AxiosResponse = await axios.post(
    `${BACKEND_URL}/api/analysis`,
    {
      transcript,
      messageId: msgId,
      conversationId: convId,
    }
  );
  const parsed = aiAnalysisResponseSchema.safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data;
};

export const startConversation = async () => {
  const result: AxiosResponse = await axios.post(`${BACKEND_URL}/api/start`);
  const parsed = z
    .object({ conversationId: z.string() })
    .safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data.conversationId;
};

export const getConversations = async () => {
  const result: AxiosResponse = await axios.get(
    `${BACKEND_URL}/api/conversations`
  );
  const parsed = z
    .object({ id: z.string(), title: z.string() })
    .array()
    .safeParse(result?.data);
  if (!parsed.success)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data;
};

export const getConversationById = async (id: string) => {
  const result: AxiosResponse = await axios.get(
    `${BACKEND_URL}/api/conversations/${id}`
  );
  const parsed = z.array(aiAnalysisResponseSchema).safeParse(result?.data);
  if (!parsed.success || !parsed.data)
    throw new Error(`ZOD PARSING ERROR\n${parsed.error.message}`);
  return parsed.data;
};
