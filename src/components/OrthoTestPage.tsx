import { words } from '../content';
import { DecodableWord } from './DecodableWord';

/**
 * Visual test page for the orthography component. Renders every word in the
 * bank, then isolates each grapheme feature type, then the blending guide.
 * Reachable at /dev/ortho (or #/dev/ortho).
 */
export function OrthoTestPage() {
  const plain = words.find((w) => w.graphemes.every((g) => !g.team && !g.macron && !g.silent));
  const withMacron = words.find((w) => w.graphemes.some((g) => g.macron));
  const withSilent = words.find((w) => w.graphemes.some((g) => g.silent));
  const withTeam = words.find((w) => w.graphemes.some((g) => g.team));

  return (
    <div className="ortho-test">
      <h1>Orthography test</h1>
      <p className="subtitle">Every grapheme type in the word bank, plus the blending guide.</p>

      <section>
        <h2>Feature types</h2>
        <div className="ortho-features">
          {plain && (
            <div className="ortho-feature">
              <span className="label">plain</span>
              <DecodableWord word={plain} />
            </div>
          )}
          {withMacron && (
            <div className="ortho-feature">
              <span className="label">macron</span>
              <DecodableWord word={withMacron} />
            </div>
          )}
          {withSilent && (
            <div className="ortho-feature">
              <span className="label">silent</span>
              <DecodableWord word={withSilent} />
            </div>
          )}
          {withTeam && (
            <div className="ortho-feature">
              <span className="label">team (arc)</span>
              <DecodableWord word={withTeam} />
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Blending guide (one dot per sound unit)</h2>
        <div className="ortho-features">
          {plain && <DecodableWord word={plain} showGuide />}
          {withTeam && <DecodableWord word={withTeam} showGuide />}
          {withSilent && <DecodableWord word={withSilent} showGuide />}
        </div>
      </section>

      <section>
        <h2>Every word in the bank</h2>
        <div className="ortho-grid">
          {words.map((w) => (
            <DecodableWord key={w.id} word={w} />
          ))}
        </div>
      </section>
    </div>
  );
}
