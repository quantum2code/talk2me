import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "../components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "shared/src/constants";
import { useProcessAudio } from "../hooks/useProcessAudio";
import { type ErrorDetail, type Message } from "shared/src/types";
import MessageContextWindow from "../components/MessageContextWindow";
import { useConversation } from "../hooks/useConversation";
import { useFetchMessages } from "../hooks/useFetchMessages";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { useNavigate } from "react-router";
import RecordingBtn from "@/components/RecordingBtn";

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, processAudio, setMessages } = useProcessAudio();
  const [messageErrorCtx, setMessageErrorCtx] = useState<ErrorDetail | null>(
    null
  );
  const { conversationId, setConversationId } = useConversation();
  const { conversationsQuery, messagesQuery } = useFetchMessages({
    currentConversationId: conversationId,
  });
  const [isCtxWindowOpen, setIsCtxWindowOpen] = useState(true);
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

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
      setMessages(messagesQuery.data!);
    }
  }, [messagesQuery.data, setMessages]);

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

        if (conversationId) {
          await processAudio(audioBlob, conversationId!);
        }

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
    navigate("/chat/");
    console.log("NEW CONVERSATION STARTED");
  };

  const data = {
    user: {
      name: "John Doe",
      email: "john@doe.org",
      avatar: "",
    },
    navMain: [
      {
        title: "Conversations",
        items: conversationsQuery.data,
      },
    ],
  };

  return (
    <div className="flex h-screen w-screen bg-background">
      <SidebarProvider>
        <AppSidebar startConversation={startNewConversation} data={data} />
        <SidebarInset className="bg-gradient-to-b from-accent/60 to-accent/10 relative">
          <ChatWindow
            messages={messages}
            setIsCtxWindowOpen={setIsCtxWindowOpen}
            setMessageErrorCtx={setMessageErrorCtx}
            isCtxWindowOpen={isCtxWindowOpen}
          />
          {!stream && (
            <Button className="fixed right-2 top-2 z-100" onClick={getStream}>
              Request Mic Permission
            </Button>
          )}
          <div className="absolute inset-x-0 w-full z-10 bottom-0 h-[20rem] pointer-events-none">
            {isRecording && <AudioVisualizer stream={stream} />}
          </div>
          <RecordingBtn
            isRecording={isRecording}
            stopRecording={stopRecording}
            startRecording={startRecording}
            recorder={recorder}
          />
          {/* <div className="fixed right-2 z-60 bottom-2 flex gap-2">
            <Button
              onClick={startRecording}
              disabled={!recorder}
              className="flex gap-2 items-center"
            >
              {isRecording || !stream ? <BsRecordCircle /> : <BsPauseCircle />}
              Start
            </Button>
            <Button onClick={stopRecording} disabled={!recorder}>
              Stop
            </Button>
          </div> */}
          <MessageContextWindow
            messageErrorCtx={messageErrorCtx}
            isCtxWindowOpen={isCtxWindowOpen}
            setIsCtxWindowOpen={setIsCtxWindowOpen}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
