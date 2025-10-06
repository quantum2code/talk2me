import React, { useEffect, useRef } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CompChatBubble from "./MessageBubble";
import type { Message } from "shared/src/types";

const ChatWindow = ({ messages }: { messages: Message[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.map((m) => `${m.messageId}-${m.status}`).join("|")]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-background/20 backdrop-blur-2xl fixed w-full z-90 border-b">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      <div className="h-full z-20 w-full px-[10rem] p-5 overflow-y-scroll border">
        <div className="flex flex-col gap-5 mt-16">
          {messages &&
            messages.map((msg, idx) => (
              <div key={msg.messageId + idx}>
                <CompChatBubble msg={msg} />
              </div>
            ))}
          <div ref={bottomRef} className="h-[8rem]" />
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
