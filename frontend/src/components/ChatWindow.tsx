import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CompChatBubble from "./MessageBubble";

const ChatWindow = ({ messages }) => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      <div className="h-full z-20 w-full px-[10rem] p-5 overflow-y-scroll border">
        <div className="flex flex-col gap-5">
          {messages &&
            messages.map((msg, idx) => (
              <div key={msg.messageId + idx}>
                <CompChatBubble msg={msg} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
