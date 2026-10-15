import type { Profile } from '../lib/progress';
import type { Sound } from '../types/content';
import { MasteryGrid } from './MasteryGrid';

/**
 * Per-child dashboard (plan §5): "Continue Lesson N" primary button, a progress
 * bar, a Practice entry point, Settings (export/import), and a mastery grid.
 * Also surfaces how many items are currently flagged.
 */
export function Dashboard({
  profile,
  totalLessons,
  sounds,
  onBack,
  onContinue,
  onPractice,
  onSettings,
}: {
  profile: Profile;
  totalLessons: number;
  sounds: Sound[];
  onBack: () => void;
  onContinue: () => void;
  onPractice: () => void;
  onSettings: () => void;
}) {
  const done = Math.min(profile.currentLesson - 1, totalLessons);
  const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;
  const hasCurrent = profile.currentLesson <= totalLessons;
  const flaggedCount = profile.flags.sounds.length + profile.flags.words.length;

  return (
    <main className="dashboard">
      <header className="dash-header">
        <button className="link-btn" onClick={onBack}>
          ← All children
        </button>
        <h1>{profile.name}</h1>
      </header>

      <div className="progress-block">
        <div className="progress-label">
          <span>
            {done} of {totalLessons} lessons
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lesson progress"
        >
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {hasCurrent ? (
        <button className="nav-btn primary big" onClick={onContinue}>
          Continue Lesson {profile.currentLesson}
        </button>
      ) : (
        <p className="all-done">All {totalLessons} lessons done for now. 🌟</p>
      )}

      <div className="dash-actions">
        <button className="nav-btn" onClick={onPractice}>
          Practice
        </button>
        <button className="nav-btn" onClick={onSettings}>
          Settings
        </button>
      </div>

      {flaggedCount > 0 && (
        <p className="flag-note">
          ⚑ {flaggedCount} item{flaggedCount === 1 ? '' : 's'} flagged for review
        </p>
      )}

      <section className="dash-section">
        <h2>Sound mastery</h2>
        <MasteryGrid profile={profile} sounds={sounds} />
      </section>
    </main>
  );
}
