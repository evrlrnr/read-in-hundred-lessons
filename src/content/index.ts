import soundsJson from './sounds.json';
import wordsJson from './words.json';
import type { Sound, Word, Lesson } from '../types/content';

export const sounds = soundsJson as Sound[];
export const words = wordsJson as Word[];

const lessonModules = import.meta.glob('./lessons/*.json', { eager: true });
export const lessons = Object.values(lessonModules)
  .map((m) => ((m as { default?: Lesson }).default ?? m) as Lesson)
  .sort((a, b) => a.lesson - b.lesson);

export const soundById = new Map(sounds.map((s) => [s.id, s]));
export const wordById = new Map(words.map((w) => [w.id, w]));
