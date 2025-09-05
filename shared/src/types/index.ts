import z from "zod";

export enum Role {
  User = "user",
  AI = "ai",
}

export enum Status {
  Pending = "pending",
  Completed = "complete",
  Error = "error",
}

export type ErrorDetail = {
  original: string;
  corrected: string;
  error: string;
  type: "grammar" | "vocabulary";
};

// Conversation
export type Conversation = {
  id: string;
  messages: Message[];
};

export type TranscriptSpans = {
  text: string;
  isError: boolean;
  error: ErrorDetail | null;
};

// Message
export type Message = {
  conversationID: string;
  id: string;
  role: Role;
  status: Status;
};

export type AIMessage = Message & {
  role: Role.AI;
  critique?: string;
  suggestions?: string[];
  score?: number;
};

export type UserMessage = Message & {
  role: Role.User;
  transcript?: string;
  spans?: TranscriptSpans[];
};

export type ChatMessage = UserMessage | AIMessage;
