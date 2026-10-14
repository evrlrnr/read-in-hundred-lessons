# Reading Lessons

A web app for parents and teachers: scripted, sequenced phonics lessons
(direct-instruction method — sounds first, blending, cumulative review, a special
marked-up reading alphabet) with entirely original lesson content. Like holding
the teacher's book, but on a phone.

## Quick start

```
npm install
npm run dev        # open http://localhost:5173
```

## Checks

```
npm run validate   # decodability: no lesson may use an untaught sound
npm test           # validator unit tests
npx tsc --noEmit   # typecheck
```

## Project docs

- [TECHNICAL_PLAN.md](TECHNICAL_PLAN.md) — the design source of truth (roadmap in §8)
- [AGENTS.md](AGENTS.md) — instructions + status for AI coding agents
- [codex-kickoff-prompt.md](codex-kickoff-prompt.md) — per-milestone prompts for handoff
- [loop-knowledge.md](loop-knowledge.md) — decisions and lessons learned per milestone

Status: milestones M1 (content pipeline), M2 (lesson player), and M3 (orthography)
complete; next is M4 (progress).
