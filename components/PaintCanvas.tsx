"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Eraser, Undo2, Redo2, Sprout } from "lucide-react";

const COLORS = [
  "#FF8DBC",
  "#FF4C58",
  "#C167EE",
  "#4466FA",
  "#44B5FD",
  "#76DEFE",
  "#01AC37",
  "#72FF26",
  "#FFFB00",
  "#FFA502"
];

const CANVAS_SIZE = 380;
type Tool = "pencil" | "eraser";

interface PaintCanvasProps {
  onPlant: (base64Png: string) => Promise<void>;
}

export default function PaintCanvas({ onPlant }: PaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState(COLORS[0]);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Leave the canvas transparent - a white fill here would get baked into
    // every exported PNG as an opaque square behind the flower.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getContext() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function pushHistory() {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    setHistory((h) => [...h, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoStack([]);
  }

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    pushHistory();
    drawing.current = true;
    lastPoint.current = getPoint(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = getContext();
    if (!ctx || !lastPoint.current) return;

    const point = getPoint(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = tool === "eraser" ? 18 : 7;

    if (tool === "eraser") {
      // Erase to transparency instead of painting white over the drawing.
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  }

  function handlePointerUp() {
    drawing.current = false;
    lastPoint.current = null;
  }

  function undo() {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || history.length === 0) return;
    const previous = history[history.length - 1];
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(previous, 0, 0);
    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [...r, current]);
  }

  function redo() {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(next, 0, 0);
    setRedoStack((r) => r.slice(0, -1));
    setHistory((h) => [...h, current]);
  }

  function clearCanvas() {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    pushHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handlePlant() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      await onPlant(dataUrl);
      clearCanvas();
      setMessage("Planted! Check your garden.");
    } catch (err) {
      console.error("Plant failed:", err);
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-lg border-2 border-brand-black bg-white overflow-hidden w-full max-w-xl"
      style={{ boxShadow: "-6px 6px 0px 0px #2E2E2E" }}
    >
      <div className="flex items-center justify-between bg-brand-lavendar px-4 py-2 border-b-2 border-brand-black">
        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full bg-brand-blue border-brand-black border" />
          <span className="h-4 w-4 rounded-full bg-brand-red border-brand-black border" />
          <span className="h-4 w-4 rounded-full bg-brand-purple border-brand-black border" />
        </div>
        <span className="font-urbane text-lg">Paint</span>
      </div>

      <div className="flex gap-4 p-4">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            aria-label="Pencil"
            onClick={() => setTool("pencil")}
            className={`h-9 w-9 rounded border-2 border-brand-black flex items-center justify-center ${
              tool === "pencil" ? "bg-brand-pink" : "bg-white"
            }`}
          >
            <Pencil size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Eraser"
            onClick={() => setTool("eraser")}
            className={`h-9 w-9 rounded border-2 border-brand-black flex items-center justify-center ${
              tool === "eraser" ? "bg-brand-pink" : "bg-white"
            }`}
          >
            <Eraser size={18} strokeWidth={2} />
          </button>

          <div className="grid grid-cols-2 gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`h-5 w-5 border ${
                  color === c ? "ring-2 ring-brand-black" : "border-brand-black/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Undo"
            onClick={undo}
            disabled={history.length === 0}
            className="h-9 w-9 rounded border-2 border-brand-black flex items-center justify-center bg-white disabled:opacity-40"
          >
            <Undo2 size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Redo"
            onClick={redo}
            disabled={redoStack.length === 0}
            className="h-9 w-9 rounded border-2 border-brand-black flex items-center justify-center bg-white disabled:opacity-40"
          >
            <Redo2 size={18} strokeWidth={2} />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="border-2 border-brand-black/70 rounded touch-none bg-white flex-1"
        />
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        {message && <p className="font-spline text-sm">{message}</p>}
        <button
          type="button"
          onClick={handlePlant}
          disabled={submitting}
          className="ml-auto flex items-center gap-1.5 rounded-md border-2 border-brand-black bg-[#B3FFB9] px-4 py-1.5 font-urbane text-lg disabled:opacity-50"
          style={{ boxShadow: "-4px 4px 0px 0px #2E2E2E" }}
        >
          <Sprout size={18} strokeWidth={2} />
          {submitting ? "Planting..." : "Plant"}
        </button>
      </div>
    </div>
  );
}
