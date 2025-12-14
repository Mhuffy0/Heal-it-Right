// src/pages/Chapter8.tsx
import { useEffect, useState } from "react";
import { saveChapterResult } from "../../utils/saveSystem";
import type { PatientId } from "../PatientSelection";


import bgImg from "../../assets/UI/BG.png";
import hintImg from "../../assets/UI/hint.png";
import backImg from "../../assets/UI/back.png";

import clickSfx from "../../assets/Sound/click.mp3";
import correctSfx from "../../assets/Sound/correct.mp3";
import wrongSfx from "../../assets/Sound/wrong.mp3";

import startImg from "../../assets/Chapter8/start.png";

import Quiz from "../../components/Quiz";
import "./Chapter8.css";

type Props = {
  patient: PatientId;
  onBack?: () => void;
  onNext?: () => void;
};


export default function Chapter8({ patient, onBack, onNext }: Props) {

  const [wrongCount, setWrongCount] = useState(0);
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const [dim, setDim] = useState(false);
  const [transitionBlack, setTransitionBlack] = useState(false);

  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  const quizData = {
    question: "การดูแลผู้ป่วยที่มี PI Stage 4  ที่แตกต่างจากการดูแลผู้ป่วยที่มี PI Stage 1-3 คือข้อใด",
    choices: [
      "การดูแลด้านโภชนาการให้ได้รับโปรตีนที่เพียงพอในแต่ละวัน",
      "การป้องกันการติดเชื้อในแผลโดยใช้หลัก Aseptic technique",
      "พลิกตะแคงตัวทุก 2 ชั่วโมงจัดที่นอนให้เรียบตึง หลีกเลี่ยงการลากตัวผู้ป่วย",
      "การประเมิน เฝ้าระวังภาวะกระดูกอักเสบ (Osteomyelitis) เนื่องจาก PI Stage 4  เป็นแผลที่ลึกถึง กล้ามเนื้อ เอ็น กระดูก",
    ],
    correctIndex: 3,
  };

  // After 1s: show quiz + dim, BUT keep start image visible behind it
  useEffect(() => {
    const t = setTimeout(() => {
      setDim(true);
      setShowQuiz(true);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  // When quiz is correct → fade → hide picture → play video
   const handleCorrect = () => {
    playCorrect();

    saveChapterResult(8, wrongCount, patient);

    setShowQuiz(false);
    setTransitionBlack(true);

    // keep start image (do NOT setShowStart(false))

    // finish stage after a short fade
    setTimeout(() => {
      setTransitionBlack(false);
      setDim(false);
      if (onNext) onNext();
    }, 700);
  };

    const handleWrong = () => {
    playWrong();
    setWrongCount((prev) => Math.min(4, prev + 1));
  };


  return (
    <div className="ch8-root">
      <img src={bgImg} className="ch8-bg" />

      {dim && <div className="ch8-dim" />}
      {transitionBlack && <div className="ch8-black" />}

      <div className="ch8-layer">
        {/* Start Image (now visible while quiz is open) */}
        {showStart && (
          <div className="ch8-video-frame">
            <img src={startImg} className="ch8-start-img" />
          </div>
        )}

        {/* Back Button */}
        {onBack && (
          <button className="ch8-back-btn" onClick={onBack}>
            <img src={backImg} className="ch8-back-icon" />
          </button>
        )}

        {/* Hint Button */}
        <button
          className={`ch8-hint-btn ${showQuiz ? "disabled" : ""}`}
          disabled={showQuiz}
          onClick={() => alert("Hint for Chapter 8")}
        >
          <img src={hintImg} className="ch8-hint-icon" />
        </button>
      </div>

      {/* Quiz */}
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
