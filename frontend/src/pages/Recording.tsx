import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "../components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "../../../shared/src/constants";
import { useProcessAudio } from "../hooks/useProcessAudio";
import { type ErrorDetail } from "../../../shared/src/types";
import MessageContextWindow from "../components/MessageContextWindow";
import { useConversation } from "../hooks/useConversation";
import { useFetchMessages } from "../hooks/useFetchMessages";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { useParams } from "react-router";

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, processAudio, setMessages } = useProcessAudio();
  const [conversations, setConversations] = useState<
    { title: string; id: string; url: string }[]
  >([]);
  const [messageErrorCtx, setMessageErrorCtx] = useState<ErrorDetail | null>(
    null
  );
  const { conversationId, setConversationId } = useConversation();
  const { conversationsQuery, messagesQuery } = useFetchMessages({
    currentConversationId: conversationId,
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
    console.log("conv id: " + conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    if (conversationsQuery.data) {
      setConversations(
        conversationsQuery.data.map((conv) => ({
          title: conv.title,
          id: conv.id,
          url: "#",
        }))
      );
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
        console.log(conversationId);

        await processAudio(audioBlob, conversationId);

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

  const data = {
    user: {
      name: "John Doe",
      email: "john@doe.org",
      avatar: "",
    },
    navMain: [
      {
        title: "Conversations",
        items: conversations,
      },
    ],
  };

  return (
    <div className="flex h-screen w-screen bg-background">
      <SidebarProvider>
        <AppSidebar data={data} />
        <SidebarInset className="bg-accent-2/50">
          <ChatWindow messages={messages} />
          {!stream && (
            <Button className="fixed right-2 top-2 z-100" onClick={getStream}>
              Request Mic Permission
            </Button>
          )}
          <div className="fixed bottom-0 w-full h-[20rem] pointer-events-none">
            {isRecording && <AudioVisualizer stream={stream} />}
          </div>
          <div className="fixed right-2 z-60 bottom-2 flex gap-2">
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
          </div>
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
