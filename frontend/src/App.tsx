import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "./components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "shared/src/constants";
import { useProcessAudio } from "./hooks/useProcessAudio";
import { Role, type ErrorDetail } from "shared/src/types";
import MessageBubble from "./components/MessageBubble";
import MessageContextWindow from "./components/MessageContextWindow";
import { useConversation } from "./hooks/useConversation";

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, processAudio } = useProcessAudio();
  const [messageErrorCtx, setMessageErrorCtx] = useState<ErrorDetail | null>(
    null
  );
  const [isCtxWindowOpen, setIsCtxWindowOpen] = useState(true);
  const { conversationID, endConversation, startNewConversation } =
    useConversation();
  const chunksRef = useRef<Blob[]>([]);

  const getStream = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(userStream);
    } catch (e) {
      console.error("ERROR getting stream: ", e);
    }
  };

  useEffect(() => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_FILE_TYPE,
      });
      setRecorder(mediaRecorder);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && e.data.size < MAX_FILE_SIZE) {
          chunksRef.current.push(e.data);
        } else if (e.data.size > MAX_FILE_SIZE) {
          throw new Error("AUDIO FILE MAX SIZE EXCEEDED");
        }
      };
      mediaRecorder.onstart = () => setIsRecording(true);

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(chunksRef.current, {
          type: AUDIO_FILE_TYPE,
        });

        // Use the latest conversationID
        let convID = conversationID;
        if (!convID) {
          convID = await startNewConversation();
        }
        await processAudio(audioBlob, convID);

        chunksRef.current = [];
      };
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);
  const startRecording = () => {
    if (recorder && recorder.state === "inactive") {
      recorder.start();
      console.log("Recording started");
    } else {
      console.error("Recorder not ready or already recording.");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      console.log("Recording stopped");
    } else {
      console.warn("Not currently recording.");
    }
  };

  return (
    <div className="w-screen h-screen relative bg-[#2d0930] inter">
      <div className="absolute h-full overflow-y-scroll z-60 w-full px-[10rem] p-5">
        <div className=" flex flex-col gap-5">
          {messages && (
            <MessageBubble
              messages={messages}
              setMessageErrorCtx={setMessageErrorCtx}
              setIsContextWindowOpen={setIsCtxWindowOpen}
            />
          )}
        </div>
      </div>
      {!stream && (
        <button className="fixed right-2 top-2 z-100" onClick={getStream}>
          Request Mic Permission
        </button>
      )}
      <div className="absolute bottom-0 w-full h-[30rem]">
        {isRecording && <AudioVisualizer stream={stream} />}
      </div>
      <div className="fixed z-60 bottom-2 flex gap-2">
        <button
          onClick={startRecording}
          disabled={!recorder}
          className="flex gap-2 items-center"
        >
          {isRecording || !stream ? <BsRecordCircle /> : <BsPauseCircle />}
          Start
        </button>
        <button onClick={stopRecording} disabled={!recorder}>
          Stop
        </button>
      </div>
      <MessageContextWindow
        messageErrorCtx={messageErrorCtx}
        isCtxWindowOpen={isCtxWindowOpen}
        setIsCtxWindowOpen={setIsCtxWindowOpen}
      />
    </div>
  );
}

export default App;
