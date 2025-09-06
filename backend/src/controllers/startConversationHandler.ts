import { Request, Response } from "express";
import { ConversationModel } from "../db/schema";

export const startConversationHandler = async (req: Request, res: Response) => {
  const newConv = await ConversationModel.create({});
  const newConvId = newConv._id.toString();
  return res.status(200).json({ conversationId: newConvId });
};
