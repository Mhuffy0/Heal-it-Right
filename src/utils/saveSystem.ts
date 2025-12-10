// src/utils/saveSystem.ts
export type ChapterScore = {
  stars: number; // 0–3
};

export type PlayerProfile = {
  id: string;
  name: string;
  unlockedChapters: number[]; // e.g. [1, 2, 3]
  chapters: { [chapterId: number]: ChapterScore };
};

export type SaveData = {
  players: PlayerProfile[];
  activePlayerId: string | null;
};

const STORAGE_KEY = "healItRightSave_v1";

function getDefaultSave(): SaveData {
  return {
    players: [],
    activePlayerId: null,
  };
}

export function loadSave(): SaveData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSave();
    const data = JSON.parse(raw) as SaveData;
    if (!data.players) return getDefaultSave();
    return data;
  } catch {
    return getDefaultSave();
  }
}

function save(data: SaveData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createPlayer(name: string): PlayerProfile {
  const data = loadSave();

  const profile: PlayerProfile = {
    id: crypto.randomUUID(),
    name: name.trim() || "Player",
    unlockedChapters: [1],
    chapters: {},
  };

  data.players.push(profile);
  data.activePlayerId = profile.id;
  save(data);

  return profile;
}

export function getActivePlayer(): PlayerProfile | null {
  const data = loadSave();
  if (!data.activePlayerId) return null;
  return data.players.find((p) => p.id === data.activePlayerId) ?? null;
}

export function setActivePlayer(id: string) {
  const data = loadSave();
  if (!data.players.find((p) => p.id === id)) return;
  data.activePlayerId = id;
  save(data);
}

export function getPlayers(): PlayerProfile[] {
  return loadSave().players;
}

// wrongCount -> stars
export function calcStars(wrongCount: number): number {
  if (wrongCount <= 0) return 3;
  if (wrongCount === 1) return 2;
  if (wrongCount === 2) return 1;
  return 0;
}

export function saveChapterResult(chapterId: number, stars: number) {
  const data = loadSave();
  if (!data.activePlayerId) return;
  const player = data.players.find((p) => p.id === data.activePlayerId);
  if (!player) return;

  const prev = player.chapters[chapterId]?.stars ?? 0;
  const best = Math.max(prev, stars);

  player.chapters[chapterId] = { stars: best };

  const nextChapter = chapterId + 1;
  if (!player.unlockedChapters.includes(nextChapter)) {
    player.unlockedChapters.push(nextChapter);
  }

  save(data);
}

export function getChapterStars(chapterId: number): number {
  const player = getActivePlayer();
  if (!player) return 0;
  return player.chapters[chapterId]?.stars ?? 0;
}

export function isChapterUnlocked(chapterId: number): boolean {
  const player = getActivePlayer();
  if (!player) return chapterId === 1; // default: ch1 unlocked
  return player.unlockedChapters.includes(chapterId);
}
