import React, { useCallback, useEffect, useRef } from "react";

const AudioVisualizer = ({
  stream,
  numBars = 100,
  smoothing = 0.8,
  fftSize = 2048,
  minDecibels = -85,
  maxDecibels = -10,
  falloff = 0.05,
  className = "",
}: {
  stream: MediaStream | null;
  numBars?: number;
  smoothing?: number;
  fftSize?: number;
  minDecibels?: number;
  maxDecibels?: number;
  falloff?: number;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const audioCtxRef = useRef<AudioContext>(null);
  const analyserRef = useRef<AnalyserNode>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode>(null);
  const barHeightsRef = useRef<number[]>([]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      if (!stream) return;
      const ctx = new window.AudioContext();
      audioCtxRef.current = ctx;
      await ctx.resume().catch(() => {});

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      analyserRef.current = analyser;
      source.connect(analyser);

      barHeightsRef.current = new Array(numBars).fill(0);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;

      resizeCanvas();

      const bufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);

      function draw() {
        if (!mounted || !ctx2d || !canvas) return;
        analyser.getByteFrequencyData(freqData);

        const { width, height } = canvas;
        ctx2d.clearRect(0, 0, width, height);

        const midX = width / 2;
        const midY = height;
        const barWidth = width / numBars;

        const grad = ctx2d.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0.3, "#801d8d22");
        grad.addColorStop(0.7, "#990da855");
        grad.addColorStop(1, "#d76fe3");
        ctx2d.fillStyle = grad;

        for (let i = 0; i < numBars; i++) {
          const start = Math.floor((i / numBars) * bufferLength);
          const end = Math.floor(((i + 1) / numBars) * bufferLength);
          let sum = 0;
          for (let j = start; j < end; j++) sum += freqData[j];
          const avg = sum / (end - start);

          const normalized = avg / 255;
          const prev = barHeightsRef.current[i] || 0;
          const next =
            normalized > prev ? normalized : Math.max(0, prev - falloff);
          barHeightsRef.current[i] = next;

          const h = next * (height / 2);
          const w = barWidth;

          const x = i * barWidth;

          // Mirror horizontally and vertically
          ctx2d.beginPath();
          ctx2d.roundRect(midX - x - w, midY - 2 * h, w, h * 2);
          ctx2d.fill();

          ctx2d.beginPath();
          ctx2d.rect(midX + x, midY - 2 * h, w, h * 2);
          ctx2d.fill();
        }

        animationRef.current = requestAnimationFrame(draw);
      }

      draw();
    }

    setup();

    return () => {
      mounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
      } catch {}
      sourceRef.current = null;
      analyserRef.current = null;
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend().catch(() => {});
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [
    stream,
    numBars,
    smoothing,
    fftSize,
    minDecibels,
    maxDecibels,
    falloff,
    resizeCanvas,
  ]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  return (
    <div className={`w-full h-full relative pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full z-30 " />
      <div className="absolute bottom-0 w-full h-full z-40 flex backdrop-blur-[10px]"></div>
      <div className="absolute bottom-0 w-full h-full z-50 flex">
        <div
          className="flex-1 h-full  backdrop-blur-2xl 
  [mask-image:linear-gradient(to_right,black,#00000088)] 
  [mask-repeat:repeat-x] [mask-size:40px_100%]"
        ></div>
      </div>
    </div>
  );
};
export default AudioVisualizer;
