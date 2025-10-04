import React, { useState } from "react";
import type { ErrorDetail } from "shared/src/types";
import { IoMdClose } from "react-icons/io";

const MessageContextWindow = ({
  messageErrorCtx,
  isCtxWindowOpen,
  setIsCtxWindowOpen,
}: {
  messageErrorCtx: ErrorDetail | null;
  isCtxWindowOpen: boolean;
  setIsCtxWindowOpen: (value: React.SetStateAction<boolean>) => void;
}) => {
  return (
    <>
      {isCtxWindowOpen && messageErrorCtx && (
        <div className="absolute right-[2rem] h-fit top-[2rem] w-[18rem] bg-white/50 z-70 backdrop-blur-xl rounded-4xl border border-white/30 p-3 flex flex-col text-black">
          <div
            className="w-10 h-10 bg-black/15 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsCtxWindowOpen((prev) => !prev)}
          >
            <IoMdClose />
          </div>
          <h2 className=" uppercase text-red-900 font-semibold mt-3">
            incorrect
          </h2>
          <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
            {messageErrorCtx?.original}
          </p>
          <h2 className=" uppercase text-green-900 font-semibold mt-3">
            Correct
          </h2>
          <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
            {messageErrorCtx?.corrected}
          </p>
          <h2 className=" uppercase text-blue-700 font-semibold mt-3">
            Reason
          </h2>
          <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
            {messageErrorCtx?.error}
          </p>
        </div>
      )}
    </>
  );
};

export default MessageContextWindow;
