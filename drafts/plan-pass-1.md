# Technical Plan — Phonics Lessons Web App (Pass 1)

## 1. Vision
A web app that gives a parent or teacher the same "open the book and go" experience as
DISTAR-style direct-instruction reading programs, using **entirely original content**:
our own sound sequence, our own word lists, our own decodable stories. The adult sees
a script on every card; the child sees large, specially-marked text.

## 2. Teaching method (what we implement, not copy)
The *method* — which is a teaching technique, not copyrightable expression — includes:
- Sounds taught one at a time, most-useful-first (not alphabetical)
- Blending drills ("say it slowly… now say it fast")
- Cumulative review: every lesson re-drills prior sounds/words
- Decodable sentences/stories built only from taught sounds
- A modified orthography that fades out as the learner progresses

What must be **original**: the exact sound order, the word lists, all story text, all
script wording, all art. We will design our own 100-step sequence.

## 3. Content model (sketch)
- `Sound`: symbol, example word, voiced/unvoiced hint
- `Lesson`: ordered list of tasks
- `Task` types: new-sound, sound-review, blending, word-reading, sentence/story, writing prompt
- Each task carries a parent script ("Touch the sound. Say it with me…")

Open question: how tasks reference sounds/words (IDs vs inline) — TBD.

## 4. Orthography rendering
Long vowels need macrons, letter-teams (th, sh, ee) display joined/connected, silent
letters display small/faded. Approach: custom font, or CSS styling over annotated
text spans. **Needs a concrete decision — currently vague.**

## 5. UI flows (sketch)
- Home → pick child profile → "Continue Lesson N"
- Lesson screen: one task at a time, card-style; parent script in a distinct strip;
  child text large and centered; Next/Back
- Progress screen: lessons completed, trouble sounds

## 6. Data & progress tracking
Track per child: current lesson, per-task completion, sounds flagged for review.
Schema: **TBD — depends on stack/storage choice.**

## 7. Tech stack
**Undecided — requires user input per loop boundary.**

## 8. Roadmap (rough)
1. Content authoring format + first 10 lessons of original content
2. Lesson player UI
3. Orthography rendering
4. Progress tracking
5. Remaining lessons, polish
