import z from "zod";
export const statusEnum = z.enum([
  "pending",
  "transcribed",
  "analyzed",
  "failed",
]);

export const aiResponseSchema = z.object({
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

export const errorDetailSchema = z.object({
  original: z.string(),
  corrected: z.string(),
  error: z.string(),
  type: z.enum(["grammar", "vocabulary"]),
});

export const transcriptSpanSchema = z.object({
  text: z.string(),
  isError: z.boolean(),
  error: errorDetailSchema.nullable(),
});

export const aiAnalysisSchema = z.object({
  spans: z.array(transcriptSpanSchema),
  critique: z.string(),
  suggestions: z.array(z.string().min(1)),
  score: z.number().int().min(0).max(100),
});

export const MessageResponseSchema = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  status: statusEnum,
  transcript: z.string().optional(),
  aiAnalysis: aiAnalysisSchema.optional(),
});

export const aiAnalysisResponseSchema = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  status: statusEnum,
  transcript: z.string().optional(),
  aiAnalysis: z
    .object({
      spans: z.array(transcriptSpanSchema),
      critique: z.string(),
      suggestions: z.array(z.string().min(1)),
      score: z.number().int().min(0).max(100),
    })
    .optional(),
});

export const transcriptResponseSchema = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  transcript: z.string(),
  status: statusEnum,
});
