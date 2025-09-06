import React, { type ReactNode } from "react";
import { IoStar } from "react-icons/io5";

import {
  type AIAnalysis,
  type ErrorDetail,
  type Message,
} from "shared/src/types";

const CompChatBubble = ({ msg }: { msg: Message }) => {
  switch (msg.status) {
    case "pending":
      return <ChatBubble>Analyzing...</ChatBubble>;
    case "transcribed":
      return <ChatBubble>{msg.transcript}</ChatBubble>;
    case "analyzed":
      return (
        <div className="flex flex-col gap-5">
          <ChatBubble>{msg.transcript}</ChatBubble>
          {msg.aiAnalysis && <AIChatBubble msg={msg.aiAnalysis} />}
        </div>
      );
    case "failed":
      return (
        <ChatBubble>
          <div className="text-red-500">Error</div>
        </ChatBubble>
      );
  }
};

const ChatBubble = ({ children }: { children: ReactNode }) => (
  <div className="leading-10 text-xl font-medium bg-linear-0 from-white/6 to-white/3 p-6 rounded-4xl max-w-[35rem] self-end backdrop-blur-2xl">
    {children}
  </div>
);

const AIChatBubble = ({ msg }: { msg: AIAnalysis }) => (
  <div className="leading-9 text-lg bg-linear-0 from-black/20 to-black/8 p-3 px-6 rounded-4xl max-w-[35rem] self-start my-4 backdrop-blur-2xl">
    <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full mb-2">
      <IoStar className="inline text-2xl" />
      <p>{msg.score}</p>
    </div>
    <div className=" text-xl font-medium">{msg.critique}</div>
    <ul className="my-2 flex flex-col gap-2 opacity-60">
      {msg.suggestions?.map((s, idx) => (
        <li key={idx} className="flex items-center gap-3 pl-3">
          <span className="border-3 border-white w-4 h-4 rounded-full"></span>
          {s}
        </li>
      ))}
    </ul>
  </div>
);

export default CompChatBubble;
