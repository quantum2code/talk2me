import { Request, Response } from "express";
import { config } from "dotenv";
import Groq from "groq-sdk";
import z from "zod";
import {
  AIResponse,
  AIResponseSchema,
  AnalysisResponseSchema,
} from "shared/src/types/zodTypes";
import { Status } from "shared/src/types";
import { generateSpans } from "../utils/parse";
import { addAIMessage } from "../services/saveToDB";

config({ path: "./.env" });
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });
const reqSchema = z.object({
  messageID: z.string(),
  conversationID: z.string(),
  transcript: z.string(),
});

export const analysisHandler = async (req: Request, res: Response) => {
  const { success, data } = reqSchema.safeParse({ ...req.body });
  if (!success) throw new Error("INVALID REQUEST PARAMETERS");

  const systemPrompt =
    "You are given a transcription. Your task is to identify all grammatical and vocabulary related error. Ignore spelling and puntuation errors. For each error, provide the following information in JSON format using the provided schema-";
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `${systemPrompt}`,
      },
      {
        role: "user",
        content: `Transcription:\n${data.transcript}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "grammer_response",
        schema: z.toJSONSchema(AIResponseSchema),
      },
    },
  });
  const messageContent = response?.choices?.[0]?.message?.content ?? "{}";
  const rawResult = JSON.parse(messageContent);
  const { success: resultSuccess, data: result } =
    AIResponseSchema.safeParse(rawResult);
  if (!resultSuccess) throw new Error("WRONG RESPONSE FROM GROQ");

  const spans = generateSpans(data.transcript, result.corrections);

  const aiMessage = await addAIMessage(
    data.conversationID,
    result.critique,
    result.suggestions,
    result.score
  );
  const aiMessageID = aiMessage._id.toString();

  res.status(200).json({
    conversationID: data.conversationID,
    user: { id: data.messageID, spans: spans },
    ai: {
      id: aiMessageID,
      critique: result.critique,
      suggestions: result.suggestions,
      score: result.score,
    },
    status: Status.Completed,
  } as z.infer<typeof AnalysisResponseSchema>);
};
