// src/pages/Chapter1.tsx
import { useEffect, useRef, useState } from "react";
import { saveChapterResult } from "../utils/saveSystem";
import type { PatientId } from "./PatientSelection";


import bgImg from "../assets/UI/BG.png";
import hintImg from "../assets/UI/hint.png";
import backImg from "../assets/UI/back.png";
import questionImg from "../assets/UI/question.png";

import clickSfx from "../assets/Sound/click.mp3";
import correctSfx from "../assets/Sound/correct.mp3";
import wrongSfx from "../assets/Sound/wrong.mp3";

import vdo1 from "../assets/Chapter1/1.mov";
import vdo2 from "../assets/Chapter1/2.mov";

import Quiz from "../components/Quiz";

import "./Chapter1.css";

type Props = {
  patient: PatientId;
  onBack?: () => void;
  onNext?: () => void;
};



export default function Chapter1({ patient, onBack, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(1);
  const [dim, setDim] = useState(false);
  const [transitionBlack, setTransitionBlack] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const [eventUsed, setEventUsed] = useState(false); // hide event button after first click
  const hintBlocked = showQuiz; // cannot press hint while quiz is active

  // Intro hint card
  const [introOpen, setIntroOpen] = useState(false);

  // Open intro card automatically after 1 second
  useEffect(() => {
    const t = setTimeout(() => setIntroOpen(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const playClick = () => new Audio(clickSfx).play();
  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  // You will edit this later
  const quizData = {
    question: "ควรทำอะไรเป็นอันดับแรก",
    choices: ["ประเมินแผล", "ล้างมือ 6 ขั้นตอนด้วยน้ำสบู่", "แนะนำตัว", "จัดสิ่งแวดล้อม"],
    correctIndex: 1,
  };

  // Start quiz: one-time event trigger
  const startQuiz = () => {
    playClick();
    setEventUsed(true);        // remove button immediately
    setDim(true);
    setShowQuiz(true);
    videoRef.current?.pause();
  };

  // Correct answer flow
  const handleCorrect = () => {
    playCorrect();
    saveChapterResult(1, wrongCount, patient);


    setShowQuiz(false);
    setTransitionBlack(true);

    // Fade to black then swap to video 2
    setTimeout(() => {
      setCurrentVideo(2);

      if (videoRef.current) {
        const vid = videoRef.current;
        vid.src = vdo2;
        vid.loop = false;
        vid.play();

        // Wait until duration is known, then time the chapter change
        const waitDur = setInterval(() => {
          if (!vid.duration || isNaN(vid.duration)) return;
          clearInterval(waitDur);

          setTimeout(() => {
            if (onNext) onNext();
          }, vid.duration * 1000);
        }, 200);
      }
    }, 400);

    // Finish transition + clear dim
    setTimeout(() => {
      setTransitionBlack(false);
      setDim(false);
    }, 900);
  };

  const handleWrong = () => {
    playWrong();
    setWrongCount((prev) => prev + 1);
    };

  const getVideo = () => (currentVideo === 1 ? vdo1 : vdo2);

  return (
    <div className="ch1-root">
      <img src={bgImg} className="ch1-bg" />

      {dim && <div className="ch1-dim" />}
      {transitionBlack && <div className="ch1-black" />}

      <div className="ch1-layer">
        {/* VIDEO PLAYER */}
        <div className="ch1-video-frame">
          <video
            ref={videoRef}
            className="ch1-video"
            src={getVideo()}
            autoPlay
            loop={currentVideo === 1}
            muted
            playsInline
          />
        </div>

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch1-back-btn" onClick={onBack}>
            <img src={backImg} className="ch1-back-icon" />
          </button>
        )}

        {/* HINT BUTTON (always bottom-left, disabled during quiz) */}
        <div className={`ch1-hint-container ${hintBlocked ? "disabled" : ""}`}>
          <button
            className="ch1-hint-btn"
            onClick={() => !hintBlocked && setIntroOpen(true)}
            disabled={hintBlocked}
          >
            <img src={hintImg} className="ch1-hint-icon" />
          </button>
        </div>

        {/* EVENT BUTTON (one-time, removed on first click) */}
        {!eventUsed && (
          <button className="ch1-event-btn" onClick={startQuiz}>
            <img src={questionImg} className="ch1-question-icon" />
          </button>
        )}
      </div>

      {/* INTRO HINT CARD (same content as main info) */}
      <div className={`ch1-intro-overlay ${introOpen ? "show" : ""}`}>
        <div className="ch1-intro-card">
          <button
            className="ch1-intro-close"
            onClick={() => setIntroOpen(false)}
          >
            X
          </button>

          <div className="ch1-intro-content">
            <h2>ข้อมูลเบื้องต้น</h2>
            <p>
              ผู้ป่วยหญิงไทย อายุ 72 ปี
              นอนโรงพยาบาลจากข้อเข่าเสื่อมรุนแรง เคลื่อนไหวลำบาก
              ต้องพึ่งพาผู้อื่นในการช่วยพลิกตัว หลีกเลี่ยงการขยับตัวเพราะปวดข้อ
              ร่วมกับความดันโลหิตสูงควบคุมไม่ดี ผลประเมิน Braden score เท่ากับ 15
              คะแนน พบบริเวณก้นกบมีผิวหนังแดงไม่จางเมื่อกด ผิวอุ่นกว่าบริเวณอื่น
              ขนาดพื้นที่แดงประมาณ 3×3 ซม. ผู้ป่วยบอกว่าปวดหนึบๆ เมื่อสัมผัส
            </p>
          </div>
        </div>
      </div>

      {/* QUIZ POPUP */}
      {showQuiz && (
        <Quiz
          question={quizData.question}
          choices={quizData.choices}
          correctIndex={quizData.correctIndex}
          onCorrect={handleCorrect}
          onWrong={() => handleWrong()}
        />
      )}
    </div>
  );
}
