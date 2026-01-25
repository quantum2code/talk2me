import { useState, useEffect, useRef } from "react";
import AudioVisualizer from "../components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "shared/src/constants";
import { useProcessAudio } from "../hooks/useProcessAudio";
import { useMicrophone } from "../hooks/useMicrophone";
import { type ErrorDetail } from "shared/src/types";
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
  const { stream, requestPermission } = useMicrophone();
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, processAudio, setMessages } = useProcessAudio();
  const [messageErrorCtx, setMessageErrorCtx] = useState<ErrorDetail | null>(
    null,
  );
  const { conversationId, setConversationId, ensureConversationId } =
    useConversation();
  const { conversationsQuery, messagesQuery } = useFetchMessages({
    currentConversationId: conversationId,
  });
  const [isCtxWindowOpen, setIsCtxWindowOpen] = useState(true);
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

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

        // Ensure we have a conversation ID
        const convId = await ensureConversationId();
        const isFirstMessage = messages.length === 0;

        // Process audio with navigation callback for first message
        await processAudio(audioBlob, convId, {
          isFirstMessage,
          onFirstMessage: (id) => {
            // Navigate to conversation page after first message
            if (window.location.pathname === "/chat/") {
              navigate(`/c/${id}`);
            }
          },
        });

        chunksRef.current = [];
      };
    }
    return () => {
      // Don't stop stream on unmount - it persists globally
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
        items: conversationsQuery.data?.map((conv) => ({
          ...conv,
          url: `/c/${conv.id}`,
        })),
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
            <Button
              className="fixed right-2 top-2 z-100"
              onClick={requestPermission}
            >
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
