import { config } from "dotenv";
import { Request, Response } from "express";
import Groq, { toFile } from "groq-sdk";
const MAX_SIZE = 10000;

config({ path: "./.env" });
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// const formDataSchema = z.object({
//   size: z.string().refine((val) => Number(val) && Number(val) < MAX_SIZE),
// });

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const transcribeHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "NO FILE" });
  }
  const uploadedFile = await toFile(
    req.file.buffer,
    `${req.file.originalname + "-" + Date.now() + ".ogg"}`
  );
  const transcription = await groq.audio.transcriptions.create({
    file: uploadedFile,
    model: "whisper-large-v3-turbo",
    prompt: "Specify context or spelling",
    response_format: "verbose_json",
    timestamp_granularities: ["word", "segment"],
    language: "en",
  });
  console.log(transcription);

  res.json({ output: transcription.text });
};
