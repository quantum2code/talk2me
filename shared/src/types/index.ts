export type Status = "pending" | "transcribed" | "analyzed" | "failed";

export type ErrorDetail = {
  original: string;
  corrected: string;
  error: string;
  type: "grammar" | "vocabulary";
};

export type TranscriptSpans = {
  text: string;
  isError: boolean;
  error?: ErrorDetail | null;
};

export type Message = {
  messageId: string;
  conversationId: string;
  status: Status;
  transcript?: string;
  aiAnalysis?: AIAnalysis;
};

export type AIAnalysis = {
  spans?: TranscriptSpans[];
  critique?: string;
  score?: number;
  suggestions?: string[];
};
