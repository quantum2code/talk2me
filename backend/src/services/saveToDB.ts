import { ConversationModel, MessageModel } from "../db/schema";

export async function addUserMessage(
  conversationID: string,
  transcript: string,
  spans?: []
) {
  const message = await MessageModel.create({
    conversationID,
    role: "user",
    status: "pending",
    transcript,
    spans: spans || [],
  });

  await ConversationModel.findByIdAndUpdate(conversationID, {
    $push: { messages: message._id },
  });

  return message;
}

export async function addAIMessage(
  conversationID: string,
  critique: string,
  suggestions: string[],
  score: number = 0
) {
  const message = await MessageModel.create({
    conversationID,
    role: "ai",
    status: "complete",
    critique,
    suggestions: suggestions || [],
    score,
  });

  await ConversationModel.findByIdAndUpdate(conversationID, {
    $push: { messages: message._id },
  });

  return message;
}
