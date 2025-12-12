// src/pages/ReviewResults.tsx
import { useEffect, useMemo, useState } from "react";
import type { PatientId } from "./PatientSelection";
import { getActivePlayer, getTotalScore } from "../utils/saveSystem";
import "./ReviewResults.css";
import femalePatientImg from "../assets/Patients/female.png";
import malePatientImg from "../assets/Patients/male.png";

type Props = {
  patient: PatientId;
  onReviewQuiz?: () => void; // go back to patientSelect
};

function patientLabel(patient: PatientId) {
  return patient === "female" ? "ผู้ป่วยหญิงอายุ 72 ปี" : "ผู้ป่วยชายอายุ 88 ปี";
}

// small detail card (short + safe)
function patientDetails(patient: PatientId) {
  if (patient === "female") {
    return "หญิงไทย อายุ 72 ปี เคลื่อนไหวลำบาก มีรอยแดงก้นกบ 3×3 ซม. (Braden 15)";
  }
  return "ชายไทย อายุ 88 ปี มีภาวะสมองเสื่อม/หัวใจล้มเหลว แผลก้นกบลึก 5×6 ซม. (Braden 8)";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function gradeFromPercent(pct: number) {
  if (pct >= 90) return "Excellent";
  if (pct >= 80) return "Great";
  if (pct >= 70) return "Good";
  if (pct >= 60) return "Pass";
  return "Try again";
}

export default function ReviewResults({ patient, onReviewQuiz }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 20);
    return () => window.clearTimeout(t);
  }, []);

  const profile = getActivePlayer();
  const playerName = profile?.name ?? "Player";
  const patientImg = patient === "female" ? femalePatientImg : malePatientImg;

  const total = useMemo(() => getTotalScore(patient), [patient]);
  const totalMax = 100; // fixed by your design
  const pct = clamp((total / totalMax) * 100, 0, 100);

  const { r, g, b } = scoreToColor(pct);

  const scoreColor = `rgb(${r}, ${g}, ${b})`;
  const scoreGlow  = `rgba(${r}, ${g}, ${b}, 0.45)`;

  // show like 100% / 78% etc
  const pctText = `${Math.round(pct)}%`;
  const pointsText = `${Math.round(total)}`; // 0..100 (your points)

  const statusText = pct >= 60 ? `Nice job, you passed!` : `Not yet — try again.`;
  const gradeText = gradeFromPercent(pct);

  return (
    <div className={`rr2-root ${mounted ? "rr2-root--in" : ""}`}>
      <div className="rr2-bgGlow" />

      <div className="rr2-center">
        <div className="rr2-title">Quiz Results</div>

        {/* big percent badge */}
        <div
            className="rr2-badge"
            aria-label="Overall percent"
            style={{
                borderColor: scoreColor,
                boxShadow: `0 0 40px ${scoreGlow}`,
                transition: "border-color 600ms ease, box-shadow 600ms ease",
            }}
            >

          <div className="rr2-badgeInner">
            <div
                className="rr2-badgePct"
                style={{
                    color: scoreColor,
                    transition: "color 600ms ease",
                }}
                >
                {pctText}
                </div>

            <div className="rr2-badgeSub">{gradeText}</div>
          </div>
        </div>

        <div className="rr2-msg">{statusText}</div>

        {/* stat cards like the screenshot structure */}
        <div className="rr2-stats">
          <div className="rr2-statCard">
            <div className="rr2-statLabel">YOUR SCORE</div>
            <div
                className="rr2-statValue"
                style={{
                    color: scoreColor,
                    transition: "color 600ms ease",
                }}
                >
                {pctText}
                </div>

            <div className="rr2-statFoot">MAX SCORE: 100%</div>
          </div>

          <div className="rr2-statCard">
            <div className="rr2-statLabel">YOUR POINTS</div>
            <div className="rr2-statValue">{pointsText}</div>
            <div className="rr2-statFoot">MAX POINTS: 100</div>
          </div>
        </div>

        {/* patient + player mini card */}
        <div className="rr2-patientCard">
          <div className="rr2-patientAvatar" aria-hidden="true">
            <img className="rr2-patientAvatarImg" src={patientImg} alt="" />
          </div>
          <div className="rr2-patientInfo">
            <div className="rr2-patientTop">
              <div className="rr2-patientLabel">{patientLabel(patient)}</div>
              <div className="rr2-player">PLAYER: <span>{playerName}</span></div>
            </div>
            <div className="rr2-patientDesc">{patientDetails(patient)}</div>
          </div>
        </div>

        <button
          className="rr2-btn"
          type="button"
          onClick={() => onReviewQuiz && onReviewQuiz()}
        >
          Review Quiz
        </button>
      </div>
    </div>
  );
}

function scoreToColor(percent: number) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const p = clamp(percent);

  // red -> yellow -> green
  if (p <= 50) {
    const t = p / 50; // 0..1
    return {
      r: Math.round(220 + (234 - 220) * t),
      g: Math.round(38 + (179 - 38) * t),
      b: Math.round(38 + (8 - 38) * t),
    };
  } else {
    const t = (p - 50) / 50; // 0..1
    return {
      r: Math.round(234 + (34 - 234) * t),
      g: Math.round(179 + (197 - 179) * t),
      b: Math.round(8 + (94 - 8) * t),
    };
  }
}
