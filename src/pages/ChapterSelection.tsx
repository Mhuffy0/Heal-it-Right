// src/pages/ChapterSelection.tsx
import { useEffect, useMemo, useState } from "react";

import bgImg from "../assets/UI/BG.png";
import backImg from "../assets/UI/back.png";

import {
  getActivePlayer,
  getPlayers,
  isChapterUnlocked,
  setActivePlayer,
  type PlayerProfile,
} from "../utils/saveSystem";



import "./ChapterSelection.css";
import type { PatientId } from "./PatientSelection";

type Props = {
  patient: PatientId; // NEW
  onBack?: () => void;
  onStartChapter?: (chapterId: number, patient: PatientId) => void;
};

// config per patient (if later you want different chapter counts)
const PATIENT_CHAPTERS: Record<PatientId, number[]> = {
  female: [1, 2, 3, 4, 5, 6, 7, 8],
  male: [1, 2, 3, 4, 5, 6, 7, 8], // can change later
};

export default function ChapterSelection({ patient, onBack, onStartChapter }: Props) {
  const [activePlayer, setActivePlayerState] = useState<PlayerProfile | null>(
    null,
  );
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const p = getActivePlayer();
    setActivePlayerState(p ?? null);
    setTimeout(() => setPanelVisible(true), 50);
  }, [patient]);

  const allPlayers = useMemo(() => getPlayers(), [activePlayer]);
  const chapterIds = PATIENT_CHAPTERS[patient];


  const handleSelectExistingPlayer = (id: string) => {
    setActivePlayer(id);
    const p = getActivePlayer();
    setActivePlayerState(p ?? null);
  };

  const handleChapterClick = (id: number, unlocked: boolean) => {
    if (!unlocked) return;
    if (!onStartChapter) return;
    onStartChapter(id, patient);
  };

  const patientLabel =
    patient === "female" ? "ผู้ป่วยหญิงสูงอายุ" : "ผู้ป่วยชายวัยทำงาน";

  return (
    <div className="cs-root">
      <img src={bgImg} className="cs-bg" />

      <div className="cs-overlay" />

      <div className="cs-layer">
        {/* Header */}
        <div className="cs-header">
          {onBack && (
            <button className="cs-back-btn" onClick={onBack}>
              <img src={backImg} className="cs-back-icon" />
            </button>
          )}

          <div className="cs-title-block">
            <h1 className="cs-title">CHAPTER SELECTION</h1>
            <div className="cs-subtitle">
              เคส: <span>{patientLabel}</span>
            </div>
            {activePlayer && (
              <div className="cs-title-player">
                PLAYER: <span>{activePlayer.name}</span>
              </div>
            )}
          </div>

          <div className="cs-player-box">
            {allPlayers.length > 1 && activePlayer && (
              <select
                className="cs-player-select"
                value={activePlayer.id}
                onChange={(e) => handleSelectExistingPlayer(e.target.value)}
              >
                {allPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Panel */}
        <div className={`cs-panel ${panelVisible ? "cs-panel--visible" : ""}`}>
          {chapterIds.map((id) => {
            const unlocked = isChapterUnlocked(id, patient);
            const isLocked = !unlocked;

            return (
              <button
                key={id}
                className={`cs-card ${
                  unlocked ? "cs-card--unlocked" : "cs-card--locked"
                }`}
                disabled={!unlocked}
                onClick={() => handleChapterClick(id, unlocked)}
              >
                <div className="cs-card-inner">
                  {/* thumbnail area – you can style per patient+chapter if needed */}
                  <div className={`cs-thumb cs-thumb-${patient}-${id}`} />

                  <div className="cs-card-footer">
                    {isLocked ? (
                        <div className="cs-locked-label">LOCKED</div>
                      ) : (
                        <div className="cs-unlocked-label">CHAPTER {id}</div>
                      )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
