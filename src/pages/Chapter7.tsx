// src/pages/Chapter7.tsx
import { useEffect, useRef, useState } from "react";
import { calcStars, saveChapterResult } from "../utils/saveSystem";

import bgImg from "../assets/UI/BG.png";
import hintImg from "../assets/UI/hint.png";
import backImg from "../assets/UI/back.png";

import clickSfx from "../assets/Sound/click.mp3";
import correctSfx from "../assets/Sound/correct.mp3";
import wrongSfx from "../assets/Sound/wrong.mp3";

import startImg from "../assets/Chapter7/start.png";
import vdo7 from "../assets/Chapter7/play.mov";

import Quiz from "../components/Quiz";
import "./Chapter7.css";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function Chapter7({ onBack, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [wrongCount, setWrongCount] = useState(0);
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const [dim, setDim] = useState(false);
  const [transitionBlack, setTransitionBlack] = useState(false);

  const playClick = () => new Audio(clickSfx).play();
  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  const quizData = {
    question: "จากรูปควรทำแผลอย่างไร",
    choices: [
      "ทำความสะอาดแผลด้วย NSS จากนั้นทาด้วย 1%silversulfadiazine ปิดแผลด้วย Gauze",
      "ทำความสะอาดแผลด้วย NSS จากนั้นใช้ Gauze ชุบ Betadine ใส่ลงไปในแผล ปิดแผลด้วย Gauze",
      "ทำความสะอาดแผลด้วย NSS จากนั้นแปะด้วยแผ่นตาข่ายลงบนแผล ปิดแผลด้วย Gauze",
      "ทำความสะอาดแผลด้วย Alcohol จากนั้นใช้ Gauze ชุบ NSS ใส่ลงไปในแผล ปิดแผลด้วย Gauze",
    ],
    correctIndex: 2,
  };

  // After 1s: show quiz + dim, but KEEP the start image visible behind it
  useEffect(() => {
    const t = setTimeout(() => {
      setDim(true);
      setShowQuiz(true);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  const handleCorrect = () => {
    playCorrect();

    const stars = calcStars(wrongCount);
    saveChapterResult(7, stars);

    setShowQuiz(false);
    setTransitionBlack(true);

    // hide picture, show video and play it
    setShowStart(false);

    setTimeout(() => {
      if (videoRef.current) {
        const vid = videoRef.current;

        vid.muted = true;
        vid.playsInline = true;
        vid.src = vdo7;
        vid.load();
        vid.play();

        const waitDur = setInterval(() => {
          if (!vid.duration || isNaN(vid.duration)) return;
          clearInterval(waitDur);

          setTimeout(() => {
            if (onNext) onNext();
          }, vid.duration * 1000);
        }, 200);
      }
    }, 400);

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
    <div className="ch7-root">
      <img src={bgImg} className="ch7-bg" />

      {dim && <div className="ch7-dim" />}
      {transitionBlack && <div className="ch7-black" />}

      <div className="ch7-layer">
        {/* START IMAGE (stays while quiz is active) */}
        {showStart && (
          <div className="ch7-video-frame">
            <img src={startImg} className="ch7-start-img" />
          </div>
        )}

        {/* VIDEO (only after correct answer) */}
        {!showStart && (
          <div className="ch7-video-frame">
            <video
              ref={videoRef}
              className="ch7-video"
              muted
              playsInline
            />
          </div>
        )}

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch7-back-btn" onClick={onBack}>
            <img src={backImg} className="ch7-back-icon" />
          </button>
        )}

        {/* HINT BUTTON - optional */}
        <button
          className={`ch7-hint-btn ${showQuiz ? "disabled" : ""}`}
          disabled={showQuiz}
          onClick={() => alert("รอใส่คำใบ้")}
        >
          <img src={hintImg} className="ch7-hint-icon" />
        </button>
      </div>

      {/* QUIZ */}
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
