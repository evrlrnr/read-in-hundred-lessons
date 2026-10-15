// Practice deck algorithm (plan §6, spec in DECK_ALGORITHM.md).
// Pure function — no React, no DOM. Testable under `node --test`.
//
// Rules (priority order):
//   1. Flagged — every id in flags.sounds / flags.words
//   2. Recent  — sounds from the last 3 completed lessons
//   3. Struggling — practiceStats items with seen>=4 AND missed/seen>=0.5
//
// Cap: 15 cards. Within each rule, deterministic seeded shuffle (mulberry32 + Fisher-Yates).

import type { Profile } from './progress';
import type { Sound, Word, Lesson } from '../types/content';

export interface Card {
  type: 'sound' | 'word';
  id: string;
}

export interface DeckContent {
  sounds: Sound[];
  words: Word[];
  lessons: Lesson[];
}

const DECK_CAP = 15;

// ---- PRNG + shuffle -------------------------------------------------------

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- main -----------------------------------------------------------------

export function buildDeck(profile: Profile, content: DeckContent, seed: number): Card[] {
  const rand = mulberry32(seed);
  const deck: Card[] = [];
  const included = new Set<string>(); // "type:id" keys

  // Rule 1: Flagged
  const flagged: Card[] = [
    ...profile.flags.sounds.map((id) => ({ type: 'sound' as const, id })),
    ...profile.flags.words.map((id) => ({ type: 'word' as const, id })),
  ];
  for (const card of shuffle(flagged, rand)) {
    if (deck.length >= DECK_CAP) break;
    const key = `${card.type}:${card.id}`;
    if (!included.has(key)) {
      deck.push(card);
      included.add(key);
    }
  }

  // Rule 2: Recent — sounds from last 3 completed lessons
  const recentLessons = profile.lessonHistory.slice(-3);
  const recentSoundIds = new Set<string>();
  for (const entry of recentLessons) {
    const lesson = content.lessons.find((l) => l.lesson === entry.lesson);
    if (lesson) {
      for (const sid of lesson.newSoundIds) recentSoundIds.add(sid);
    }
  }
  const recentCards: Card[] = [];
  for (const sid of recentSoundIds) {
    if (!included.has(`sound:${sid}`)) {
      recentCards.push({ type: 'sound', id: sid });
    }
  }
  for (const card of shuffle(recentCards, rand)) {
    if (deck.length >= DECK_CAP) break;
    const key = `${card.type}:${card.id}`;
    if (!included.has(key)) {
      deck.push(card);
      included.add(key);
    }
  }

  // Rule 3: Struggling — seen>=4 AND missed/seen>=0.5, not already in deck
  const soundIds = new Set(content.sounds.map((s) => s.id));
  const wordIds = new Set(content.words.map((w) => w.id));
  const strugglingCards: Card[] = [];
  for (const [id, stats] of Object.entries(profile.practiceStats)) {
    if (stats.seen >= 4 && stats.missed / stats.seen >= 0.5) {
      // Resolve type: sound list first, then word list
      const type: 'sound' | 'word' = soundIds.has(id) ? 'sound' : 'word';
      const key = `${type}:${id}`;
      if (!included.has(key)) {
        strugglingCards.push({ type, id });
      }
    }
  }
  for (const card of shuffle(strugglingCards, rand)) {
    if (deck.length >= DECK_CAP) break;
    const key = `${card.type}:${card.id}`;
    if (!included.has(key)) {
      deck.push(card);
      included.add(key);
    }
  }

  return deck;
}

// ---- card outcome (practice interaction) ----------------------------------

export type CardOutcome = 'got' | 'missed';

/**
 * Apply a practice outcome to the profile's practiceStats and flags.
 * Returns a new profile (pure).
 *
 * - "got": seen++, streak++. If streak >= 2 → clear flag, streak = 0.
 * - "missed": seen++, missed++, streak = 0, ensure flagged.
 */
export function applyOutcome(profile: Profile, card: Card, outcome: CardOutcome): Profile {
  const stats = { ...profile.practiceStats };
  const prev = stats[card.id] ?? { seen: 0, missed: 0, streak: 0 };

  if (outcome === 'got') {
    const streak = prev.streak + 1;
    if (streak >= 2) {
      // Clear the flag and reset streak
      stats[card.id] = { seen: prev.seen + 1, missed: prev.missed, streak: 0 };
      const flags = { ...profile.flags };
      if (card.type === 'sound') {
        flags.sounds = flags.sounds.filter((s) => s !== card.id);
      } else {
        flags.words = flags.words.filter((w) => w !== card.id);
      }
      return { ...profile, practiceStats: stats, flags };
    }
    stats[card.id] = { seen: prev.seen + 1, missed: prev.missed, streak };
  } else {
    // "missed"
    stats[card.id] = { seen: prev.seen + 1, missed: prev.missed + 1, streak: 0 };
    const flags = { ...profile.flags };
    if (card.type === 'sound' && !flags.sounds.includes(card.id)) {
      flags.sounds = [...flags.sounds, card.id];
    } else if (card.type === 'word' && !flags.words.includes(card.id)) {
      flags.words = [...flags.words, card.id];
    }
    return { ...profile, practiceStats: stats, flags };
  }

  return { ...profile, practiceStats: stats };
}
