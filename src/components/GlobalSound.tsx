// src/components/GlobalSounds.tsx
import React, { useEffect, useRef } from "react";

import bgm from "../assets/Sound/bgm.mp3"; // <-- change filename if needed

type GlobalSoundsProps = {
  volume?: number; // 0..1, default 0.6
};

export default function GlobalSounds({ volume = 0.6 }: GlobalSoundsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleUserInteract = () => {
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .catch(() =>
          console.warn("GlobalSounds: autoplay still blocked after interaction"),
        );
      window.removeEventListener("pointerdown", handleUserInteract);
    };

    // start playing on first click / tap / mouse down
    window.addEventListener("pointerdown", handleUserInteract);

    return () => {
      window.removeEventListener("pointerdown", handleUserInteract);
      audio.pause();
      audioRef.current = null;
    };
  }, [volume]);

  return null; // nothing visual
}
