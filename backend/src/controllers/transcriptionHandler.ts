import { config } from "dotenv";
import { Request, Response } from "express";
import Groq, { toFile } from "groq-sdk";
import { Status } from "shared/src/types";
import z from "zod";
import { addMessage } from "../services/saveToDB";
import { ConversationModel } from "../db/schema";
config({ path: "./.env" });

const requestSchema = z.object({
  conversationId: z.string().optional(),
  audio: z.any(),
});

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MAX_FILE_SIZE = 24000000;

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const transcriptionHandler = async (req: Request, res: Response) => {
  //validations
  if (!req.file) throw new Error("NO FILE PROVIDED");
  if (req.file.size > MAX_FILE_SIZE) throw new Error("MAX FILE SIZE EXCEEDED");

  const parsed = requestSchema.safeParse({ ...req.body });
  if (!parsed.success) throw new Error("ZOD PARSING ERROR");

  const dbRes = await ConversationModel.findById(parsed.data.conversationId);
  if (!dbRes && parsed.data.conversationId)
    throw new Error("INVALID CONVERSATION ID");
  /////////////////////////////////////////////////////

  // Transcription
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

  if (!transcription.text) throw new Error("FAILED TO TRANSCRIBE");
  /////////////////////////////////////////////////////

  // save to DB
  const message = await addMessage(
    dbRes?._id.toString() || "",
    transcription.text
  );
  if (!message) throw new Error("FAILED TO SAVE MESSAGE TO DB");

  const messageId = message._id.toString();
  const conversationId = message.conversationId.toString();

  return res.status(200).json({
    messageId: messageId,
    conversationId: conversationId,
    transcript: transcription.text,
    status: "transcribed" as Status,
  });
};
