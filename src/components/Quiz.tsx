// src/components/Quiz.tsx
import React, { useState } from "react";

type QuizProps = {
  question: string;
  choices: string[];
  correctIndex: number;
  onCorrect: () => void;
  onWrong: (index: number) => void;
};

export default function Quiz({ question, choices, correctIndex, onCorrect, onWrong }: QuizProps) {
  const [locked, setLocked] = useState<number[]>([]);
  const [shake, setShake] = useState(false);

  const pick = (index: number) => {
    if (locked.includes(index)) return;

    if (index === correctIndex) {
      onCorrect();
    } else {
      onWrong(index);
      setLocked((prev) => [...prev, index]);

      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="quiz-overlay">
      <div className={`quiz-card ${shake ? "shake" : ""}`}>
        <h3 className="quiz-q">{question}</h3>

        <div className="quiz-choice-wrap">
          {choices.map((text, idx) => (
            <button
              key={idx}
              className={`quiz-choice ${locked.includes(idx) ? "locked" : ""}`}
              onClick={() => pick(idx)}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
