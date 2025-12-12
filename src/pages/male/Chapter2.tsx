// src/pages/Chapter2.tsx
import { useEffect, useRef, useState } from "react";
import { saveChapterResult } from "../../utils/saveSystem";
import type { PatientId } from "../PatientSelection";


import bgImg from "../../assets/UI/BG.png";
import hintImg from "../../assets/UI/hint.png";
import backImg from "../../assets/UI/back.png";

import clickSfx from "../../assets/Sound/click.mp3";
import correctSfx from "../../assets/Sound/correct.mp3";
import wrongSfx from "../../assets/Sound/wrong.mp3";

import vdo1 from "../../assets/Chapter2/1.mov";
import vdo2 from "../../assets/Chapter2/2.mov";

import Quiz from "../../components/Quiz";
import "./Chapter2.css";

type Props = {
  patient: PatientId;
  onBack?: () => void;
  onNext?: () => void; // -> go to Chapter3
};

export default function Chapter2({ patient, onBack, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(1);
  const [dim, setDim] = useState(false);
  const [transitionBlack, setTransitionBlack] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const hintBlocked = showQuiz;

  const [introOpen, setIntroOpen] = useState(false); // no auto-open here

  const playClick = () => new Audio(clickSfx).play();
  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  // You will change this later per chapter
  const quizData = {
    question: "ควรทำอะไรเป็นอันดับถัดไป",
    choices: ["ประเมินแผล", "ล้างมือ 6 ขั้นตอนด้วยน้ำสบู่", "แนะนำตัว", "จัดสิ่งแวดล้อม"],
    correctIndex: 2,
  };

  // Auto spawn quiz after 1 second
  useEffect(() => {
    const t = setTimeout(() => {
      playClick();
      setDim(true);
      setShowQuiz(true);
      videoRef.current?.pause();
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  const handleCorrect = () => {
    playCorrect();

    saveChapterResult(2, wrongCount, patient);


    setShowQuiz(false);
    setTransitionBlack(true);

    setTimeout(() => {
      setCurrentVideo(2);

      if (videoRef.current) {
        const vid = videoRef.current;
        vid.src = vdo2;
        vid.loop = false;
        vid.play();

        // Wait until duration is known, then go to Chapter3
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

  const getVideo = () => (currentVideo === 1 ? vdo1 : vdo2);

  return (
    <div className="ch2-root">
      <img src={bgImg} className="ch2-bg" />

      {dim && <div className="ch2-dim" />}
      {transitionBlack && <div className="ch2-black" />}

      <div className="ch2-layer">
        {/* VIDEO */}
        <div className="ch2-video-frame">
          <video
            ref={videoRef}
            className="ch2-video"
            src={getVideo()}
            autoPlay
            loop={currentVideo === 1}
            muted
            playsInline
          />
        </div>

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch2-back-btn" onClick={onBack}>
            <img src={backImg} className="ch2-back-icon" />
          </button>
        )}

        {/* HINT BUTTON (no auto-open, disabled during quiz) */}
        <div className={`ch2-hint-container ${hintBlocked ? "disabled" : ""}`}>
          <button
            className="ch2-hint-btn"
            onClick={() => !hintBlocked && setIntroOpen(true)}
            disabled={hintBlocked}
          >
            <img src={hintImg} className="ch2-hint-icon" />
          </button>
        </div>
      </div>

      {/* INTRO HINT CARD (only when player clicks) */}
      <div className={`ch2-intro-overlay ${introOpen ? "show" : ""}`}>
        <div className="ch2-intro-card">
          <button
            className="ch2-intro-close"
            onClick={() => setIntroOpen(false)}
          >
            X
          </button>

          <div className="ch2-intro-content">
            <h2>ข้อมูลเบื้องต้น</h2>
            <p>
              ผู้ป่วยชายไทย อายุ 88 ปี มีภาวะสมองเสื่อม หัวใจล้มเหลว และควบคุมการขับถ่ายไม่ได้
              ต้องใช้ผ้าอ้อมตลอดเวลา รับประทานอาหารได้น้อย ผล Braden score = 8 คะแนน
              พบบริเวณก้นกบมีแผลลึกลงถึงโครงสร้างใต้ผิวหนัง ขนาดประมาณ 5×6 ซม. ลึก 2.5 ซม.
              มีหนองและ กลิ่นเหม็น ผู้ป่วยตอบสนองความเจ็บลดลง
            </p>
          </div>
        </div>
      </div>

      {/* QUIZ (auto shown after 1s) */}
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
