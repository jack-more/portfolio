"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  title?: string;
  defaultX: number;
  defaultY: number;
  width?: number;
  maxHeight?: number;
  children: React.ReactNode;
}

export default function DraggableCard({ title, defaultX, defaultY, width: defaultWidth = 400, maxHeight, children }: Props) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ w: defaultWidth, h: 0 }); // h=0 means auto
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startCardPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a")) return;

    setDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  // Resize
  const onResizeDown = useCallback((edge: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(edge);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { w: size.w, h: cardRef.current?.offsetHeight || 0 };
    startCardPos.current = { x: pos.x, y: pos.y };
  }, [size.w, pos]);

  useEffect(() => {
    if (!resizing) return;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      setSize(prev => {
        let newW = prev.w;
        let newH = prev.h || startSize.current.h;

        if (resizing.includes("e")) newW = Math.max(200, startSize.current.w + dx);
        if (resizing.includes("w")) newW = Math.max(200, startSize.current.w - dx);
        if (resizing.includes("s")) newH = Math.max(60, startSize.current.h + dy);
        if (resizing.includes("n")) newH = Math.max(60, startSize.current.h - dy);

        return { w: newW, h: newH };
      });

      setPos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (resizing.includes("w")) newX = startCardPos.current.x + dx;
        if (resizing.includes("n")) newY = startCardPos.current.y + dy;

        return { x: newX, y: newY };
      });
    };

    const onUp = () => setResizing(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  return (
    <div
      ref={cardRef}
      className={`card ${dragging ? "card-dragging" : ""} ${resizing ? "card-resizing" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        ...(size.h > 0 ? { height: size.h, overflow: "auto" } : {}),
      }}
    >
      {title && (
        <div className="card-header" onMouseDown={onMouseDown}>
          <span className="card-title">{title}</span>
        </div>
      )}
      <div
        className={title ? "card-body" : "card-body card-body-notitle"}
        onMouseDown={title ? undefined : onMouseDown}
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        {children}
      </div>

      {/* Resize handles */}
      <div className="resize-handle resize-e" onMouseDown={onResizeDown("e")} />
      <div className="resize-handle resize-s" onMouseDown={onResizeDown("s")} />
      <div className="resize-handle resize-se" onMouseDown={onResizeDown("se")} />
      <div className="resize-handle resize-w" onMouseDown={onResizeDown("w")} />
      <div className="resize-handle resize-n" onMouseDown={onResizeDown("n")} />
      <div className="resize-handle resize-nw" onMouseDown={onResizeDown("nw")} />
      <div className="resize-handle resize-ne" onMouseDown={onResizeDown("ne")} />
      <div className="resize-handle resize-sw" onMouseDown={onResizeDown("sw")} />
    </div>
  );
}
