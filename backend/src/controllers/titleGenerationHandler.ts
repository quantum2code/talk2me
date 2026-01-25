import { Request, Response } from "express";
import { ConversationModel } from "../db/schema";
import { generateConversationTitle } from "../utils/generateConversationTitle";
import z from "zod";

const requestSchema = z.object({
  conversationId: z.string(),
  transcript: z.string(),
});

export const titleGenerationHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request parameters",
        details: parsed.error.message,
      });
    }

    const { conversationId, transcript } = parsed.data;

    // Check if conversation exists
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Only generate title if it's still the default
    if (conversation.title !== "New Conversation") {
      return res.status(200).json({
        title: conversation.title,
        message: "Title already set",
      });
    }

    // Generate new title
    const newTitle = await generateConversationTitle(transcript);

    // Update conversation with new title
    conversation.title = newTitle;
    await conversation.save();

    return res.status(200).json({
      title: newTitle,
      conversationId: conversationId,
    });
  } catch (error) {
    console.error("Error in title generation handler:", error);
    return res.status(500).json({
      error: "Failed to generate conversation title",
    });
  }
};
