"use client";

import { useRef, useState, useEffect } from "react";

export default function MusicCard() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setPlaying(false);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, []);

  return (
    <div className="music-card">
      <button className="music-btn" onClick={toggle} title="Dream Machine">
        {playing ? "❚❚" : "▶"}
      </button>
      <audio ref={audioRef} src="/audio/dream-machine.mp3" preload="none" />
    </div>
  );
}
