// src/components/GameLayout.tsx
import React, { useState } from "react";

import bgImg from "../assets/UI/bg.png";
import asset1Img from "../assets/UI/asset1.png";
import asset2Img from "../assets/UI/asset2.png";
import asset3Img from "../assets/UI/asset3.png";

import "./GameLayout.css";

type MouseState = {
  x: number; // -0.5 .. 0.5
  y: number; // -0.5 .. 0.5
};

type GameLayoutProps = {
  children: React.ReactNode;
};

export default function GameLayout({ children }: GameLayoutProps) {
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0 });

  // parallax strengths – tweak if needed
  const ASSET1_STRENGTH = 18;
  const ASSET2_STRENGTH = 20;
  const ASSET3_STRENGTH = 16;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5..0.5
    setMouse({ x: relX, y: relY });
  };

  return (
    <div className="gl-root" onMouseMove={handleMouseMove}>
      {/* background image */}
      <img src={bgImg} alt="" className="gl-bg" />

      {/* parallax UI assets (no logo / play button, just decorations) */}
      <img
        src={asset1Img}
        alt=""
        className="gl-asset gl-asset1"
        style={{
          transform: `translate3d(${mouse.x * ASSET1_STRENGTH}px, ${
            mouse.y * ASSET1_STRENGTH
          }px, 0)`,
        }}
      />
      <img
        src={asset2Img}
        alt=""
        className="gl-asset gl-asset2"
        style={{
          transform: `translate3d(${mouse.x * ASSET2_STRENGTH}px, ${
            mouse.y * ASSET2_STRENGTH
          }px, 0)`,
        }}
      />
      <img
        src={asset3Img}
        alt=""
        className="gl-asset gl-asset3"
        style={{
          transform: `translate3d(${mouse.x * ASSET3_STRENGTH}px, ${
            mouse.y * ASSET3_STRENGTH
          }px, 0)`,
        }}
      />

      {/* page content goes on top */}
      <div className="gl-layer">{children}</div>
    </div>
  );
}
