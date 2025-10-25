import React from "react";
import type { ErrorDetail } from "shared/src/types";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";

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
      <AnimatePresence>
        {isCtxWindowOpen && messageErrorCtx && (
          <motion.div
            key="ctxWindow"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.9,
              x: 100,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.9,
              x: 100,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 1.5,
            }}
            className="absolute right-[2rem] h-fit top-[6rem] w-[18rem] bg-white/50 z-70 backdrop-blur-xl rounded-4xl border border-white/30 p-3 flex flex-col text-black"
          >
            <div
              className="w-10 h-10 bg-black/15 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsCtxWindowOpen(false)}
            >
              <IoMdClose />
            </div>
            <h2 className="uppercase text-red-900 font-semibold mt-3">
              Incorrect
            </h2>
            <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
              {messageErrorCtx?.original}
            </p>
            <h2 className="uppercase text-green-900 font-semibold mt-3">
              Correct
            </h2>
            <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
              {messageErrorCtx?.corrected}
            </p>
            <h2 className="uppercase text-blue-700 font-semibold mt-3">
              Reason
            </h2>
            <p className="bg-black/15 p-2 rounded-2xl italic mt-2">
              {messageErrorCtx?.error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageContextWindow;
