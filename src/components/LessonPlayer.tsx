import { useState } from 'react';
import type { Lesson, LessonTask } from '../types/content';
import { soundById, wordById } from '../content';

// Basic word rendering for M2. M3 replaces this with the full
// orthography component (SVG team arcs, blending arrows).
export function WordText({ id }: { id: string }) {
  const word = wordById.get(id);
  if (!word) return <span>{id}</span>;
  return (
    <span className="word">
      {word.graphemes.map((g, i) => (
        <span key={i} className={`${g.silent ? 'silent' : ''} ${g.macron ? 'macron' : ''}`}>
          {g.g}
        </span>
      ))}
    </span>
  );
}

function SoundCard({ soundId, big }: { soundId: string; big?: boolean }) {
  const sound = soundById.get(soundId);
  return <span className={big ? 'sound-big' : 'sound-card'}>{sound?.display ?? soundId}</span>;
}

const TASK_LABELS: Record<LessonTask['type'], string> = {
  newSound: 'New sound',
  soundReview: 'Sound review',
  blend: 'Say it slowly, say it fast',
  wordRead: 'Read the words',
  sentenceRead: 'Read the sentence',
};

function TaskView({ task }: { task: LessonTask }) {
  switch (task.type) {
    case 'newSound':
      return <div className="child-area"><SoundCard soundId={task.soundId} big /></div>;
    case 'soundReview':
      return (
        <div className="child-area sound-grid">
          {task.soundIds.map((id) => <SoundCard key={id} soundId={id} />)}
        </div>
      );
    case 'blend':
    case 'wordRead':
      return (
        <div className="child-area word-list">
          {task.wordIds.map((id) => <WordText key={id} id={id} />)}
        </div>
      );
    case 'sentenceRead':
      return (
        <div className="child-area sentences">
          {task.text.map((sentence, i) => (
            <p key={i} className="sentence">
              {sentence.map((wordId, j) => <WordText key={j} id={wordId} />)}
              <span className="period">.</span>
            </p>
          ))}
        </div>
      );
  }
}

export function LessonPlayer({
  lesson,
  onExit,
  onComplete,
}: {
  lesson: Lesson;
  onExit: () => void;
  onComplete: () => void;
}) {
  const [taskIndex, setTaskIndex] = useState(0);
  const task = lesson.tasks[taskIndex];
  const isLast = taskIndex === lesson.tasks.length - 1;

  return (
    <div className="player">
      <header className="player-header">
        <button className="link-btn" onClick={onExit}>← Exit</button>
        <span>Lesson {lesson.lesson} · {TASK_LABELS[task.type]}</span>
        <span className="dots">
          {lesson.tasks.map((_, i) => (
            <span key={i} className={i === taskIndex ? 'dot active' : 'dot'} />
          ))}
        </span>
      </header>

      <section className="adult-strip" aria-label="Parent script">
        {task.script.map((line, i) => <p key={i}>{line}</p>)}
      </section>

      <TaskView task={task} />

      <footer className="controls">
        <button
          className="nav-btn"
          disabled={taskIndex === 0}
          onClick={() => setTaskIndex(taskIndex - 1)}
        >
          Back
        </button>
        <button
          className="nav-btn primary"
          onClick={() => (isLast ? onComplete() : setTaskIndex(taskIndex + 1))}
        >
          {isLast ? 'Finish lesson' : 'Next'}
        </button>
      </footer>
    </div>
  );
}
