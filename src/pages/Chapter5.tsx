// src/pages/Chapter5.tsx
import React, { useEffect, useRef, useState } from "react";
import { calcStars, saveChapterResult } from "../utils/saveSystem";

import bgImg from "../assets/UI/BG.png";
import hintImg from "../assets/UI/hint.png";
import backImg from "../assets/UI/back.png";

import clickSfx from "../assets/Sound/click.mp3";
import correctSfx from "../assets/Sound/correct.mp3";
import wrongSfx from "../assets/Sound/wrong.mp3";

import startImg from "../assets/Chapter5/start.png";
import woundImg from "../assets/Chapter5/wound.png";

import Quiz from "../components/Quiz";
import "./Chapter5.css";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

type WoundState = "hidden" | "big" | "docked";

export default function Chapter5({ onBack, onNext }: Props) {
  const [woundState, setWoundState] = useState<WoundState>("hidden");
  const [hasStartedQuizzes, setHasStartedQuizzes] = useState(false);

  const [introOpen, setIntroOpen] = useState(false);

  const [wrongCount, setWrongCount] = useState(0);

  const [showQuiz1, setShowQuiz1] = useState(false);
  const [showQuiz2, setShowQuiz2] = useState(false);

  // drag state for wound card (works for big + docked)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  const playClick = () => new Audio(clickSfx).play();
  const playCorrect = () => new Audio(correctSfx).play();
  const playWrong = () => new Audio(wrongSfx).play();

  // quiz content (replace later)
  const quiz1 = {
    question: "จากรูปคือแผลกดทับระดับใด",
    choices: ["Stage 1", "Stage 2", "Stage 3", "Deep tissue pressure injury"],
    correctIndex: 1,
  };

  const quiz2 = {
    question: "ข้อใดถูกต้องเกี่ยวกับลักษณะของ PI Stage 2",
    choices: ["มีการสูญเสียของผิวหนังบางชั้นที่มองเห็นชั้นหนังแท้ พื้นแผลมีสีชมพูหรือสีแดง ชุ่มชื้น และอาจเห็นเป็นตุ่มน้ำเลือดที่ผิวหนัง",
        "มีการสูญเสียชั้นผิวหนังบางส่วนจนมองเห็นชั้นหนังแท้ ลักษณะพื้นแผลมีสีชมพูหรือสีแดง มีความชุ่มชื้น หรืออาจพบลักษณะของตุ่มน้ำใส หรือ ตุ่มน้ำใสที่แตกแล้ว มองไม่เห็นชั้นไขมันหรือเนื้อตาย",
        "มีการสูญเสียของผิวหนังทั้งหมดที่มองเห็นชั้นไขมัน พื้นแผลมีสีชมพูหรือเหลือง ชุ่มชื้น",
        "สูญเสียผิวหนังทุกชั้น ขอบแผลม้วนเข้า พบเนื้อตาย"
    ],
    correctIndex: 1,
  };

  // After 1s, show big wound card
  useEffect(() => {
    const t = setTimeout(() => {
      setWoundState("big");
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const handleCloseWoundCard = () => {
    playClick();
    setWoundState("docked");

    // first time we dock -> start Quiz 1
    if (!hasStartedQuizzes) {
      setHasStartedQuizzes(true);
      setShowQuiz1(true);
    }
  };

  const handleWrong = () => {
    playWrong();
    setWrongCount((prev) => prev + 1);
  };

  const handleCorrectQuiz1 = () => {
    playCorrect();
    setShowQuiz1(false);

    // wait 2 seconds then show second quiz
    setTimeout(() => {
      setShowQuiz2(true);
    }, 2000);
  };

  const handleCorrectQuiz2 = () => {
    playCorrect();
    setShowQuiz2(false);

    const stars = calcStars(wrongCount);
    saveChapterResult(5, stars);

    if (onNext) onNext();
  };

  const dimActive = woundState === "big" || showQuiz1 || showQuiz2;

  // drag handlers (now works for big + docked)
  const handleWoundMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (woundState === "hidden") return; // nothing to drag

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = dragPos?.x ?? rect.left;
    const startY = dragPos?.y ?? rect.top;

    dragOffsetRef.current = {
      dx: e.clientX - startX,
      dy: e.clientY - startY,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const off = dragOffsetRef.current;
      if (!off) return;

      setDragPos({
        x: ev.clientX - off.dx,
        y: ev.clientY - off.dy,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dragOffsetRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // inline style for drag position (applies to both big + docked)
  const cardStyle =
    woundState !== "hidden" && dragPos
      ? {
          left: dragPos.x,
          top: dragPos.y,
          bottom: "auto",
          transform:
            woundState === "big"
              ? "translateX(0) scale(1)"
              : "translateX(0) scale(0.5)",
        }
      : undefined;

  return (
    <div className="ch5-root">
      <img src={bgImg} className="ch5-bg" />

      {dimActive && <div className="ch5-dim" />}

      <div className="ch5-layer">
        {/* MAIN FRAME (static image) */}
        <div className="ch5-video-frame">
          <img src={startImg} className="ch5-video" />
        </div>

        {/* BACK BUTTON */}
        {onBack && (
          <button className="ch5-back-btn" onClick={onBack}>
            <img src={backImg} className="ch5-back-icon" />
          </button>
        )}

        {/* HINT BUTTON */}
        <div className="ch5-hint-container">
          <button
            className="ch5-hint-btn"
            onClick={() => setIntroOpen(true)}
          >
            <img src={hintImg} className="ch5-hint-icon" />
          </button>
        </div>

        {/* WOUND CARD (big / docked, draggable in both) */}
        {woundState !== "hidden" && (
          <div
            className={`ch5-wound-card ${
              woundState === "big"
                ? "ch5-wound-card--big"
                : "ch5-wound-card--docked"
            }`}
            style={cardStyle}
            onMouseDown={handleWoundMouseDown}
            onDoubleClick={() => {
              if (woundState === "docked") {
                setWoundState("big");
              }
            }}
          >
            <img src={woundImg} className="ch5-wound-img" />
            {woundState === "big" && (
              <>
                <button
                  className="ch5-wound-close"
                  onClick={handleCloseWoundCard}
                >
                  X
                </button>
                <div className="ch5-wound-caption">
                  วิเคราะห์แผลกดทับจากภาพนี้ก่อนทำแบบทดสอบ
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* INTRO / HINT CARD */}
      <div className={`ch5-intro-overlay ${introOpen ? "show" : ""}`}>
        <div className="ch5-intro-card">
          <button
            className="ch5-intro-close"
            onClick={() => setIntroOpen(false)}
          >
            X
          </button>

          <div className="ch5-intro-content">
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

      {/* QUIZ 1 */}
      {showQuiz1 && (
        <Quiz
          question={quiz1.question}
          choices={quiz1.choices}
          correctIndex={quiz1.correctIndex}
          onCorrect={handleCorrectQuiz1}
          onWrong={handleWrong}
        />
      )}

      {/* QUIZ 2 */}
      {showQuiz2 && (
        <Quiz
          question={quiz2.question}
          choices={quiz2.choices}
          correctIndex={quiz2.correctIndex}
          onCorrect={handleCorrectQuiz2}
          onWrong={handleWrong}
        />
      )}
    </div>
  );
}
