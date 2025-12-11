// src/pages/Chapter3.tsx
import React, { useEffect, useRef, useState } from "react";
import { calcStars, saveChapterResult } from "../../utils/saveSystem";

import bgImg from "../../assets/UI/BG.png";
import hintImg from "../../assets/UI/hint.png";
import backImg from "../../assets/UI/back.png";

import clickSfx from "../../assets/Sound/click.mp3";
import correctSfx from "../../assets/Sound/correct.mp3";
import wrongSfx from "../../assets/Sound/wrong.mp3";

import startImg from "../../assets/Chapter3/start.png"; // freeze frame
import vdo2 from "../../assets/Chapter3/2.mov";          // main video

import Quiz from "../../components/Quiz";
import "./Chapter3.css";

type Props = {
  onBack?: () => void;
  onNext?: () => void; // -> next chapter
};

export default function Chapter3({ onBack, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [wrongCount, setWrongCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<1 | 2>(1); // 1=image, 2=video
  const [dim, setDim] = useState(false);
  const [transitionBlack, setTransitionBlack] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const hintBlocked = showQuiz;

  const [introOpen, setIntroOpen] = useState(false); // hint card, click-only

  const playClick = () => new Audio(clickSfx).play();
  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  // TODO: real question for chapter 3
  const quizData = {
    question: "ควรทำอะไรเป็นอันดับถัดไป",
    choices: ["ประเมินแผล", "ล้างมือ 6 ขั้นตอนด้วยน้ำสบู่", "แนะนำตัว", "จัดสิ่งแวดล้อม"],
    correctIndex: 3,
  };


  // Auto spawn quiz 1s after enter (over the freeze image)
  useEffect(() => {
    const t = setTimeout(() => {
      playClick();
      setDim(true);
      setShowQuiz(true);
      // no video playing yet when currentVideo === 1
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  const handleCorrect = () => {
    playCorrect();

    // save score for chapter 3 (you can tweak later)
    const stars = calcStars(wrongCount);
    saveChapterResult(3, stars);

    setShowQuiz(false);
    setTransitionBlack(true);

    // fade to black, then swap to video
    setTimeout(() => {
      setCurrentVideo(2); // switch to video mode

      // wait a tick so <video> mounts and ref attaches
      setTimeout(() => {
        const vid = videoRef.current;
        if (!vid) return;

        vid.currentTime = 0;
        vid.loop = false;
        vid.play();

        // wait until duration is known, then go to next chapter
        const waitDur = setInterval(() => {
          if (!vid.duration || isNaN(vid.duration)) return;
          clearInterval(waitDur);

          setTimeout(() => {
            if (onNext) onNext();
          }, vid.duration * 1000);
        }, 200);
      }, 50);
    }, 400);

    // finish fade + clear dim
    setTimeout(() => {
      setTransitionBlack(false);
      setDim(false);
    }, 900);
  };

  const handleWrong = () => {
    playWrong();
    setWrongCount((prev) => prev + 1);
  };

  return (
    <div className="ch3-root">
      <img src={bgImg} className="ch3-bg" />

      {dim && <div className="ch3-dim" />}
      {transitionBlack && <div className="ch3-black" />}

      <div className="ch3-layer">
        {/* FREEZE IMAGE / VIDEO AREA */}
        <div className="ch3-video-frame">
          {currentVideo === 1 ? (
            <img src={startImg} className="ch3-video" />
          ) : (
            <video
              ref={videoRef}
              className="ch3-video"
              src={vdo2}
              autoPlay
              loop={false}
              muted
              playsInline
            />
          )}
        </div>

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch3-back-btn" onClick={onBack}>
            <img src={backImg} className="ch3-back-icon" />
          </button>
        )}

        {/* HINT BUTTON (bottom-left, disabled during quiz) */}
        <div className={`ch3-hint-container ${hintBlocked ? "disabled" : ""}`}>
          <button
            className="ch3-hint-btn"
            onClick={() => !hintBlocked && setIntroOpen(true)}
            disabled={hintBlocked}
          >
            <img src={hintImg} className="ch3-hint-icon" />
          </button>
        </div>
      </div>

      {/* HINT CARD (click to open) */}
      <div className={`ch3-intro-overlay ${introOpen ? "show" : ""}`}>
        <div className="ch3-intro-card">
          <button
            className="ch3-intro-close"
            onClick={() => setIntroOpen(false)}
          >
            X
          </button>

          <div className="ch3-intro-content">
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
          onWrong={handleWrong}
        />
      )}
    </div>
  );
}
