import React from "react";
import { IoStar } from "react-icons/io5";

import {
  Role,
  type AIMessage,
  type ChatMessage,
  type ErrorDetail,
  type UserMessage,
} from "shared/src/types";
const UserChatBubble = ({
  msg,
  setMessageErrorCtx,
  setIsContextWindowOpen,
}: {
  msg: UserMessage;
  setMessageErrorCtx: (value: React.SetStateAction<ErrorDetail | null>) => void;
  setIsContextWindowOpen: (value: React.SetStateAction<boolean>) => void;
}) => (
  <div className="leading-10 text-xl font-medium bg-linear-0 from-white/6 to-white/3 p-6 rounded-4xl max-w-[35rem] justify-self-end">
    {msg.spans &&
      msg.spans.map((span, idx) => {
        if (span.isError)
          return (
            <span
              key={span.text + idx}
              className="bg-[#63031b88] rounded-lg p-1 mx-0.5 outline outline-[#63031b] cursor-pointer"
              onClick={() => {
                setMessageErrorCtx(span.error);
                console.log("SET ERROR CONTEXT");
                setIsContextWindowOpen(() => true);
              }}
            >
              {span.text}
            </span>
          );
        else return <span key={span.text + idx}>{span.text}</span>;
      })}
  </div>
);

const AIChatBubble = ({ msg }: { msg: AIMessage }) => (
  <div className="leading-9 text-lg bg-linear-0 from-black/20 to-black/8 p-3 px-6 rounded-4xl max-w-[35rem] justify-self-start my-4">
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

const MessageBubble = ({
  messages,
  setMessageErrorCtx,
  setIsContextWindowOpen,
}: {
  messages: ChatMessage[];
  setMessageErrorCtx: (value: React.SetStateAction<ErrorDetail | null>) => void;
  setIsContextWindowOpen: (value: React.SetStateAction<boolean>) => void;
}) => {
  return messages.map((msg, idx) =>
    msg.role === Role.User ? (
      <div key={msg.id + idx} className="w-full">
        {msg.spans ? (
          <UserChatBubble
            msg={msg}
            setMessageErrorCtx={setMessageErrorCtx}
            setIsContextWindowOpen={setIsContextWindowOpen}
          />
        ) : (
          <div className=" text-xl font-medium">{msg.transcript}</div>
        )}
      </div>
    ) : (
      <div key={msg.id + idx}>
        <AIChatBubble msg={msg} />
      </div>
    )
  );
};

export default MessageBubble;
