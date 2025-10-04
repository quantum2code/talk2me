import React, { useEffect } from "react";
import { data } from "../data";
import { buildResultArr } from "../utils/text";
import { motion, stagger, useAnimate } from "motion/react";

interface TextVisualizerInput {
  transcription: string;
  correctionArr: typeof data.aiResponse.correctionArr;
  className?: string;
}

const TextVisualizer = ({
  transcription,
  correctionArr,
  className,
}: TextVisualizerInput) => {
  const [scope, animate] = useAnimate();
  useEffect(() => {
    startAnimate();
  }, [transcription]);

  const startAnimate = async () => {
    const phrase = document.querySelectorAll(".phrase");
    const word = document.querySelectorAll(".word");
    await animate(
      word,
      {
        opacity: 1,
        filter: "blur(0px)",
      },
      {
        duration: 0.3,
        ease: "easeInOut",
        delay: stagger(0.06),
      }
    );
    await animate(
      phrase,
      {
        backgroundColor: "oklab(0.577 0.217662 0.112464 / 0.2)",
        outlineColor: "oklab(0.577 0.217662 0.112464 / 0.7)",
      },
      {
        duration: 0.3,
        ease: "easeInOut",
        delay: stagger(0.1),
      }
    );
  };
  return (
    <div
      className={`font-medium text-white/60 text-[20px] leading-10 rounded-2xl  ${className}`}
      ref={scope}
    >
      {buildResultArr &&
        buildResultArr(transcription, correctionArr).map((phrase, idx) =>
          phrase.status === "incorrect" ? (
            <motion.span
              key={idx}
              className="phrase bg-red-600/0 rounded-lg px-2 py-1.5 
               hover:text-neutral-50 cursor-pointer hover:shadow-xl 
               shadow-sm outline outline-[#00000000] font-medium duration-200 mx-1"
            >
              {phrase.string.map((word, idx) => (
                <motion.span
                  key={word + idx}
                  ref={scope}
                  style={{ opacity: 0, filter: "blur(10px)" }}
                  className="word mr-1 hover:bg-white/20 rounded-sm cursor-pointer inline-block leading-7"
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          ) : (
            <motion.span key={idx}>
              {phrase.string.map((word, idx) => (
                <motion.span
                  key={word + idx}
                  ref={scope}
                  style={{ opacity: 0, filter: "blur(10px)" }}
                  className="word mr-1 hover:bg-white/20 hover:text-white 
                   rounded-sm cursor-pointer hover:shadow-xl inline-block leading-7"
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          )
        )}
    </div>
  );
};

export default React.memo(TextVisualizer);
