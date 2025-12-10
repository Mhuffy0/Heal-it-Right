// src/App.tsx
import { useState } from "react";

import GameLayout from "./components/GameLayout";
import GlobalSounds from "./components/GlobalSound";

import MainMenu from "./pages/MainMenu";
import ChapterSelection from "./pages/ChapterSelection";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Chapter3 from "./pages/Chapter3";
import Chapter4 from "./pages/Chapter4";
import Chapter5 from "./pages/Chapter5";
import Chapter6 from "./pages/Chapter6";
import Chapter7 from "./pages/Chapter7";
import Chapter8 from "./pages/Chapter8";

type Screen =
  | "menu"
  | "chapterSelect"
  | "chapter1"
  | "chapter2"
  | "chapter3"
  | "chapter4"
  | "chapter5"
  | "chapter6"
  | "chapter7"
  | "chapter8";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  const goToSelect = () => setScreen("chapterSelect");

  const handleStartChapter = (id: number) => {
    if (id === 1) setScreen("chapter1");
    else if (id === 2) setScreen("chapter2");
    else if (id === 3) setScreen("chapter3");
    else if (id === 4) setScreen("chapter4");
    else if (id === 5) setScreen("chapter5");
    else if (id === 6) setScreen("chapter6");
    else if (id === 7) setScreen("chapter7");
    else if (id === 8) setScreen("chapter8");
  };

  let content: React.ReactNode;

  if (screen === "chapterSelect") {
    content = (
      <ChapterSelection
        onBack={() => setScreen("menu")}
        onStartChapter={handleStartChapter}
      />
    );
  } else if (screen === "chapter1") {
    content = (
      <Chapter1
        onBack={goToSelect}
        onNext={() => setScreen("chapter2")}
      />
    );
  } else if (screen === "chapter2") {
    content = (
      <Chapter2
        onBack={goToSelect}
        onNext={() => setScreen("chapter3")}
      />
    );
  } else if (screen === "chapter3") {
    content = (
      <Chapter3
        onBack={goToSelect}
        onNext={() => setScreen("chapter4")}
      />
    );
  } else if (screen === "chapter4") {
    content = (
      <Chapter4
        onBack={goToSelect}
        onNext={() => setScreen("chapter5")}
      />
    );
  } else if (screen === "chapter5") {
    content = (
      <Chapter5
        onBack={goToSelect}
        onNext={() => setScreen("chapter6")}
      />
    );
  } else if (screen === "chapter6") {
    content = (
      <Chapter6
        onBack={goToSelect}
        onNext={() => setScreen("chapter7")}
      />
    );
  } else if (screen === "chapter7") {
    content = (
      <Chapter7
        onBack={goToSelect}
        onNext={() => setScreen("chapter8")}
      />
    );
  } else if (screen === "chapter8") {
    content = (
      <Chapter8
        onBack={goToSelect}
        onNext={goToSelect} // final → back to selection
      />
    );
  } else {
    // default: main menu
    content = <MainMenu onPlay={goToSelect} />;
  }

  return (
    <GameLayout>
      <GlobalSounds />
      {content}
    </GameLayout>
  );
}
