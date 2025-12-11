import React, { useEffect, useState } from "react";

import bgImg from "../assets/UI/bg.png";
import logoImg from "../assets/UI/logo.png";
import buttonImg from "../assets/UI/button.png";
import asset1Img from "../assets/UI/asset1.png";
import asset2Img from "../assets/UI/asset2.png";
import asset3Img from "../assets/UI/asset3.png";
import hintImg from "../assets/UI/hint.png";
import hintTextImg from "../assets/UI/hinttext.png";

import {
  createPlayer,
  getActivePlayer,
  type PlayerProfile,
} from "../utils/saveSystem";

import "./MainMenu.css";

type MainMenuProps = {
  onPlay?: () => void; // go to Chapter Selection
  onShowVideoLibrary?: () => void; // go to Video Library page
};

type MouseState = {
  x: number; // -0.5 .. 0.5
  y: number; // -0.5 .. 0.5
};

export default function MainMenu({
  onPlay,
  onShowVideoLibrary,
}: MainMenuProps) {
  const [playHover, setPlayHover] = useState(false);
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0 });

  const LOGO_STRENGTH = 10;
  const BUTTON_STRENGTH = 14;
  const ASSET1_STRENGTH = 18;
  const ASSET2_STRENGTH = 20;
  const ASSET3_STRENGTH = 16;

  const [hintHover, setHintHover] = useState(false);

  // player stuff (for first-time popup)
  const [activePlayer, setActivePlayerState] = useState<PlayerProfile | null>(
    null,
  );
  const [showNameBox, setShowNameBox] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // load active player on mount
  useEffect(() => {
    const p = getActivePlayer();
    if (p) {
      setActivePlayerState(p);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse({ x: relX, y: relY });
  };

  const handlePlayClick = () => {
    if (!onPlay) return;

    // if we already have a player, go straight to chapter selection
    if (activePlayer) {
      onPlay();
      return;
    }

    // first time: show name popup
    setShowNameBox(true);
  };

  const handleConfirmName = () => {
    if (!onPlay) return;

    const trimmed = nameInput.trim();
    if (!trimmed) return;

    const profile = createPlayer(trimmed);
    setActivePlayerState(profile);
    setShowNameBox(false);
    setNameInput("");

    // now actually go to chapter selection
    onPlay();
  };

  const handleHintClick = () => {
    if (onShowVideoLibrary) {
      onShowVideoLibrary();
    }
  };

  const dimActive = playHover || showNameBox;

  return (
    <div className="mm-root" onMouseMove={handleMouseMove}>
      <img src={bgImg} alt="" className="mm-bg" />

      {/* dim bg on hover or when popup open */}
      <div className={`mm-dim ${dimActive ? "mm-dim--active" : ""}`} />

      <div className="mm-layer">
        {/* Logo */}
        <img
          src={logoImg}
          alt="Game Logo"
          className="mm-logo"
          style={{
            transform: `translate3d(${mouse.x * LOGO_STRENGTH}px, ${
              mouse.y * LOGO_STRENGTH
            }px, 0)`,
          }}
        />

        {/* Center panel with Play button */}
        <div className="mm-center-panel">
          <button
            type="button"
            className="mm-play-btn"
            onMouseEnter={() => setPlayHover(true)}
            onMouseLeave={() => setPlayHover(false)}
            onClick={handlePlayClick}
            style={{
              transform: `translate3d(${mouse.x * BUTTON_STRENGTH}px, ${
                mouse.y * BUTTON_STRENGTH
              }px, 0)`,
            }}
          >
            <img src={buttonImg} alt="Play" className="mm-play-icon" />
          </button>
        </div>

        {/* Background assets */}
        <img
          src={asset1Img}
          alt=""
          className="mm-asset mm-asset1"
          style={{
            transform: `translate3d(${mouse.x * ASSET1_STRENGTH}px, ${
              mouse.y * ASSET1_STRENGTH
            }px, 0)`,
          }}
        />
        <img
          src={asset2Img}
          alt=""
          className="mm-asset mm-asset2"
          style={{
            transform: `translate3d(${mouse.x * ASSET2_STRENGTH}px, ${
              mouse.y * ASSET2_STRENGTH
            }px, 0)`,
          }}
        />
        <img
          src={asset3Img}
          alt=""
          className="mm-asset mm-asset3"
          style={{
            transform: `translate3d(${mouse.x * ASSET3_STRENGTH}px, ${
              mouse.y * ASSET3_STRENGTH
            }px, 0)`,
          }}
        />
      </div>

      {/* Hint button bottom-left -> directly opens video library */}
      <div
        className="mm-hint-container"
        onMouseEnter={() => setHintHover(true)}
        onMouseLeave={() => setHintHover(false)}
      >
        <button
          type="button"
          className="mm-hint-btn"
          onClick={handleHintClick}
        >
          <img src={hintImg} alt="Hint" className="mm-hint-icon" />
        </button>

        <img
          src={hintTextImg}
          alt="Hint Info"
          className={`mm-hint-text ${hintHover ? "mm-hint-text--show" : ""}`}
        />
      </div>

      {/* === PLAYER NAME POPUP === */}
      <div
        className={`mm-name-popup ${
          showNameBox ? "mm-name-popup--show" : ""
        }`}
      >
        <div className="mm-name-card">
          <h2>ENTER YOUR NAME</h2>
          <input
            className="mm-name-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Player Name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmName();
            }}
          />
          <button
            className="mm-name-confirm"
            onClick={handleConfirmName}
            disabled={!nameInput.trim()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
