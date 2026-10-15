import { useCallback, useState } from 'react';
import {
  type ProgressState,
  loadState,
  saveState,
  addProfile,
  renameProfile,
  deleteProfile,
  setActiveProfile,
  completeLesson,
  toggleSoundFlag,
  toggleWordFlag,
  importState,
  mergeProfiles,
  type ImportResult,
} from '../lib/progress';
import { applyOutcome, type Card, type CardOutcome } from '../lib/deck';

// Thin React wrapper over the pure progress store. Persists on every change.
export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadState());

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);

  return {
    state,
    addProfile: (name: string) => update((s) => addProfile(s, name)),
    renameProfile: (id: string, name: string) => update((s) => renameProfile(s, id, name)),
    deleteProfile: (id: string) => update((s) => deleteProfile(s, id)),
    setActiveProfile: (id: string) => update((s) => setActiveProfile(s, id)),
    completeLesson: (profileId: string, lesson: number, repeated = false) =>
      update((s) => completeLesson(s, profileId, lesson, repeated)),
    toggleSoundFlag: (profileId: string, soundId: string) =>
      update((s) => toggleSoundFlag(s, profileId, soundId)),
    toggleWordFlag: (profileId: string, wordId: string) =>
      update((s) => toggleWordFlag(s, profileId, wordId)),
    importReplace: (json: string): ImportResult => {
      const r = importState(json);
      if (r.ok) update(() => r.state);
      return r;
    },
    importAdd: (json: string): ImportResult => {
      const r = importState(json);
      if (r.ok) update((s) => mergeProfiles(s, r.state));
      return r;
    },
    applyOutcome: (profileId: string, card: Card, outcome: CardOutcome) =>
      update((s) => ({
        ...s,
        profiles: s.profiles.map((p) =>
          p.id === profileId ? applyOutcome(p, card, outcome) : p
        ),
      })),
  };
}
