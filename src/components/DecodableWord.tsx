import { useLayoutEffect, useRef, useState } from 'react';
import type { Word } from '../types/content';

/**
 * Renders a word with full orthography markup:
 *  - letter teams: a small SVG arc drawn beneath the team
 *  - macrons: a drawn bar above the grapheme (CSS ::after, not text-decoration)
 *  - silent letters: small + faded
 *  - sounding-out guide (blend tasks only): an arrow with one dot per sound unit
 *
 * The guide's dot positions are measured from the rendered grapheme spans after
 * layout, so they track the actual on-screen letter positions.
 */
export function DecodableWord({
  word,
  showGuide = false,
}: {
  word: Word;
  showGuide?: boolean;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [guide, setGuide] = useState<{ width: number; centers: number[] } | null>(null);

  useLayoutEffect(() => {
    if (!showGuide) {
      setGuide(null);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const centers: number[] = [];
    word.graphemes.forEach((g, i) => {
      if (g.silent) return; // one dot per sound unit, not per letter
      const el = spanRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      centers.push(r.left - cRect.left + r.width / 2);
    });
    setGuide({ width: cRect.width, centers });
  }, [word, showGuide]);

  return (
    <span className="dw" ref={containerRef}>
      <span className="dw-letters">
        {word.graphemes.map((g, i) => (
          <span
            key={i}
            ref={(el) => {
              spanRefs.current[i] = el;
            }}
            className={[
              'dw-g',
              g.silent ? 'silent' : '',
              g.macron ? 'macron' : '',
              g.team ? 'team' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {g.g}
            {g.team && (
              <svg className="dw-arc" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M 4 18 Q 50 2 96 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        ))}
      </span>
      {showGuide && guide && (
        <svg
          className="dw-guide"
          width={guide.width}
          height={28}
          viewBox={`0 0 ${guide.width} 28`}
          aria-hidden="true"
        >
          <line x1={0} y1={14} x2={guide.width - 8} y2={14} stroke="currentColor" strokeWidth={2} />
          <polygon
            points={`${guide.width},14 ${guide.width - 9},9 ${guide.width - 9},19`}
            fill="currentColor"
          />
          {guide.centers.map((cx, i) => (
            <circle key={i} cx={cx} cy={14} r={4} fill="currentColor" />
          ))}
        </svg>
      )}
    </span>
  );
}
