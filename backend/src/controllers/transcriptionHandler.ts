import { config } from "dotenv";
import { Request, Response } from "express";
import Groq, { toFile } from "groq-sdk";
import { Status } from "shared/src/types";
import {
  startConversationSchema,
  TranscriptResponseSchema,
} from "shared/src/types/zodTypes";
import z from "zod";
import { addUserMessage } from "../services/saveToDB";
config({ path: "./.env" });

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MAX_FILE_SIZE = 24000000;

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const transcriptionHandler = async (req: Request, res: Response) => {
  if (!req.file) throw new Error("NO FILE PROVIDED");
  console.log(req.body);
  if (req.file.size > MAX_FILE_SIZE) throw new Error("MAX FILE SIZE EXCEEDED");

  const parsed = startConversationSchema.safeParse({ ...req.body });
  if (!parsed.success) throw new Error("ZOD PARSING ERROR");

  const uploadedFile = await toFile(
    req.file.buffer,
    `${req.file.originalname + "-" + Date.now() + ".webm"}`
  );

  const transcription = await groq.audio.transcriptions.create({
    file: uploadedFile,
    model: "whisper-large-v3-turbo",
    prompt: "Specify context or spelling",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
    language: "en",
  });
  console.log("TRANSCRIPTION:\n", transcription);

  if (!transcription) throw new Error("FAILED TO TRANSCRIBE");

  const userMessage = await addUserMessage(
    parsed.data.conversationID,
    transcription.text
  );

  const userMessageID = userMessage._id.toString();

  return res.status(200).json({
    messageID: userMessageID,
    conversationID: parsed.data.conversationID,
    transcript: transcription.text,
    status: Status.Pending,
  } as z.infer<typeof TranscriptResponseSchema>);
};
