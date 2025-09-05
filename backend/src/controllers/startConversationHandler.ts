import { Request, Response } from "express";
import { ConversationModel } from "../db/schema";

export const startConversationHandler = async (req: Request, res: Response) => {
  // Logic to start a new conversation
  const newConversation = await ConversationModel.create({
    messages: [],
  });
  return res
    .status(200)
    .json({ conversationID: newConversation._id.toString() });
};
