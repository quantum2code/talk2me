import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "../components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "shared/src/constants";
import { useProcessAudio } from "../hooks/useProcessAudio";
import { useMicrophone } from "../hooks/useMicrophone";
import { useFetchMessages } from "../hooks/useFetchMessages";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { startConversation } from "@/utils/axios";
import { useNavigate } from "react-router";
import RecordingBtn from "@/components/RecordingBtn";
import { authClient } from "@/hooks/useAuth";

function App() {
  const { stream, requestPermission } = useMicrophone();
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { processAudio } = useProcessAudio();
  const [conversations, setConversations] = useState<
    { title: string; id: string; url: string }[]
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { conversationsQuery } = useFetchMessages({
    currentConversationId: conversationId!,
  });
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const getConversationId = async () => {
    let tempId = conversationId;
    if (!tempId) {
      tempId = await startConversation();
      setConversationId(tempId);
      localStorage.setItem("conversationId", tempId);
      return tempId;
    }
    return tempId;
  };

  useEffect(() => {
    if (conversationsQuery.data) {
      setConversations(
        conversationsQuery.data.map((conv) => ({
          title: conv.title,
          id: conv.id,
          url: "#",
        })),
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

        const tempId = await getConversationId();
        await processAudio(audioBlob, tempId!);
        navigate(`/c/${tempId}`);

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
        <AppSidebar startConversation={startNewConversation} data={data} />
        <SidebarInset className="bg-gradient-to-b from-accent/60 to-accent/10 relative">
          <ChatWindow
            setIsCtxWindowOpen={null}
            setMessageErrorCtx={null}
            isCtxWindowOpen={null}
            messages={[]}
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
          {/* Btn */}
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
          <div className="absolute top-6 left-8 z-20">
            <h1 className="text-2xl font-semibold p-20 text-foreground/60">
              <span className="text-foreground">
                Hello, {authClient.useSession().data?.user?.name || "Guest"},
              </span>
              What's in your mind?
            </h1>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
