import { useState, useEffect, useCallback } from "react";

// Global stream instance persists across component unmounts
let globalStream: MediaStream | null = null;

export const useMicrophone = () => {
  const [stream, setStream] = useState<MediaStream | null>(globalStream);
  const [hasPermission, setHasPermission] = useState(globalStream !== null);

  const requestPermission = useCallback(async () => {
    // If we already have a stream, just return it
    if (globalStream) {
      setStream(globalStream);
      setHasPermission(true);
      return globalStream;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Store globally so it persists across page changes
      globalStream = userStream;
      setStream(userStream);
      setHasPermission(true);

      return userStream;
    } catch (error) {
      console.error("ERROR getting microphone stream:", error);
      setHasPermission(false);
      throw error;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (globalStream) {
      globalStream.getTracks().forEach((track) => track.stop());
      globalStream = null;
      setStream(null);
      setHasPermission(false);
    }
  }, []);

  // Sync with global stream on mount
  useEffect(() => {
    if (globalStream && !stream) {
      setStream(globalStream);
      setHasPermission(true);
    }
  }, [stream]);

  return {
    stream,
    hasPermission,
    requestPermission,
    stopStream,
  };
};
