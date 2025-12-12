// src/App.tsx
import { useState } from "react";

import GameLayout from "./components/GameLayout";
import GlobalSounds from "./components/GlobalSound";
import AutoPreloader  from "./components/VdoPreloader";

import MainMenu from "./pages/MainMenu";
import ChapterSelection from "./pages/ChapterSelection";
import type { PatientId } from "./pages/PatientSelection";
import PatientSelection from "./pages/PatientSelection";
import VideoLibrary from "./pages/VideoLibrary";
import ReviewResults from "./pages/ReviewResults";

// female chapters
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Chapter3 from "./pages/Chapter3";
import Chapter4 from "./pages/Chapter4";
import Chapter5 from "./pages/Chapter5";
import Chapter6 from "./pages/Chapter6";
import Chapter7 from "./pages/Chapter7";
import Chapter8 from "./pages/Chapter8";

// male chapters
import MaleChapter1 from "./pages/male/Chapter1";
import MaleChapter2 from "./pages/male/Chapter2";
import MaleChapter3 from "./pages/male/Chapter3";
import MaleChapter4 from "./pages/male/Chapter4";
import MaleChapter5 from "./pages/male/Chapter5";
import MaleChapter6 from "./pages/male/Chapter6";
import MaleChapter7 from "./pages/male/Chapter7";
import MaleChapter8 from "./pages/male/Chapter8";

type Screen =
  | "menu"
  | "patientSelect"
  | "chapterSelect"
  | "videoLibrary" // <- lowercase, matches checks below
  // female
  | "chapter1"
  | "chapter2"
  | "chapter3"
  | "chapter4"
  | "chapter5"
  | "chapter6"
  | "chapter7"
  | "chapter8"
  // male
  | "maleChapter1"
  | "maleChapter2"
  | "maleChapter3"
  | "maleChapter4"
  | "maleChapter5"
  | "maleChapter6"
  | "maleChapter7"
  | "maleChapter8"
  | "reviewResults";



export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [activePatient, setActivePatient] = useState<PatientId>("female");

  const goToChapterSelect = () => setScreen("chapterSelect");
  const goToReview = () => setScreen("reviewResults");

  // ChapterSelection now calls onStartChapter(id, patient)
  const handleStartChapter = (id: number, patient: PatientId) => {
    setActivePatient(patient);

    
    if (patient === "female") {
      if (id === 1) setScreen("chapter1");
      else if (id === 2) setScreen("chapter2");
      else if (id === 3) setScreen("chapter3");
      else if (id === 4) setScreen("chapter4");
      else if (id === 5) setScreen("chapter5");
      else if (id === 6) setScreen("chapter6");
      else if (id === 7) setScreen("chapter7");
      else if (id === 8) setScreen("chapter8");
    } else {
      if (id === 1) setScreen("maleChapter1");
      else if (id === 2) setScreen("maleChapter2");
      else if (id === 3) setScreen("maleChapter3");
      else if (id === 4) setScreen("maleChapter4");
      else if (id === 5) setScreen("maleChapter5");
      else if (id === 6) setScreen("maleChapter6");
      else if (id === 7) setScreen("maleChapter7");
      else if (id === 8) setScreen("maleChapter8");
    }
  };

  
  const handleReplayChapter = (id: number, patient: PatientId) => {
    // keep patient consistent
    setActivePatient(patient);
    handleStartChapter(id, patient);
  };


  let content: React.ReactNode;

  // patient selection screen
  if (screen === "patientSelect") {
    content = (
      <PatientSelection
        onBack={() => setScreen("menu")}
        onSelectPatient={(id) => {
          setActivePatient(id);
          setScreen("chapterSelect");
        }}
      />
    );
  }

  else if (screen === "reviewResults") {
    content = (
      <ReviewResults
        patient={activePatient}
        onReviewQuiz={() => setScreen("patientSelect")}
      />
    );
  }

  // chapter selection for current patient
  else if (screen === "chapterSelect") {
    content = (
      <ChapterSelection
        patient={activePatient}
        onBack={() => setScreen("menu")}
        onStartChapter={handleStartChapter}
      />
    );
  }
  // video library
  else if (screen === "videoLibrary") {
  content = (
    <VideoLibrary
      onBack={() => setScreen("menu")}
      onSetBgmMuted={(muted) => {
        // send mute command to GlobalSounds
        window.dispatchEvent(new CustomEvent("BG_MUTE", { detail: muted }));
      }}
    />
  );
}

  // FEMALE chapters
  else if (screen === "chapter1") {
    content = (
      <Chapter1
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter2")}
      />
    );
  } else if (screen === "chapter2") {
    content = (
      <Chapter2
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter3")}
      />
    );
  } else if (screen === "chapter3") {
    content = (
      <Chapter3
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter4")}
      />
    );
  } else if (screen === "chapter4") {
    content = (
      <Chapter4
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter5")}
      />
    );
  } else if (screen === "chapter5") {
    content = (
      <Chapter5
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter6")}
      />
    );
  } else if (screen === "chapter6") {
    content = (
      <Chapter6
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter7")}
      />
    );
  } else if (screen === "chapter7") {
    content = (
      <Chapter7
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("chapter8")}
      />
    );
  } else if (screen === "chapter8") {
    content = (
      <Chapter8
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={goToReview} // final → review page
      />
    );
  }

  // MALE chapters
  else if (screen === "maleChapter1") {
    content = (
      <MaleChapter1
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter2")}
      />
    );
  } else if (screen === "maleChapter2") {
    content = (
      <MaleChapter2
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter3")}
      />
    );
  } else if (screen === "maleChapter3") {
    content = (
      <MaleChapter3
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter4")}
      />
    );
  } else if (screen === "maleChapter4") {
    content = (
      <MaleChapter4
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter5")}
      />
    );
  } else if (screen === "maleChapter5") {
    content = (
      <MaleChapter5
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter6")}
      />
    );
  } else if (screen === "maleChapter6") {
    content = (
      <MaleChapter6
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter7")}
      />
    );
  } else if (screen === "maleChapter7") {
    content = (
      <MaleChapter7
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={() => setScreen("maleChapter8")}
      />
    );
  } else if (screen === "maleChapter8") {
    content = (
      <MaleChapter8
        patient={activePatient}
        onBack={() => setScreen("patientSelect")}
        onNext={goToReview} // final → review page
      />
    );
  }

  // default: main menu
  else {
    content = (
      <MainMenu
        onPlay={() => setScreen("patientSelect")}
        onShowVideoLibrary={() => setScreen("videoLibrary")}
      />
    );
  }

  return (
    <GameLayout>
      <GlobalSounds />
      <AutoPreloader />
      {content}
    </GameLayout>
  );
}
