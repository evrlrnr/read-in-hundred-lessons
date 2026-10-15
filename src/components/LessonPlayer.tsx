import { useState } from 'react';
import type { Lesson, LessonTask } from '../types/content';
import type { ProfileFlags } from '../lib/progress';
import { soundById, wordById } from '../content';
import { DecodableWord } from './DecodableWord';

/**
 * ⚑ flag-for-review button (plan §5). Tappable one-handed (≥44px), shows an
 * outline flag when clear and a filled, colored flag when set.
 */
function FlagButton({ flagged, onToggle, label }: { flagged: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className={flagged ? 'flag-btn flagged' : 'flag-btn'}
      onClick={onToggle}
      aria-pressed={flagged}
      aria-label={`${flagged ? 'Remove flag from' : 'Flag for review'}: ${label}`}
      title={flagged ? 'Remove flag' : 'Flag for review'}
    >
      {flagged ? '⚑' : '⚐'}
    </button>
  );
}

/** Resolves a word id to its graphemes and renders the orthography + a flag. */
function Word({
  id,
  showGuide = false,
  flagged,
  onToggleFlag,
}: {
  id: string;
  showGuide?: boolean;
  flagged: boolean;
  onToggleFlag: () => void;
}) {
  const word = wordById.get(id);
  if (!word) return <span>{id}</span>;
  return (
    <div className={showGuide ? 'word-item guide' : 'word-item'}>
      <DecodableWord word={word} showGuide={showGuide} />
      <FlagButton flagged={flagged} onToggle={onToggleFlag} label={id} />
    </div>
  );
}

function SoundCard({
  soundId,
  big,
  flagged,
  onToggleFlag,
}: {
  soundId: string;
  big?: boolean;
  flagged: boolean;
  onToggleFlag: () => void;
}) {
  const sound = soundById.get(soundId);
  const display = sound?.display ?? soundId;
  return (
    <div className={big ? 'sound-item big' : 'sound-item'}>
      <span className={big ? 'sound-big' : 'sound-card'}>{display}</span>
      <FlagButton flagged={flagged} onToggle={onToggleFlag} label={display} />
    </div>
  );
}

const TASK_LABELS: Record<LessonTask['type'], string> = {
  newSound: 'New sound',
  soundReview: 'Sound review',
  blend: 'Say it slowly, say it fast',
  wordRead: 'Read the words',
  sentenceRead: 'Read the sentence',
};

function TaskView({
  task,
  flags,
  onToggleSound,
  onToggleWord,
}: {
  task: LessonTask;
  flags: ProfileFlags;
  onToggleSound: (id: string) => void;
  onToggleWord: (id: string) => void;
}) {
  switch (task.type) {
    case 'newSound':
      return (
        <div className="child-area">
          <SoundCard
            soundId={task.soundId}
            big
            flagged={flags.sounds.includes(task.soundId)}
            onToggleFlag={() => onToggleSound(task.soundId)}
          />
        </div>
      );
    case 'soundReview':
      return (
        <div className="child-area sound-grid">
          {task.soundIds.map((id) => (
            <SoundCard
              key={id}
              soundId={id}
              flagged={flags.sounds.includes(id)}
              onToggleFlag={() => onToggleSound(id)}
            />
          ))}
        </div>
      );
    case 'blend':
      return (
        <div className="child-area word-list">
          {task.wordIds.map((id) => (
            <Word
              key={id}
              id={id}
              showGuide
              flagged={flags.words.includes(id)}
              onToggleFlag={() => onToggleWord(id)}
            />
          ))}
        </div>
      );
    case 'wordRead':
      return (
        <div className="child-area word-list">
          {task.wordIds.map((id) => (
            <Word
              key={id}
              id={id}
              flagged={flags.words.includes(id)}
              onToggleFlag={() => onToggleWord(id)}
            />
          ))}
        </div>
      );
    case 'sentenceRead':
      return (
        <div className="child-area sentences">
          {task.text.map((sentence, i) => (
            <p key={i} className="sentence">
              {sentence.map((wordId, j) => (
                <Word
                  key={j}
                  id={wordId}
                  flagged={flags.words.includes(wordId)}
                  onToggleFlag={() => onToggleWord(wordId)}
                />
              ))}
              <span className="period">.</span>
            </p>
          ))}
        </div>
      );
  }
}

export function LessonPlayer({
  lesson,
  flags,
  onToggleSoundFlag,
  onToggleWordFlag,
  onExit,
  onComplete,
}: {
  lesson: Lesson;
  flags: ProfileFlags;
  onToggleSoundFlag: (soundId: string) => void;
  onToggleWordFlag: (wordId: string) => void;
  onExit: () => void;
  onComplete: (flaggedCount: number) => void;
}) {
  const [taskIndex, setTaskIndex] = useState(0);
  // Items the parent flagged ON during this run (used for the repeat-lesson rule).
  const [flaggedThisLesson, setFlaggedThisLesson] = useState<Set<string>>(new Set());
  const task = lesson.tasks[taskIndex];
  const isLast = taskIndex === lesson.tasks.length - 1;

  const toggleSound = (id: string) => {
    const wasFlagged = flags.sounds.includes(id);
    onToggleSoundFlag(id);
    setFlaggedThisLesson((prev) => {
      const next = new Set(prev);
      if (wasFlagged) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleWord = (id: string) => {
    const wasFlagged = flags.words.includes(id);
    onToggleWordFlag(id);
    setFlaggedThisLesson((prev) => {
      const next = new Set(prev);
      if (wasFlagged) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="player">
      <header className="player-header">
        <button className="link-btn" onClick={onExit}>
          ← Exit
        </button>
        <span>
          Lesson {lesson.lesson} · {TASK_LABELS[task.type]}
        </span>
        <span className="dots">
          {lesson.tasks.map((_, i) => (
            <span key={i} className={i === taskIndex ? 'dot active' : 'dot'} />
          ))}
        </span>
      </header>

      <section className="adult-strip" aria-label="Parent script">
        {task.script.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </section>

      <TaskView task={task} flags={flags} onToggleSound={toggleSound} onToggleWord={toggleWord} />

      <footer className="controls">
        <button className="nav-btn" disabled={taskIndex === 0} onClick={() => setTaskIndex(taskIndex - 1)}>
          Back
        </button>
        <button
          className="nav-btn primary"
          onClick={() => (isLast ? onComplete(flaggedThisLesson.size) : setTaskIndex(taskIndex + 1))}
        >
          {isLast ? 'Finish lesson' : 'Next'}
        </button>
      </footer>
    </div>
  );
}
