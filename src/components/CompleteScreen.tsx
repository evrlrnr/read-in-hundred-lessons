/**
 * Lesson-complete screen (plan §5): praise, then advance. If the parent flagged
 * two or more items during the lesson, offer to repeat it (the method's mastery
 * rule). "Next lesson" is hidden when there is no next lesson authored yet.
 */
export function CompleteScreen({
  lessonN,
  profileName,
  flaggedCount,
  hasNext,
  onRepeat,
  onNext,
  onBack,
}: {
  lessonN: number;
  profileName: string;
  flaggedCount: number;
  hasNext: boolean;
  onRepeat: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const shouldRepeat = flaggedCount >= 2;

  return (
    <main className="complete">
      <h1>🎉 Lesson {lessonN} done!</h1>
      <p>Great reading today, {profileName}. Give a high five!</p>

      {shouldRepeat && (
        <p className="repeat-note">
          You flagged {flaggedCount} things for review. It might help to repeat this lesson.
        </p>
      )}

      {hasNext && (
        <button className="nav-btn primary" onClick={onNext}>
          Start lesson {lessonN + 1}
        </button>
      )}
      {shouldRepeat && (
        <button className="nav-btn" onClick={onRepeat}>
          Repeat lesson {lessonN}
        </button>
      )}
      {!hasNext && <p className="all-done">That's every lesson so far — amazing work! 🌟</p>}

      <button className="nav-btn" onClick={onBack}>
        Back to {profileName}
      </button>
    </main>
  );
}
