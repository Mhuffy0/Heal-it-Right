// src/utils/saveSystem.ts

export type ChapterScore = {
  stars: number; // 0–3
};

export type PlayerProfile = {
  id: string;
  name: string;
  unlockedChapters: number[]; // stored as internal ids (see below)
  chapters: { [chapterId: number]: ChapterScore }; // internal ids
};

export type SaveData = {
  players: PlayerProfile[];
  activePlayerId: string | null;
};

const STORAGE_KEY = "healItRightSave_v1";

// local helper: which patient this progress is for
type Patient = "female" | "male";

/**
 * Map a visible chapter id (1..8) + patient
 * → internal id stored in save (so female/male don't clash).
 *
 * female 1 → 1
 * female 2 → 2
 * ...
 * male   1 → 101
 * male   2 → 102
 * ...
 */
function getInternalChapterId(chapterId: number, patient: Patient = "female") {
  return patient === "female" ? chapterId : 100 + chapterId;
}

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
    // unlock chapter 1 for BOTH patients by default
    unlockedChapters: [
      getInternalChapterId(1, "female"),
      getInternalChapterId(1, "male"),
    ],
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

/**
 * Save chapter result for specific patient.
 * Default patient = "female" so all your old code still works.
 */
export function saveChapterResult(
  chapterId: number,
  stars: number,
  patient: Patient = "female"
) {
  const data = loadSave();
  if (!data.activePlayerId) return;
  const player = data.players.find((p) => p.id === data.activePlayerId);
  if (!player) return;

  const internalId = getInternalChapterId(chapterId, patient);

  const prev = player.chapters[internalId]?.stars ?? 0;
  const best = Math.max(prev, stars);

  player.chapters[internalId] = { stars: best };

  const nextInternalId = getInternalChapterId(chapterId + 1, patient);
  if (!player.unlockedChapters.includes(nextInternalId)) {
    player.unlockedChapters.push(nextInternalId);
  }

  save(data);
}

/**
 * Read stars for chapter + patient.
 * Default = female to keep old code working.
 */
export function getChapterStars(
  chapterId: number,
  patient: Patient = "female"
): number {
  const player = getActivePlayer();
  if (!player) return 0;

  const internalId = getInternalChapterId(chapterId, patient);
  return player.chapters[internalId]?.stars ?? 0;
}

/**
 * Is chapter unlocked for this patient?
 * Default = female to keep old code working.
 */
export function isChapterUnlocked(
  chapterId: number,
  patient: Patient = "female"
): boolean {
  const player = getActivePlayer();
  const internalId = getInternalChapterId(chapterId, patient);

  if (!player) {
    // default: first chapter unlocked for any patient
    return chapterId === 1;
  }

  return player.unlockedChapters.includes(internalId);
}
