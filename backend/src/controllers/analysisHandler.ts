import { MessageModel } from "./../db/schema";
import { aiResponseSchema } from "shared/src/types/zodTypes";
import { Request, Response } from "express";
import { config } from "dotenv";
import Groq from "groq-sdk";
import z from "zod";
import { AIAnalysis, Status } from "shared/src/types";
import { generateSpans } from "../utils/parse";
import { updateMessage } from "../services/saveToDB";
import { ConversationModel } from "../db/schema";

config({ path: "./.env" });
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });
const reqSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  transcript: z.string(),
});

export const analysisHandler = async (req: Request, res: Response) => {
  //validations
  const parsed = reqSchema.safeParse({ ...req.body });
  if (!parsed.success) throw new Error("INVALID REQUEST PARAMETERS");

  const dbConvRes = await ConversationModel.findById(
    parsed.data.conversationId
  );
  if (!dbConvRes && parsed.data.conversationId)
    throw new Error("INVALID CONVERSATION ID");
  const dbMsgRes = await MessageModel.findById(parsed.data.messageId);
  if (!dbMsgRes && parsed.data.messageId) throw new Error("INVALID MESSAGE ID");

  /////////////////////////////////////////////////////

  // AI Analysis
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
        content: `Transcription:\n${parsed.data.transcript}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "grammer_response",
        schema: z.toJSONSchema(aiResponseSchema),
      },
    },
  });
  const messageContent = response?.choices?.[0]?.message?.content ?? "{}";
  const rawResult = JSON.parse(messageContent);
  const parsedResult = aiResponseSchema.safeParse(rawResult);
  if (!parsedResult.success) throw new Error("WRONG RESPONSE FROM GROQ");
  ////////////////////////////// ///////////////////////////////////

  // treat the response
  const spans = generateSpans(
    parsed.data.transcript,
    parsedResult.data.corrections
  );

  const aiAnalysisObj: AIAnalysis = {
    spans,
    critique: parsedResult.data.critique || "",
    suggestions: parsedResult.data.suggestions || [],
    score: parsedResult.data.score || 0,
  };

  //update message in DB
  const message = await updateMessage(
    parsed.data.messageId,
    "analyzed" as Status,
    aiAnalysisObj
  );
  if (!message) throw new Error("FAILED TO UPDATE MESSAGE IN DB");

  const messageId = message._id.toString();
  const conversationId = message.conversationId.toString();

  res.status(200).json({
    conversationId: conversationId,
    messageId: messageId,
    status: "analyzed" as Status,
    transcript: parsed.data.transcript,
    aiAnalysis: {
      ...parsedResult.data,
      spans,
    },
  });
};
