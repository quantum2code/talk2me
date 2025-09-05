import { start } from "repl";
import { TranscriptSpans } from "./index";
import z, { success } from "zod";
import { Status } from ".";

export const transcriptionRequestSchema = z.object({
  conversationID: z.uuid(),
  messageID: z.uuid(),
  audio: z.file(),
});

export const AIResponseSchema = z.object({
  corrections: z
    .array(
      z.object({
        original: z
          .string()
          .describe(
            "the exact phrase from the user transcription that contains the mistake"
          ),
        corrected: z
          .string()
          .describe("the corrected or improved version of the phrase"),
        error: z
          .string()
          .describe(
            "short description of the mistake (e.g., wrong tense, awkward phrasing, weak vocab choice)"
          ),
        type: z
          .enum(["grammar", "vocabulary"])
          .describe("classify the mistake for clarity and filtering"),
      })
    )
    .describe(
      "list of detected errors with corrections; only grammar and vocabulary related, not punctuation"
    ),

  critique: z
    .string()
    .describe(
      "a few mentor-style lines summarizing what went wrong overall (tone: constructive, not robotic)"
    ),

  suggestions: z
    .array(
      z
        .string()
        .describe(
          "specific actionable tip to improve based on this speech under 7 words (e.g., 'work on past tense consistency', 'try stronger adjectives')"
        )
    )
    .min(1)
    .describe("at least one practical improvement step"),

  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "numerical score between 0 and 100 representing the overall quality of the speech"
    ),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

const TranscriptSpanSchema = z.object({
  text: z.string(),
  isError: z.boolean(),
  error: z
    .object({
      original: z.string(),
      corrected: z.string(),
      error: z.string(),
      type: z.enum(["grammar", "vocabulary"]),
    })
    .nullable(),
});

export const startConversationSchema = z.object({
  createdAt: z.date().default(new Date()),
  conversationID: z.string(),
});

export const TranscriptResponseSchema = z.object({
  messageID: z.string(),
  conversationID: z.string(),
  transcript: z.string(),
  status: z.enum(Status),
});
export const AnalysisResponseSchema = z.object({
  conversationID: z.string(),
  user: z.object({
    id: z.string(),
    spans: z.array(TranscriptSpanSchema).nullable(),
  }),
  ai: z.object({
    id: z.string(),
    critique: z.string(),
    suggestions: z.array(z.string()),
    score: z.number(),
  }),
  status: z.enum(Status),
});
