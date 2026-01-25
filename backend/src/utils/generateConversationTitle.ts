import Groq from "groq-sdk";
import { config } from "dotenv";

config({ path: "./.env" });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

/**
 * Generates a short, descriptive title for a conversation based on the first transcript
 * @param transcript - The first message transcript
 * @returns A generated title (max 50 characters) or fallback to "New Conversation"
 */
export const generateConversationTitle = async (
  transcript: string,
): Promise<string> => {
  try {
    // Truncate very long transcripts to save tokens
    const truncatedTranscript =
      transcript.length > 200 ? transcript.slice(0, 200) + "..." : transcript;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates short, descriptive conversation titles. Generate a title that is maximum 50 characters long. Only respond with the title, nothing else.",
        },
        {
          role: "user",
          content: `Generate a short title (max 50 chars) for a conversation that starts with: "${truncatedTranscript}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 20,
    });

    const generatedTitle =
      response?.choices?.[0]?.message?.content?.trim() || "New Conversation";

    // Ensure title doesn't exceed 50 characters
    const finalTitle =
      generatedTitle.length > 50
        ? generatedTitle.slice(0, 47) + "..."
        : generatedTitle;

    // Remove quotes if the model wrapped the title in them
    return finalTitle.replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Error generating conversation title:", error);
    return "New Conversation";
  }
};
