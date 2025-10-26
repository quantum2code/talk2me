import React, { useEffect, useRef, useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CompChatBubble from "./MessageBubble";
import { IoStar } from "react-icons/io5";
import { SlidingNumber } from "./ui/sliding-number";

const ChatWindow = ({
  messages,
  setIsCtxWindowOpen,
  setMessageErrorCtx,
  isCtxWindowOpen,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(
    messages.reduce((sum, m) => sum + (m.aiAnalysis?.score || 0), 0)
  );

  useEffect(() => {
    setScore(messages.reduce((sum, m) => sum + (m.aiAnalysis?.score || 0), 0));
  }, [messages]);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.map((m) => `${m.messageId}-${m.status}`).join("|")]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-background/20 backdrop-blur-2xl fixed w-full z-90 border-b">
        <SidebarTrigger className="-ml-1" />
        <div className=" text-lg font-medium font-mono flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 cursor-pointer active:scale-98 select-none active:shadow-[0_0px_50px_rgba(247,_199,_67,_0.2)] duration-150 will-change-[scale] border-2 border-[#f7c743]">
          <IoStar color="#f7c743" />
          <SlidingNumber value={score} />
        </div>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      <div className="h-full z-20 w-full px-[10rem] p-5 overflow-y-scroll border">
<<<<<<< HEAD
        <div className="flex flex-col gap-5">
          {messages
            ? messages.map((msg, idx) => (
                <div key={msg.messageId + idx}>
                  <CompChatBubble msg={msg} />
                </div>
              ))
            : null}
=======
        <div className="flex flex-col gap-5 mt-16">
          {messages &&
            messages.map((msg, idx) => (
              <div key={msg.messageId + idx}>
                <CompChatBubble
                  isCtxWindowOpen={isCtxWindowOpen}
                  setIsCtxWindowOpen={setIsCtxWindowOpen}
                  setMessageErrorCtx={setMessageErrorCtx}
                  msg={msg}
                />
              </div>
            ))}
          <div ref={bottomRef} className="h-[8rem]" />
>>>>>>> working
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
