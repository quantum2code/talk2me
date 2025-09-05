import type { AxiosResponse } from "axios";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

export const BACKEND_URL = "http://localhost:3000";
const AUDIO_FILE_TYPE = "audio/webm;codecs=opus";
export const AudioExtEnum = {
  webm: "webm",
  ogg: "ogg",
} as const;
export type AudioExtEnum = keyof typeof AudioExtEnum;

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioSrc, setAudioSrc] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const fromDataContructor = (
    blob: Blob,
    size: number,
    ext: AudioExtEnum
  ): FormData => {
    const fileName = "recording" + "-" + Date.now() + "." + ext;
    const formData = new FormData();
    formData.append("audioFile", blob, fileName);
    formData.append("size", size.toString());
    return formData;
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
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_FILE_TYPE,
      });
      setRecorder(mediaRecorder);

      //ondataavailable logic
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      //onStop logic
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: AUDIO_FILE_TYPE,
        });

        //construct the formdata
        const formData = fromDataContructor(
          audioBlob,
          audioBlob.size,
          AudioExtEnum.webm
        );
        console.log(formData);

        try {
          const result: AxiosResponse = await axios.post(
            `${BACKEND_URL}/api/v1/transcribe`,
            formData
          );

          setResult(JSON.stringify(result?.data?.output));
        } catch (error) {
          console.error("Error uploading file:", error);
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

  return (
    <div className="w-screen flex flex-col gap-[5rem] items-center">
      <h3 className="text-3xl">Transcribe</h3>
      <div className="flex flex-col items-center gap-6">
        {
          <p className="w-[20rem] min-h-[10rem] max-h-[30rem] overflow-y-scroll  border-1 text-sm p-3 break-words">
            {result}
          </p>
        }
        <div className="flex gap-2">
          <button onClick={startRecording} disabled={!recorder}>
            Start
          </button>
          <button onClick={stopRecording} disabled={!recorder}>
            Stop
          </button>
        </div>
        {!stream && (
          <button className="absolute right-2 top-2" onClick={getStream}>
            Request Mic Permission
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
