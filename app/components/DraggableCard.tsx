"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  title?: string;
  width?: number;
  maxHeight?: number;
  children: React.ReactNode;
}

export default function DraggableCard({ title, width, maxHeight, children }: Props) {
  const [dragged, setDragged] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;

    if (!dragged && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
      setDragged(true);
    }

    setDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
    e.preventDefault();
  }, [dragged]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - offset.current.x + window.scrollX,
        y: e.clientY - offset.current.y + window.scrollY,
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

  const style: React.CSSProperties = dragged
    ? { position: "absolute", left: pos.x, top: pos.y, width: width || undefined, zIndex: dragging ? 10 : 2 }
    : { width: width || undefined };

  return (
    <div
      ref={cardRef}
      className={`card ${dragged ? "card-absolute" : "card-flow"} ${dragging ? "card-dragging" : ""}`}
      style={style}
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
    </div>
  );
}
