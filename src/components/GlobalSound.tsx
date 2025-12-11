// src/components/GlobalSounds.tsx
import React, { useEffect, useRef } from "react";

import bgm from "../assets/Sound/bgm.mp3"; // background music file

type GlobalSoundsProps = {
  volume?: number; // 0..1 (default 0.6)
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
        .catch(() => {
          console.warn("GlobalSounds: autoplay blocked even after interaction");
        });
      window.removeEventListener("pointerdown", handleUserInteract);
    };

    // Start when user interacts with the page
    window.addEventListener("pointerdown", handleUserInteract);

    return () => {
      window.removeEventListener("pointerdown", handleUserInteract);
      audio.pause();
      audioRef.current = null;
    };
  }, [volume]);

  // === NEW: mute/unmute background music ===
  useEffect(() => {
    const onMuteEvent = (e: any) => {
      if (!audioRef.current) return;
      audioRef.current.muted = e.detail === true;
    };

    window.addEventListener("BG_MUTE", onMuteEvent);
    return () => window.removeEventListener("BG_MUTE", onMuteEvent);
  }, []);

  return null;
}
