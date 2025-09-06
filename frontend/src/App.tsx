import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "./components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "shared/src/constants";
import { useProcessAudio } from "./hooks/useProcessAudio";
import { type ErrorDetail, type Message } from "shared/src/types";
import MessageContextWindow from "./components/MessageContextWindow";
import CompChatBubble from "./components/MessageBubble";
import { useConversation } from "./hooks/useConversation";
import { useFetchMessages } from "./hooks/useFetchMessages";
import { getConversationById } from "./utils/axios";

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, processAudio, setMessages } = useProcessAudio();
  const [conversations, setConversations] = useState<
    { title: string; id: string }[]
  >([]);
  const [messageErrorCtx, setMessageErrorCtx] = useState<ErrorDetail | null>(
    null
  );
  const { conversationId, setConversationId, getConversationId } =
    useConversation();
  const { conversationsQuery, messagesQuery } = useFetchMessages({
    currentConversationId: conversationId!,
  });
  const [isCtxWindowOpen, setIsCtxWindowOpen] = useState(true);
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
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    if (conversationsQuery.data) {
      setConversations(conversationsQuery.data);
    }
  }, [conversationsQuery.data]);

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

        const convId = await getConversationId();
        await processAudio(audioBlob, convId);

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

  const startNewConversation = () => {
    setConversationId(null);
    localStorage.removeItem("conversationId");
    setMessages([]);
    console.log("NEW CONVERSATION STARTED");
  };

  return (
    <div className="w-screen h-screen relative bg-[#2d0930] inter">
      <div className="fixed top-2 left-2 z-100 text-white flex gap-5 items-center">
        <button onClick={startNewConversation}>Start new conversation</button>
        <p>conv_id: {conversationId}</p>
      </div>
      <div className="absolute h-full overflow-y-scroll z-60 w-full px-[10rem] p-5">
        <div className="h-full fixed left-0 top-20 w-[20rem] flex flex-col gap-3 text-white">
          {conversations &&
            conversations.map((conv, idx) => (
              <li
                key={conv.id + idx}
                className=" list-none bg-white/10 rounded-2xl px-3 p-2 w-fit"
                onClick={() => {
                  setConversationId(conv.id);
                  localStorage.setItem("conversationId", conv.id);
                }}
              >
                {conv.title}
              </li>
            ))}
        </div>
        <div className=" flex flex-col gap-5">
          {messages &&
            messages.map((msg, idx) => (
              <div key={msg.messageId + idx}>
                <CompChatBubble msg={msg} />
              </div>
            ))}
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
