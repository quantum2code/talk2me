import mongoose, { Schema } from "mongoose";

const ErrorDetailSchema = new Schema(
  {
    original: String,
    corrected: String,
    error: String,
    type: { type: String, enum: ["grammar", "vocabulary"] },
  },
  { _id: false }
);

const TranscriptSpanSchema = new Schema(
  {
    text: String,
    isError: Boolean,
    error: { type: ErrorDetailSchema, default: null },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "transcribed", "complete", "failed"],
      required: true,
    },

    // User fields
    transcript: { type: String, default: "" },
    aiAnalysis: {
      type: new Schema(
        {
          spans: {
            type: [TranscriptSpanSchema],
          },
          critique: { type: String },
          suggestions: { type: [String], default: [] },
          score: { type: Number, min: 0, max: 100 },
        },
        { _id: false }
      ),
    },
  },
  { timestamps: true }
);

const ConversationSchema = new Schema(
  {
    title: { type: String, default: "New Conversation" },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", MessageSchema);
export const ConversationModel = mongoose.model(
  "Conversation",
  ConversationSchema
);
