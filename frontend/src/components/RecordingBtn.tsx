import React from "react";
import { Button } from "./ui/button";
import { BsPauseCircle, BsRecordCircle } from "react-icons/bs";

const RecordingBtn = ({
  isRecording,
  startRecording,
  stopRecording,
  recorder,
}: {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recorder: MediaRecorder | null;
}) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-fit z-60 bottom-0 p-3 border-1 border-neutral-800 bg-neutral-900 pb-4 flex gap-2 rounded-t-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={!recorder}
        variant={"cta"}
        className="flex gap-2 items-center rounded-full"
      >
        {isRecording ? <BsRecordCircle /> : <BsPauseCircle />}
        {isRecording ? "Stop" : "Start"}
      </Button>
    </div>
  );
};

export default RecordingBtn;
