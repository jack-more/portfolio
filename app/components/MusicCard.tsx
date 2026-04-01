"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  defaultX: number;
  defaultY: number;
}

export default function MusicCard({ defaultX, defaultY }: Props) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  // Drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  // When audio ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setPlaying(false);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, []);

  return (
    <div
      className="music-card"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
    >
      <button className="music-btn" onClick={toggle} title="Dream Machine">
        {playing ? "❚❚" : "▶"}
      </button>
      <audio ref={audioRef} src="/audio/dream-machine.mp3" preload="none" />
    </div>
  );
}
