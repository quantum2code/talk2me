import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    // could add "userId" here if you want multi-user
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model(
  "Conversation",
  ConversationSchema
);

const ErrorDetailSchema = new Schema({
  original: String,
  corrected: String,
  error: String,
  type: { type: String, enum: ["grammar", "vocabulary"] },
});

const TranscriptSpanSchema = new Schema({
  text: String,
  isError: Boolean,
  error: { type: ErrorDetailSchema, default: null },
});

const MessageSchema = new Schema(
  {
    conversationID: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    role: { type: String, enum: ["user", "ai"], required: true },
    status: {
      type: String,
      enum: ["pending", "complete", "error"],
      required: true,
    },

    // User fields
    transcript: String,
    spans: [TranscriptSpanSchema],

    // AI fields
    critique: String,
    suggestions: [String],
    score: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", MessageSchema);
