import { useState } from 'react';
import { lessons, sounds, words } from './content';
import { useProgress } from './hooks/useProgress';
import { LessonPlayer } from './components/LessonPlayer';
import { OrthoTestPage } from './components/OrthoTestPage';
import { ProfileHome } from './components/ProfileHome';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { CompleteScreen } from './components/CompleteScreen';
import { Practice } from './components/Practice';
import { MasteryGrid } from './components/MasteryGrid';

type Screen =
  | { view: 'home' }
  | { view: 'dashboard'; profileId: string }
  | { view: 'lesson'; profileId: string; n: number; repeat: boolean }
  | { view: 'complete'; profileId: string; n: number; flaggedCount: number }
  | { view: 'settings' }
  | { view: 'practice'; profileId: string };

// Dev-only visual test page for the orthography component.
const isDevOrtho =
  typeof window !== 'undefined' &&
  (window.location.pathname.endsWith('/dev/ortho') || window.location.hash === '#/dev/ortho');

function Missing({ onHome }: { onHome: () => void }) {
  return (
    <main className="complete">
      <h1>Oops</h1>
      <p>That page isn't available.</p>
      <button className="nav-btn" onClick={onHome}>
        Back to home
      </button>
    </main>
  );
}

export function App() {
  const progress = useProgress();
  const [screen, setScreen] = useState<Screen>({ view: 'home' });

  if (isDevOrtho) {
    return <OrthoTestPage />;
  }

  const profileFor = (id: string) => progress.state.profiles.find((p) => p.id === id) ?? null;
  const goHome = () => setScreen({ view: 'home' });

  if (screen.view === 'lesson') {
    const profile = profileFor(screen.profileId);
    const lesson = lessons.find((l) => l.lesson === screen.n);
    if (!profile || !lesson) return <Missing onHome={goHome} />;
    return (
      <LessonPlayer
        lesson={lesson}
        flags={profile.flags}
        onToggleSoundFlag={(sid) => progress.toggleSoundFlag(profile.id, sid)}
        onToggleWordFlag={(wid) => progress.toggleWordFlag(profile.id, wid)}
        onExit={() => setScreen({ view: 'dashboard', profileId: profile.id })}
        onComplete={(flaggedCount) => {
          progress.completeLesson(profile.id, screen.n, screen.repeat);
          setScreen({ view: 'complete', profileId: profile.id, n: screen.n, flaggedCount });
        }}
      />
    );
  }

  if (screen.view === 'complete') {
    const profile = profileFor(screen.profileId);
    if (!profile) return <Missing onHome={goHome} />;
    const next = lessons.find((l) => l.lesson === screen.n + 1);
    return (
      <CompleteScreen
        lessonN={screen.n}
        profileName={profile.name}
        flaggedCount={screen.flaggedCount}
        hasNext={!!next}
        onRepeat={() => setScreen({ view: 'lesson', profileId: profile.id, n: screen.n, repeat: true })}
        onNext={() => next && setScreen({ view: 'lesson', profileId: profile.id, n: next.lesson, repeat: false })}
        onBack={() => setScreen({ view: 'dashboard', profileId: profile.id })}
      />
    );
  }

  if (screen.view === 'dashboard') {
    const profile = profileFor(screen.profileId);
    if (!profile) return <Missing onHome={goHome} />;
    return (
      <Dashboard
        profile={profile}
        totalLessons={lessons.length}
        sounds={sounds}
        onBack={goHome}
        onContinue={() =>
          setScreen({ view: 'lesson', profileId: profile.id, n: profile.currentLesson, repeat: false })
        }
        onPractice={() => setScreen({ view: 'practice', profileId: profile.id })}
        onSettings={() => setScreen({ view: 'settings' })}
      />
    );
  }

  if (screen.view === 'settings') {
    return (
      <Settings
        state={progress.state}
        onBack={goHome}
        importReplace={progress.importReplace}
        importAdd={progress.importAdd}
      />
    );
  }

  if (screen.view === 'practice') {
    const profile = profileFor(screen.profileId);
    if (!profile) return <Missing onHome={goHome} />;
    return (
      <Practice
        profile={profile}
        sounds={sounds}
        words={words}
        lessons={lessons}
        onApplyOutcome={(card, outcome) => progress.applyOutcome(profile.id, card, outcome)}
        onBack={() => setScreen({ view: 'dashboard', profileId: profile.id })}
      />
    );
  }

  return (
    <ProfileHome
      profiles={progress.state.profiles}
      onAdd={(name) => progress.addProfile(name)}
      onRename={(id, name) => progress.renameProfile(id, name)}
      onDelete={(id) => progress.deleteProfile(id)}
      onSelect={(id) => {
        progress.setActiveProfile(id);
        setScreen({ view: 'dashboard', profileId: id });
      }}
    />
  );
}
