"use client";

import { useRef, useEffect, useCallback } from "react";

const CELL = 10;
const COLOR = "rgba(0,0,0,0.1)";

export default function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const filled = useRef<Set<string>>(new Set());
  const lastCell = useRef<{ cx: number; cy: number } | null>(null);

  const fillCell = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const key = `${cx},${cy}`;
    if (filled.current.has(key)) return;
    filled.current.add(key);

    const sx = cx * CELL - window.scrollX;
    const sy = cy * CELL - window.scrollY;
    ctx.fillStyle = COLOR;
    ctx.fillRect(sx, sy, CELL, CELL);
  }, []);

  // Bresenham line between two grid cells so fast drags don't skip
  const paintLine = useCallback((x: number, y: number) => {
    const cx = Math.floor((x + window.scrollX) / CELL);
    const cy = Math.floor((y + window.scrollY) / CELL);

    if (lastCell.current) {
      const { cx: x0, cy: y0 } = lastCell.current;
      let dx = Math.abs(cx - x0);
      let dy = Math.abs(cy - y0);
      const sx = x0 < cx ? 1 : -1;
      const sy = y0 < cy ? 1 : -1;
      let err = dx - dy;
      let px = x0;
      let py = y0;

      while (true) {
        fillCell(px, py);
        if (px === cx && py === cy) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; px += sx; }
        if (e2 < dx) { err += dx; py += sy; }
      }
    } else {
      fillCell(cx, cy);
    }

    lastCell.current = { cx, cy };
  }, [fillCell]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR;

    filled.current.forEach((key) => {
      const [cx, cy] = key.split(",").map(Number);
      const sx = cx * CELL - window.scrollX;
      const sy = cy * CELL - window.scrollY;
      ctx.fillRect(sx, sy, CELL, CELL);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };

    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target !== canvas) return;
      drawing.current = true;
      lastCell.current = null;
      paintLine(e.clientX, e.clientY);
    };

    const onMove = (e: MouseEvent) => {
      if (!drawing.current) return;
      paintLine(e.clientX, e.clientY);
    };

    const onUp = () => {
      drawing.current = false;
      lastCell.current = null;
    };

    const onScroll = () => redraw();

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, [paintLine, redraw]);

  return <canvas ref={canvasRef} className="draw-canvas" />;
}
