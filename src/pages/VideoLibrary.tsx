// src/pages/VideoLibrary.tsx
import React, { useEffect, useState } from "react";

import bgImg from "../assets/UI/BG.png";
import backImg from "../assets/UI/back.png";

// raw video files (adjust names if they differ)
import piStage1 from "../assets/Video/PI stage 1.mov";
import piStage2 from "../assets/Video/PI stage 2.mov";
import piStage3 from "../assets/Video/PI stage 3.mov";
import piStage4 from "../assets/Video/PI stage 4.mov";
import skinVideo from "../assets/Video/Skin.mov";

import "./VideoLibrary.css";

type Props = {
  onBack?: () => void;
  onSetBgmMuted?: (muted: boolean) => void;
};

type VideoId = "stage1" | "stage2" | "stage3" | "stage4" | "skin";

type VideoMeta = {
  id: VideoId;
  title: string;
  subtitle: string;
  description: string;
  src: string;
};

const VIDEOS: VideoMeta[] = [
  {
    id: "stage1",
    title: "แผลกดทับ ระยะที่ 1",
    subtitle: "Pressure Injury Stage 1",
    description:
      "",
    src: piStage1,
  },
  {
    id: "stage2",
    title: "แผลกดทับ ระยะที่ 2",
    subtitle: "Pressure Injury Stage 2",
    description:
      "",
    src: piStage2,
  },
  {
    id: "stage3",
    title: "แผลกดทับ ระยะที่ 3",
    subtitle: "Pressure Injury Stage 3",
    description:
      "",
    src: piStage3,
  },
  {
    id: "stage4",
    title: "แผลกดทับ ระยะที่ 4",
    subtitle: "Pressure Injury Stage 4",
    description:
      "",
    src: piStage4,
  },
  {
    id: "skin",
    title: "ประเภทของผิวหนัง",
    subtitle: "Skin Types",
    description:
      "",
    src: skinVideo,
  },
];

export default function VideoLibrary({ onBack, onSetBgmMuted }: Props) {
  const [activeId, setActiveId] = useState<VideoId>("stage1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

    useEffect(() => {
        if (onSetBgmMuted) onSetBgmMuted(true);
        return () => {
        if (onSetBgmMuted) onSetBgmMuted(false);
        };
  }, []);

  const activeVideo = VIDEOS.find((v) => v.id === activeId)!;

  return (
    <div className="vl-root">
      <img src={bgImg} className="vl-bg" />
      <div className="vl-overlay" />

      <div className={`vl-shell ${mounted ? "vl-shell--visible" : ""}`}>
        <header className="vl-header">
          {/* Back button */}
            {onBack && (
                <button className="vl-back-btn" onClick={onBack}>
                กลับเมนู
                </button>
            )}

          <div className="vl-header-text">
            <h1 className="vl-title">VIDEO LIBRARY</h1>
            <p className="vl-subtitle">
              วิดีโอความรู้เกี่ยวกับแผลกดทับและการดูแลผิวหนัง เลือกคลิปเพื่อรับชมได้เลย
            </p>
          </div>
        </header>

        <main className="vl-main">
          {/* HERO PLAYER */}
          <section className="vl-player">
            <div className="vl-player-frame">
              <div className="vl-player-backdrop" />

              <video
                key={activeVideo.id}
                className="vl-video"
                src={activeVideo.src}
                controls
                autoPlay
                playsInline
              />

              <div className="vl-player-info">
                <div className="vl-player-tag">{activeVideo.subtitle}</div>
                <h2 className="vl-player-title">{activeVideo.title}</h2>
                <p className="vl-player-description">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </section>

          {/* STRIP / CAROUSEL */}
          <section className="vl-strip">
            <div className="vl-strip-header">
              <h3 className="vl-strip-title">วิดีโอทั้งหมด</h3>
              <span className="vl-strip-count">
                {VIDEOS.findIndex((v) => v.id === activeId) + 1} /{" "}
                {VIDEOS.length}
              </span>
            </div>

            <div className="vl-strip-row">
              {VIDEOS.map((video) => {
                const isActive = video.id === activeId;
                return (
                  <button
                    key={video.id}
                    className={`vl-card ${
                      isActive ? "vl-card--active" : ""
                    }`}
                    onClick={() => setActiveId(video.id)}
                  >
                    <div className="vl-card-thumb">
                      <div className="vl-card-gradient" />
                      <div className="vl-card-content">
                        <span className="vl-card-sub">{video.subtitle}</span>
                        <span className="vl-card-title">{video.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
