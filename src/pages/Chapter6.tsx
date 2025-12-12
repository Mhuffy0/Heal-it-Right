// src/pages/Chapter6.tsx
import { useEffect, useRef, useState } from "react";
import { saveChapterResult } from "../utils/saveSystem";
import type { PatientId } from "./PatientSelection";
 
import bgImg from "../assets/UI/BG.png";
import hintImg from "../assets/UI/hint.png";
import backImg from "../assets/UI/back.png";

import clickSfx from "../assets/Sound/click.mp3";

import startImg from "../assets/Chapter6/start.png";
import woundImg from "../assets/Chapter6/wound.png";
import vdoMain from "../assets/Chapter6/6.mov";

import "./Chapter6.css";

type Props = {
  patient: PatientId;
  onBack?: () => void;
  onNext?: () => void;
};


export default function Chapter6({ patient, onBack, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showStart, setShowStart] = useState(true);
  const [showWoundCard, setShowWoundCard] = useState(false);

  const playClick = () => new Audio(clickSfx).play();

  // After 1s, hide start frame and show video
  useEffect(() => {
    const t = setTimeout(() => {
      setShowStart(false);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  // When start is hidden and video exists -> configure and play
  useEffect(() => {
    if (showStart) return;

    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.playsInline = true;
    vid.src = vdoMain;
    vid.load();

    const playPromise = vid.play();
    if (playPromise) {
      playPromise.catch(() => {
        console.warn("Chapter6: autoplay blocked, user interaction required.");
      });
    }

    const waitDur = setInterval(() => {
      if (!vid.duration || isNaN(vid.duration)) return;
      clearInterval(waitDur);

      saveChapterResult(6, 0, patient);

      setTimeout(() => {
        if (onNext) onNext();
      }, vid.duration * 1000);
    }, 200);

    return () => clearInterval(waitDur);
  }, [showStart, onNext, patient]);

  return (
    <div className="ch6-root">
      <img src={bgImg} className="ch6-bg" />

      <div className="ch6-layer">
        {/* START IMAGE */}
        {showStart && (
          <div className="ch6-video-frame">
            {/* use same class as video so it fits perfectly */}
            <img src={startImg} className="ch6-video" />
          </div>
        )}

        {/* VIDEO */}
        {!showStart && (
          <div className="ch6-video-frame">
            <video
              ref={videoRef}
              className="ch6-video"
              muted
              playsInline
              autoPlay
            />
          </div>
        )}

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch6-back-btn" onClick={onBack}>
            <img src={backImg} className="ch6-back-icon" />
          </button>
        )}

        {/* WOUND BUTTON */}
        <button
          className="ch6-wound-btn"
          onClick={() => {
            playClick();
            setShowWoundCard(true);
          }}
        >
          <img src={woundImg} className="ch6-wound-thumb" />
        </button>
      </div>

      {/* WOUND CARD POPUP */}
      {showWoundCard && (
        <div className="ch6-wound-overlay">
          <div className="ch6-wound-card">
            <button
              className="ch6-wound-close"
              onClick={() => {
                playClick();
                setShowWoundCard(false);
              }}
            >
              X
            </button>

            <img src={woundImg} className="ch6-wound-big" />
          </div>
        </div>
      )}
    </div>
  );
}
