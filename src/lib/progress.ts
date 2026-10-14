// Progress store — pure logic, no React, no DOM. Testable under `node --test`.
//
// Schema (plan §7), localStorage key `phonics.v1`:
//   { version, activeProfileId, profiles: [ { id, name, createdAt,
//     currentLesson, lessonHistory, flags: {sounds, words}, practiceStats } ] }
//
// Design decisions (recorded in loop-knowledge.md, Run 5):
//   - Mutations are pure: they take a state and return a new one. The React
//     layer (useProgress) is the only thing that touches storage.
//   - Import = parse -> migrate -> validate. Two modes: replace-all, or
//     add-as-new-profiles (profiles are the merge unit; ids re-minted on
//     collision so no field-level merging is ever needed).
//   - Corrupt or invalid stored data falls back to a fresh empty state.

export const STORAGE_KEY = 'phonics.v1';
export const CURRENT_VERSION = 1;

export interface LessonHistoryEntry {
  lesson: number;
  completedAt: string;
  repeated: boolean;
}

export interface PracticeStat {
  seen: number;
  missed: number;
  streak: number;
}

export interface ProfileFlags {
  sounds: string[];
  words: string[];
}

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  /** Next lesson to work on (1-based). */
  currentLesson: number;
  lessonHistory: LessonHistoryEntry[];
  flags: ProfileFlags;
  practiceStats: Record<string, PracticeStat>;
}

export interface ProgressState {
  version: number;
  activeProfileId: string | null;
  profiles: Profile[];
}

// ---- construction ---------------------------------------------------------

export function emptyState(): ProgressState {
  return { version: CURRENT_VERSION, activeProfileId: null, profiles: [] };
}

export function newId(prefix: string): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${t}_${r}`;
}

export function newProfile(name: string): Profile {
  return {
    id: newId('p'),
    name: name.trim() || 'Child',
    createdAt: new Date().toISOString(),
    currentLesson: 1,
    lessonHistory: [],
    flags: { sounds: [], words: [] },
    practiceStats: {},
  };
}

// ---- persistence ----------------------------------------------------------

export function loadState(storage?: Storage): ProgressState {
  if (!storage) return emptyState();
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return emptyState();
  }
  if (raw === null) return emptyState();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return emptyState();
  }
  const migrated = migrate(parsed);
  if (validateProgress(migrated).length > 0) return emptyState();
  return migrated;
}

export function saveState(state: ProgressState, storage?: Storage): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private-mode write block — non-fatal for the app.
  }
}

// ---- migrations (version gating) -----------------------------------------

// v1 is current. When a v2 ships, add a step here:
//   if (d.version === 1) d = migrateV1toV2(d);
export function migrate(data: unknown): ProgressState {
  const d = (data ?? {}) as Partial<ProgressState>;
  // Preserve the incoming version so validateProgress can reject unknown ones.
  // A future v2 adds a migration step here (v1 -> v2) and bumps CURRENT_VERSION.
  return {
    version: typeof d.version === 'number' ? d.version : -1,
    activeProfileId: typeof d.activeProfileId === 'string' ? d.activeProfileId : null,
    profiles: Array.isArray(d.profiles) ? (d.profiles as Profile[]) : [],
  };
}

// ---- validation -----------------------------------------------------------

export function validateProgress(obj: unknown): string[] {
  if (typeof obj !== 'object' || obj === null) return ['not an object'];
  const d = obj as Record<string, unknown>;
  const errors: string[] = [];
  if (d.version !== CURRENT_VERSION) errors.push(`unsupported version: ${String(d.version)}`);
  if (!Array.isArray(d.profiles)) {
    errors.push('profiles must be an array');
    return errors;
  }
  (d.profiles as unknown[]).forEach((p, i) => {
    if (typeof p !== 'object' || p === null) {
      errors.push(`profile ${i}: not an object`);
      return;
    }
    const prof = p as Record<string, unknown>;
    if (typeof prof.id !== 'string') errors.push(`profile ${i}: missing id`);
    if (typeof prof.name !== 'string') errors.push(`profile ${i}: missing name`);
    if (typeof prof.currentLesson !== 'number') errors.push(`profile ${i}: currentLesson must be a number`);
    if (!Array.isArray(prof.lessonHistory)) errors.push(`profile ${i}: lessonHistory must be an array`);
    if (typeof prof.flags !== 'object' || prof.flags === null) errors.push(`profile ${i}: flags must be an object`);
    if (typeof prof.practiceStats !== 'object' || prof.practiceStats === null)
      errors.push(`profile ${i}: practiceStats must be an object`);
  });
  return errors;
}

// ---- mutations (pure) -----------------------------------------------------

function updateProfile(state: ProgressState, id: string, fn: (p: Profile) => Profile): ProgressState {
  return { ...state, profiles: state.profiles.map((p) => (p.id === id ? fn(p) : p)) };
}

function toggleInArray(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function addProfile(state: ProgressState, name: string): ProgressState {
  const profile = newProfile(name);
  return {
    ...state,
    profiles: [...state.profiles, profile],
    activeProfileId: state.activeProfileId ?? profile.id,
  };
}

export function renameProfile(state: ProgressState, id: string, name: string): ProgressState {
  return updateProfile(state, id, (p) => ({ ...p, name: name.trim() || p.name }));
}

export function deleteProfile(state: ProgressState, id: string): ProgressState {
  const profiles = state.profiles.filter((p) => p.id !== id);
  const activeProfileId =
    state.activeProfileId === id ? (profiles[0]?.id ?? null) : state.activeProfileId;
  return { ...state, profiles, activeProfileId };
}

export function setActiveProfile(state: ProgressState, id: string): ProgressState {
  if (!state.profiles.some((p) => p.id === id)) return state;
  return { ...state, activeProfileId: id };
}

export function completeLesson(
  state: ProgressState,
  profileId: string,
  lesson: number,
  repeated = false
): ProgressState {
  return updateProfile(state, profileId, (p) => ({
    ...p,
    currentLesson: Math.max(p.currentLesson, lesson + 1),
    lessonHistory: [
      ...p.lessonHistory,
      { lesson, completedAt: new Date().toISOString(), repeated },
    ],
  }));
}

export function toggleSoundFlag(state: ProgressState, profileId: string, soundId: string): ProgressState {
  return updateProfile(state, profileId, (p) => ({
    ...p,
    flags: { ...p.flags, sounds: toggleInArray(p.flags.sounds, soundId) },
  }));
}

export function toggleWordFlag(state: ProgressState, profileId: string, wordId: string): ProgressState {
  return updateProfile(state, profileId, (p) => ({
    ...p,
    flags: { ...p.flags, words: toggleInArray(p.flags.words, wordId) },
  }));
}

// ---- export / import ------------------------------------------------------

export function exportState(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export type ImportResult = { ok: true; state: ProgressState } | { ok: false; errors: string[] };

// Replace-all: parse + migrate + validate the whole object.
export function importState(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { ok: false, errors: [`invalid JSON: ${(e as Error).message}`] };
  }
  const migrated = migrate(parsed);
  const errors = validateProgress(migrated);
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, state: migrated };
}

// Add-as-new-profiles: append imported profiles to current. Profiles are the
// merge unit — on an id collision the imported profile is re-minted so both
// are kept and no field-level merging is ever required.
export function mergeProfiles(current: ProgressState, imported: ProgressState): ProgressState {
  const existingIds = new Set(current.profiles.map((p) => p.id));
  const added = imported.profiles.map((p) => (existingIds.has(p.id) ? { ...p, id: newId('p') } : p));
  return { ...current, profiles: [...current.profiles, ...added] };
}
