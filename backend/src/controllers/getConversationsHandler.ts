import { Request, Response } from "express";
import { ConversationModel } from "../db/schema";

export const getConversationsHandler = async (req: Request, res: Response) => {
  const dbRes = await ConversationModel.find({}).select("_id title").lean();
  if (!dbRes) throw new Error("No conversations found");

  const conversations = dbRes.map((conv) => {
    return {
      id: conv._id.toString(),
      title: conv.title || "Untitled Conversation",
    };
  });
  res.status(200).json(conversations);
};
