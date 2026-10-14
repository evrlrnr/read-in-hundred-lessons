# Kickoff prompt for Codex (paste this as your first message)

> Status: M1 (content pipeline) and M2 (lesson player) are already built and
> verified — do not redo them. The next milestone is M3.

Read AGENTS.md and TECHNICAL_PLAN.md in full before doing anything. Then run
`npm install`, `npm run validate`, and `npm test` to confirm the existing work
passes on your machine before changing anything.

Implement **Milestone M3 (Orthography)** from TECHNICAL_PLAN.md §4 and §8:

1. Build a `<DecodableWord>` component that replaces the placeholder rendering in
   src/components/LessonPlayer.tsx (`WordText`): span-per-grapheme with SVG
   connecting arcs under letter teams, a drawn macron bar (not CSS overline),
   small faded silent letters, and an optional sounding-out arrow with a dot
   under each non-silent grapheme group (used by blend tasks).
2. Add a visual test page at /dev/ortho that renders every grapheme type present
   in src/content/words.json, plus a sample letter-team word for the arc case
   (add a team sound + word to content if none exists yet — it must pass
   `npm run validate`).

Done when: every grapheme type renders correctly on /dev/ortho (show screenshots),
lessons 1–10 still play end to end, `npm run validate`, `npm test`, and
`npx tsc --noEmit` all pass.

Do NOT start Milestone M4. When M3 is done, summarize what you built and append
lessons learned to loop-knowledge.md.

---

# Follow-up prompts (one per session, in order)

- "M3 is approved. Implement Milestone M4 (Progress) per TECHNICAL_PLAN.md §7.
  Done when profiles survive reload, flags work, and export → wipe localStorage →
  import restores state exactly (write a test for the round-trip)."
- "Implement Milestone M5 (Practice mode + progress view) per plan §5–6. Done when
  the deck algorithm passes tests for 3 scripted scenarios and the mastery grid
  matches the data."
- "Implement Milestone M6 per plan §8–9: remaining original lessons, PWA/offline,
  print stylesheet, a11y pass. STOP before deploying — ask me first."
