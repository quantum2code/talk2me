import React, { type ReactNode } from "react";
import { IoStar } from "react-icons/io5";

import {
  type AIAnalysis,
  type ErrorDetail,
  type Message,
<<<<<<< HEAD
} from "../../../shared/src/types";
=======
} from "shared/src/types";
import { Separator } from "./ui/separator";
>>>>>>> working

const CompChatBubble = ({
  msg,
  isCtxWindowOpen,
  setIsCtxWindowOpen,
  setMessageErrorCtx,
}: {
  msg: Message;
  isCtxWindowOpen: boolean;
  setIsCtxWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageErrorCtx: React.Dispatch<React.SetStateAction<ErrorDetail | null>>;
}) => {
  switch (msg.status) {
    case "pending":
      return <ChatBubble>Analyzing...</ChatBubble>;
    case "transcribed":
      return <ChatBubble>{msg.transcript}</ChatBubble>;
    case "analyzed":
      return (
        <div className="flex flex-col gap-5">
          <ChatBubble>
            {msg.aiAnalysis &&
              msg.aiAnalysis.spans?.map((span, idx) => {
                if (span.isError)
                  return (
                    <span
                      key={span.text + idx}
                      className={`${
                        span.error?.type === "grammar"
                          ? "bg-red-500/20  outline-red-500/50"
                          : "bg-amber-300/20 outline-amber-400/50"
                      }  px-2 py-0.5 hover:text-[16.5px] cursor-pointer duration-200 rounded-sm outline-2 shadow-md`}
                      onClick={() => {
                        setMessageErrorCtx({
                          original: span.error?.original,
                          corrected: span.error?.corrected,
                          error: span.error?.error,
                          type: span.error?.type,
                        });
                        setIsCtxWindowOpen(true);
                      }}
                    >
                      {span.text}
                    </span>
                  );
                else
                  return (
                    <span key={span.text + idx} className="">
                      {span.text}
                    </span>
                  );
              })}
          </ChatBubble>
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
  <div className=" text-white leading-8 text-[16px] font-light bg-linear-0 from-white/6 to-white/3 p-4 rounded-4xl max-w-[30rem] self-end backdrop-blur-2xl border hover:scale-[99.8%] duration-100 will-change-[scale]">
    {children}
  </div>
);

const AIChatBubble = ({ msg }: { msg: AIAnalysis }) => (
  <div className="text-white leading-8 text-[16px] bg-linear-0 from-black/20 to-black/8 p-4 px-5 rounded-4xl max-w-[40rem] self-start my-4 backdrop-blur-2xl border hover:scale-[99.8%] duration-100">
    <div className="flex items-center gap-2 font-mono bg-white/10 w-fit px-3 py-1 rounded-full mb-2 cursor-pointer">
      <IoStar className="inline text-lg" />
      <p>{msg.score}</p>
    </div>
    <div className=" text-[16px] font-regular">{msg.critique}</div>
    <Separator className="my-3" />
    <ul className=" flex flex-col gap-2 opacity-60">
      {msg.suggestions?.map((s, idx) => (
        <li key={idx} className="flex items-center gap-3 pl-3 font-light">
          <span className="border-2 border-white w-3 h-3 rounded-full"></span>
          {s}
        </li>
      ))}
    </ul>
  </div>
);

export default CompChatBubble;
