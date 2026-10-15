// Mastery grid logic (H-C1). Pure derivation from practiceStats + flags.
//
// States per sound:
//   - "new":       never practiced (no entry in practiceStats)
//   - "learning":  practiced but not yet mastered
//   - "mastered":  seen >= 4 AND missed/seen < 0.5 AND not currently flagged
//
// A sound is only shown in the grid if it has been introduced (introducedInLesson
// <= the child's currentLesson).

import type { Profile } from './progress';
import type { Sound } from '../types/content';

export type MasteryState = 'new' | 'learning' | 'mastered';

export function getMasteryState(
  sound: Sound,
  profile: Profile
): MasteryState {
  // Not yet introduced to this child
  if (sound.introducedInLesson > profile.currentLesson) return 'new';

  // Currently flagged → not mastered
  if (profile.flags.sounds.includes(sound.id)) return 'learning';

  const stats = profile.practiceStats[sound.id];
  if (!stats || stats.seen === 0) return 'new';

  if (stats.seen >= 4 && stats.missed / stats.seen < 0.5) return 'mastered';
  return 'learning';
}

export function getMasteryGrid(
  sounds: Sound[],
  profile: Profile
): { sound: Sound; state: MasteryState }[] {
  return sounds
    .filter((s) => s.introducedInLesson <= profile.currentLesson)
    .map((s) => ({ sound: s, state: getMasteryState(s, profile) }));
}
