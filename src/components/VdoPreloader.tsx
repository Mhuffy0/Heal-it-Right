// src/components/AutoPreloader.tsx
import { useEffect } from "react";

export default function AutoPreloader() {
  useEffect(() => {
    // 1. Auto-grab all videos (mp4, mov, webm)
    const videoModules = import.meta.glob(
      "../assets/Chapter{1,2,3,4,5,6,7,8}/**/*.{mp4,mov,webm}",
      { eager: true }
    );

    // 2. Auto-grab all images (png/jpg)
    const imageModules = import.meta.glob(
      "../assets/Chapter{1,2,3,4,5,6,7,8}/**/*.{png,jpg,jpeg}",
      { eager: true }
    );

    const videoUrls: string[] = [];
    const imageUrls: string[] = [];

    // Extract URLs
    Object.values(videoModules).forEach((mod: any) => {
      if (mod?.default) videoUrls.push(mod.default);
    });
    Object.values(imageModules).forEach((mod: any) => {
      if (mod?.default) imageUrls.push(mod.default);
    });

    // ---- ACTUAL PRELOAD ----

    // videos
    videoUrls.forEach((src) => {
      const v = document.createElement("video");
      v.src = src;
      v.preload = "auto";
      v.muted = true;
      v.load();
    });

    // images
    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
}
