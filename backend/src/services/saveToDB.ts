import { AIAnalysis, Status } from "shared/src/types";
import { MessageModel } from "../db/schema";

export async function addMessage(conversationId: string, transcript: string) {
  const message = await MessageModel.create({
    conversationId,
    status: "pending",
    transcript,
  });
  return message;
}

export async function updateMessage(
  messageId: string,
  status: Status,
  aiAnalysis?: AIAnalysis
) {
  const updateData: any = { status };
  if (aiAnalysis !== undefined) updateData.aiAnalysis = aiAnalysis;
  const message = await MessageModel.findByIdAndUpdate(messageId, updateData, {
    new: true,
  });
  return message;
}
