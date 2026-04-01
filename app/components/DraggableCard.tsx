"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  title?: string;
  width?: number;
  maxHeight?: number;
  children: React.ReactNode;
}

export default function DraggableCard({ title, width, maxHeight, children }: Props) {
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // If first drag, record placeholder size and switch to fixed
    if (offset === null && placeholderRef.current) {
      placeholderRef.current.style.width = rect.width + "px";
      placeholderRef.current.style.height = rect.height + "px";
    }

    setOffset({
      x: rect.left,
      y: rect.top,
    });

    dragging.current = true;
    e.preventDefault();
  }, [offset]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setOffset({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const isDetached = offset !== null;

  const cardStyle: React.CSSProperties = isDetached
    ? {
        position: "fixed",
        left: offset.x,
        top: offset.y,
        width: width || (cardRef.current?.offsetWidth || undefined),
        zIndex: 10,
      }
    : { width: width || undefined };

  return (
    <>
      {/* Placeholder keeps the grid layout stable when card is detached */}
      {isDetached && <div ref={placeholderRef} className="card-placeholder" />}
      <div
        ref={cardRef}
        className={`card ${isDetached ? "card-detached" : "card-flow"}`}
        style={cardStyle}
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
    </>
  );
}
