import React, { useEffect, useMemo, useState } from "react";

import bgImg from "../assets/UI/bg.png";
import backImg from "../assets/UI/back.png";
import starImg from "../assets/UI/star.png";
import blankStarImg from "../assets/UI/blank_star.png";

import {
  getActivePlayer,
  getChapterStars,
  getPlayers,
  isChapterUnlocked,
  setActivePlayer,
  type PlayerProfile,
} from "../utils/saveSystem";

import "./ChapterSelection.css";

type Props = {
  onBack?: () => void;
  onStartChapter?: (id: number) => void;
};

// now 8 real chapters
const CHAPTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ChapterSelection({ onBack, onStartChapter }: Props) {
  const [activePlayer, setActivePlayerState] = useState<PlayerProfile | null>(
    null,
  );
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const p = getActivePlayer();
    setActivePlayerState(p ?? null);
    setTimeout(() => setPanelVisible(true), 50);
  }, []);

  const allPlayers = useMemo(() => getPlayers(), [activePlayer]);

  const totalStars = useMemo(() => {
    if (!activePlayer) return 0;
    let t = 0;
    for (const id of CHAPTER_IDS) {
      t += getChapterStars(id);
    }
    return t;
  }, [activePlayer]);

  const handleSelectExistingPlayer = (id: string) => {
    setActivePlayer(id);
    const p = getActivePlayer();
    setActivePlayerState(p ?? null);
  };

  const handleChapterClick = (id: number, unlocked: boolean) => {
    if (!unlocked) return;
    if (!onStartChapter) return;
    onStartChapter(id);
  };

  const renderStars = (id: number) => {
    const stars = getChapterStars(id);
    return (
      <div className="cs-stars">
        {[0, 1, 2].map((i) => (
          <img
            key={i}
            src={i < stars ? starImg : blankStarImg}
            className="cs-star-icon"
          />
        ))}
      </div>
    );
  };

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
            {activePlayer && (
              <div className="cs-title-player">
                PLAYER: <span>{activePlayer.name}</span>
              </div>
            )}
          </div>

          <div className="cs-player-box">
            {activePlayer && (
              <div className="cs-player-stars">Total Stars: {totalStars}</div>
            )}

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
          {CHAPTER_IDS.map((id) => {
            const unlocked = isChapterUnlocked(id);
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
                  {/* thumbnail area – set bg in CSS per chapter */}
                  <div className={`cs-thumb cs-thumb-${id}`} />

                  <div className="cs-card-footer">
                    {isLocked ? (
                      <div className="cs-locked-label">LOCKED</div>
                    ) : (
                      <div className="cs-unlocked-label">CHAPTER {id}</div>
                    )}

                    {unlocked && renderStars(id)}
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
