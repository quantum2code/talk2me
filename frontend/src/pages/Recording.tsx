import { useState, useEffect, useRef } from "react";
import { BsRecordCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import AudioVisualizer from "../components/AudioVisualizer";
import { AUDIO_FILE_TYPE, MAX_FILE_SIZE } from "../../../shared/src/constants";
import { useProcessAudio } from "../hooks/useProcessAudio";
import { useFetchMessages } from "../hooks/useFetchMessages";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import PracticePage from "../components/recordingPage";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { startConversation } from "@/utils/axios";
import { useNavigate } from "react-router";
import RecordingBtn from "@/components/RecordingBtn";

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
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

        const tempId = await getConversationId();
        await processAudio(audioBlob, tempId!);
        navigate(`/c/${tempId}`);

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
    console.log("NEW CONVERSATION STARTED");
  };

  const data = {
    user: {
      name: session?.user?.name || "John Doe",
      email: session?.user?.email || "john@doe.org",
      avatar: session?.user?.image || "",
    },
    navMain: [
      {
        title: "Conversations",
        items: conversations,
      },
    ],
  };

  return (
    <div className="flex h-screen w-screen bg-background pt-[0px]">
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
            <Button className="fixed right-2 top-2 z-100" onClick={getStream}>
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
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
