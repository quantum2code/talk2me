import {
  AIResponse,
  AIResponseSchema,
} from "../../../../shared/types/conversation";
import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";

config({ path: "./.env" });
const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const model = new ChatGroq({
  apiKey: GROQ_API_KEY ?? "",
  model: "deepseek-r1-distill-llama-70b",
  temperature: 0,
  maxTokens: 1024,
});

const model_with_schema = model.withStructuredOutput(AIResponseSchema);
export const grammerChecker = async (
  transcription: string
): Promise<AIResponse> => {
  const systemPrompt = `You are a JSON generator.  
Your only job is to output valid JSON.  
Do not include explanations, markdown, code fences, or extra text.  
The JSON must strictly follow this schema:

{
    "correctionArr": [
      {
        "incorrectPhrase": "string",
        "correctedPhrase": "string",
        "error": "string"
      }
    ]
}
`;

  const response = await model_with_schema.invoke(
    `${systemPrompt}\n\nTranscription: ${transcription}`
  );
  if (!response) {
    throw new Error("Couldn't perform the action");
  }
  return response;
};
