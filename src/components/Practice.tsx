import { useMemo, useState } from 'react';
import type { Profile } from '../lib/progress';
import { buildDeck, applyOutcome, type Card, type CardOutcome } from '../lib/deck';
import type { Sound, Word, Lesson } from '../types/content';
import { DecodableWord } from './DecodableWord';

/**
 * Practice mode (plan §5/§6): flashcard deck. Tap to flip; "Got it" / "Needs
 * work" buttons at the bottom. One-handed: all controls at screen bottom.
 */
export function Practice({
  profile,
  sounds,
  words,
  lessons,
  onApplyOutcome,
  onBack,
}: {
  profile: Profile;
  sounds: Sound[];
  words: Word[];
  lessons: Lesson[];
  onApplyOutcome: (card: Card, outcome: CardOutcome) => void;
  onBack: () => void;
}) {
  // Build the deck once when the component mounts (or when profile changes).
  // Seed: use a date-based seed for production variety.
  const seed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  const initialDeck = useMemo(
    () => buildDeck(profile, { sounds, words, lessons }, seed),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // build once on mount
  );

  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<{ got: number; missed: number }>({ got: 0, missed: 0 });

  const current = deck[index];
  const done = index >= deck.length;

  const soundById = useMemo(() => new Map(sounds.map((s) => [s.id, s])), [sounds]);
  const wordById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words]);

  const handleOutcome = (outcome: CardOutcome) => {
    if (!current) return;
    onApplyOutcome(current, outcome);
    setResults((r) => ({
      got: r.got + (outcome === 'got' ? 1 : 0),
      missed: r.missed + (outcome === 'missed' ? 1 : 0),
    }));
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    const newDeck = buildDeck(profile, { sounds, words, lessons }, seed);
    setDeck(newDeck);
    setIndex(0);
    setFlipped(false);
    setResults({ got: 0, missed: 0 });
  };

  if (deck.length === 0) {
    return (
      <main className="practice">
        <header className="dash-header">
          <button className="link-btn" onClick={onBack}>← Back</button>
          <h1>Practice</h1>
        </header>
        <div className="practice-empty">
          <p>Nothing to practice right now. 🌟</p>
          <p className="practice-empty-sub">Complete more lessons or flag items to build a deck.</p>
          <button className="nav-btn" onClick={onBack}>Back</button>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="practice">
        <header className="dash-header">
          <button className="link-btn" onClick={onBack}>← Back</button>
          <h1>Practice</h1>
        </header>
        <div className="practice-done">
          <h2>Done!</h2>
          <p className="practice-summary">
            {results.got} got it · {results.missed} needs work
          </p>
          <button className="nav-btn primary" onClick={restart}>Practice again</button>
          <button className="nav-btn" onClick={onBack}>Back</button>
        </div>
      </main>
    );
  }

  // Resolve card content
  let cardContent: React.ReactNode;
  let cardHint: string;
  if (current.type === 'sound') {
    const sound = soundById.get(current.id);
    cardContent = <span className="practice-sound">{sound?.display ?? current.id}</span>;
    cardHint = sound?.hint ?? '';
  } else {
    const word = wordById.get(current.id);
    cardContent = word ? <DecodableWord word={word} /> : <span>{current.id}</span>;
    cardHint = 'Read this word';
  }

  return (
    <main className="practice">
      <header className="dash-header">
        <button className="link-btn" onClick={onBack}>← Back</button>
        <h1>Practice</h1>
      </header>

      <div className="practice-progress">
        <span>{index + 1} / {deck.length}</span>
      </div>

      <button
        className={`practice-card ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Card showing hint' : 'Card showing front, tap to flip'}
      >
        <span className="practice-card-front">
          {cardContent}
        </span>
        <span className="practice-card-back">
          <span className="practice-hint">{cardHint}</span>
        </span>
      </button>

      <div className="practice-controls">
        <button className="nav-btn" onClick={() => handleOutcome('missed')}>
          Needs work
        </button>
        <button className="nav-btn primary" onClick={() => handleOutcome('got')}>
          Got it
        </button>
      </div>
    </main>
  );
}
