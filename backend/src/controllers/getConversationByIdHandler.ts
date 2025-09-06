import { Request, Response } from "express";
import { MessageModel } from "../db/schema";

export const getConversationByIdHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  // Logic to get a conversation by ID
  const dbRes = await MessageModel.find({ conversationId: id }).lean();
  const messages = dbRes.map((msg) => ({
    messageId: msg._id.toString(),
    conversationId: msg.conversationId,
    transcript: msg.transcript,
    aiAnalysis: msg.aiAnalysis,
    status: msg.status,
  }));
  if (!messages) throw new Error("Conversation not found");
  res.status(200).json(messages);
};
