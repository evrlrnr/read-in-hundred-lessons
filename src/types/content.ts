export interface Sound {
  id: string;
  display: string;
  team?: boolean;
  macron?: boolean;
  hint: string;
  introducedInLesson: number;
  sayItScript: string;
}

export interface Grapheme {
  g: string;
  soundId?: string;
  team?: boolean;
  macron?: boolean;
  silent?: boolean;
}

export interface Word {
  id: string;
  graphemes: Grapheme[];
}

export type LessonTask =
  | { type: 'newSound'; soundId: string; script: string[] }
  | { type: 'soundReview'; soundIds: string[]; script: string[] }
  | { type: 'blend'; wordIds: string[]; script: string[] }
  | { type: 'wordRead'; wordIds: string[]; script: string[] }
  | { type: 'sentenceRead'; text: string[][]; script: string[] };

export interface Lesson {
  lesson: number;
  newSoundIds: string[];
  tasks: LessonTask[];
}
