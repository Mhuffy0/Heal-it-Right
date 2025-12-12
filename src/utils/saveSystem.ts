// src/utils/saveSystem.ts

export type ChapterScore = {
  wrong: number; // 0..4 (4 = wrong all / failed)
};

export type PlayerProfile = {
  id: string;
  name: string;
  unlockedChapters: number[]; // internal ids (see below)
  chapters: { [chapterInternalId: number]: ChapterScore }; // internal ids
};

export type SaveData = {
  players: PlayerProfile[];
  activePlayerId: string | null;
};

const STORAGE_KEY = "healItRightSave_v1";

// local helper: which patient this progress is for
export type Patient = "female" | "male";

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

function getVisibleChapterId(internalId: number, patient: Patient) {
  return patient === "female" ? internalId : internalId - 100;
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(Number.isFinite(n) ? n : 0);
  return Math.max(min, Math.min(max, v));
}

/**
 * SAFETY: unlocked must be continuous (no gaps) per patient.
 * If chapter 6 unlocked => chapters 1..6 unlocked.
 */
function normalizeUnlockedForPatient(list: number[], patient: Patient): number[] {
  const prefix = patient === "female" ? 0 : 100;

  const cleaned = Array.from(new Set(list))
    .filter((id) => Number.isFinite(id))
    .map((id) => Math.floor(id))
    .filter((id) => {
      const visible = id - prefix;
      return visible >= 1 && visible <= 8;
    })
    .sort((a, b) => a - b);

  // find max unlocked visible chapter for that patient
  let maxVisible = 1; // always at least 1
  for (const internalId of cleaned) {
    const visible = internalId - prefix;
    if (visible >= 1 && visible <= 8) {
      if (visible > maxVisible) maxVisible = visible;
    }
  }

  const normalized: number[] = [];
  for (let c = 1; c <= maxVisible; c++) {
    normalized.push(prefix + c);
  }
  return normalized;
}

function normalizeProfile(p: PlayerProfile): PlayerProfile {
  const base = Array.isArray(p.unlockedChapters) ? p.unlockedChapters : [];
  const femaleNorm = normalizeUnlockedForPatient(base, "female");
  const maleNorm = normalizeUnlockedForPatient(base, "male");

  // merge + unique
  const merged = Array.from(new Set([...femaleNorm, ...maleNorm])).sort((a, b) => a - b);

  return {
    ...p,
    unlockedChapters: merged,
    chapters: p.chapters ?? {},
  };
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

    // safety normalize (fix old corrupted saves / gaps)
    const normalized: SaveData = {
      ...data,
      players: (data.players ?? []).map(normalizeProfile),
    };

    // persist normalization silently (prevents it coming back)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return getDefaultSave();
  }
}

function save(data: SaveData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createPlayer(name: string): PlayerProfile {
  const data = loadSave();

  const profile: PlayerProfile = normalizeProfile({
    id: crypto.randomUUID(),
    name: name.trim() || "Player",
    // unlock chapter 1 for BOTH patients by default
    unlockedChapters: [
      getInternalChapterId(1, "female"),
      getInternalChapterId(1, "male"),
    ],
    chapters: {},
  });

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

/* -------------------- Scoring (your rules) -------------------- */

export function chapterMaxScore(chapterId: number) {
  return chapterId >= 1 && chapterId <= 4 ? 10 : 15;
}

export function scoreFromWrong(chapterId: number, wrongCount: number) {
  const max = chapterMaxScore(chapterId);
  const step = max / 4; // 2.5 or 3.75
  const w = clampInt(wrongCount, 0, 4);
  const score = max - w * step;
  return Math.max(0, Math.min(max, score));
}

/* -------------------- Save / Read results -------------------- */

/**
 * Save chapter result for specific patient.
 * Store WRONG count (not stars).
 */
export function saveChapterResult(
  chapterId: number,
  wrongCount: number,
  patient: Patient = "female"
) {
  const data = loadSave();
  if (!data.activePlayerId) return;
  const playerIndex = data.players.findIndex((p) => p.id === data.activePlayerId);
  if (playerIndex < 0) return;

  const player = normalizeProfile(data.players[playerIndex]);

  const safeChapter = clampInt(chapterId, 1, 8);
  const internalId = getInternalChapterId(safeChapter, patient);

  // keep BEST attempt (higher score wins). If equal, keep lower wrong.
  const prevWrong = player.chapters[internalId]?.wrong;
  const prevScore = typeof prevWrong === "number" ? scoreFromWrong(safeChapter, prevWrong) : -1;

  const nextWrong = clampInt(wrongCount, 0, 4);
  const nextScore = scoreFromWrong(safeChapter, nextWrong);

  if (nextScore > prevScore) {
    player.chapters[internalId] = { wrong: nextWrong };
  } else if (nextScore === prevScore && typeof prevWrong === "number" && nextWrong < prevWrong) {
    player.chapters[internalId] = { wrong: nextWrong };
  } else if (prevScore < 0) {
    player.chapters[internalId] = { wrong: nextWrong };
  }

  // unlock next chapter (but never beyond 8)
  if (safeChapter < 8) {
    const nextInternalId = getInternalChapterId(safeChapter + 1, patient);
    player.unlockedChapters = Array.from(new Set([...player.unlockedChapters, nextInternalId]));
  }

  // SAFETY: enforce no gaps for this patient (and other patient too)
  const normalized = normalizeProfile(player);
  data.players[playerIndex] = normalized;

  save(data);
}

/**
 * Read wrong count for chapter + patient.
 */
export function getChapterWrong(
  chapterId: number,
  patient: Patient = "female"
): number {
  const player = getActivePlayer();
  if (!player) return 0;

  const safeChapter = clampInt(chapterId, 1, 8);
  const internalId = getInternalChapterId(safeChapter, patient);
  return clampInt(player.chapters[internalId]?.wrong ?? 0, 0, 4);
}

/**
 * Read score for chapter + patient.
 */
export function getChapterScore(
  chapterId: number,
  patient: Patient = "female"
): number {
  const wrong = getChapterWrong(chapterId, patient);
  const safeChapter = clampInt(chapterId, 1, 8);
  return scoreFromWrong(safeChapter, wrong);
}

/**
 * Is chapter unlocked for this patient?
 * Default = female to keep old calls working.
 */
export function isChapterUnlocked(
  chapterId: number,
  patient: Patient = "female"
): boolean {
  const player = getActivePlayer();
  const safeChapter = clampInt(chapterId, 1, 8);
  const internalId = getInternalChapterId(safeChapter, patient);

  if (!player) {
    return safeChapter === 1;
  }

  // in case save got edited externally, enforce safety at read time too
  const norm = normalizeProfile(player);
  return norm.unlockedChapters.includes(internalId);
}

/**
 * Optional helper: total score across 1..8 for a patient
 */
export function getTotalScore(patient: Patient = "female") {
  let total = 0;
  for (let c = 1; c <= 8; c++) total += getChapterScore(c, patient);
  return total;
}
