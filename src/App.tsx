import { useState } from 'react';
import { lessons, soundById } from './content';
import { LessonPlayer } from './components/LessonPlayer';

type Screen =
  | { view: 'home' }
  | { view: 'lesson'; n: number }
  | { view: 'complete'; n: number };

export function App() {
  const [screen, setScreen] = useState<Screen>({ view: 'home' });

  if (screen.view === 'lesson') {
    const lesson = lessons.find((l) => l.lesson === screen.n)!;
    return (
      <LessonPlayer
        lesson={lesson}
        onExit={() => setScreen({ view: 'home' })}
        onComplete={() => setScreen({ view: 'complete', n: screen.n })}
      />
    );
  }

  if (screen.view === 'complete') {
    const next = lessons.find((l) => l.lesson === screen.n + 1);
    return (
      <div className="complete">
        <h1>🎉 Lesson {screen.n} done!</h1>
        <p>Great reading today. Give a high five!</p>
        {next ? (
          <button className="nav-btn primary" onClick={() => setScreen({ view: 'lesson', n: next.lesson })}>
            Start lesson {next.lesson}
          </button>
        ) : (
          <p className="all-done">That's every lesson so far — amazing work! 🌟</p>
        )}
        <button className="nav-btn" onClick={() => setScreen({ view: 'home' })}>
          Back to lessons
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <h1>Reading Lessons</h1>
      <p className="subtitle">Pick a lesson to begin. The gray strip shows you what to say.</p>
      <ul className="lesson-list">
        {lessons.map((l) => (
          <li key={l.lesson}>
            <button className="lesson-btn" onClick={() => setScreen({ view: 'lesson', n: l.lesson })}>
              <strong>Lesson {l.lesson}</strong>
              <span>
                {l.newSoundIds.length > 0
                  ? 'New: ' + l.newSoundIds.map((id) => soundById.get(id)?.display ?? id).join(', ')
                  : 'Review day'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
