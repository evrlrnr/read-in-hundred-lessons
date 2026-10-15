import type { Profile } from '../lib/progress';
import type { Sound } from '../types/content';
import { getMasteryGrid, type MasteryState } from '../lib/mastery';

/**
 * Mastery grid (plan §5): per-sound status at a glance.
 * Green = mastered, yellow = learning, gray = new (introduced but not yet practiced).
 */
export function MasteryGrid({
  profile,
  sounds,
}: {
  profile: Profile;
  sounds: Sound[];
}) {
  const grid = getMasteryGrid(sounds, profile);

  if (grid.length === 0) {
    return <p className="mastery-empty">No sounds introduced yet.</p>;
  }

  const counts = { mastered: 0, learning: 0, new: 0 };
  for (const item of grid) counts[item.state]++;

  return (
    <div className="mastery">
      <div className="mastery-legend">
        <span className="mastery-legend-item mastered">● Mastered ({counts.mastered})</span>
        <span className="mastery-legend-item learning">● Learning ({counts.learning})</span>
        <span className="mastery-legend-item new">● New ({counts.new})</span>
      </div>
      <div className="mastery-grid" role="list" aria-label="Sound mastery">
        {grid.map(({ sound, state }) => (
          <div
            key={sound.id}
            role="listitem"
            className={`mastery-cell ${state}`}
            title={`${sound.display} — ${state}`}
          >
            <span className="mastery-cell-sound">{sound.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
