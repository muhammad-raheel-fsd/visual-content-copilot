# Production guide: faceless lectures

The rules for every phase. The tracker is [progress.md](progress.md); research and sources are
in [style-research.md](style-research.md).

## 1. One recording, every video

Muhammad records **one master transcript, in one go, in one steady tone**. Everything else is
cut from that single recording:

| Output | Size | Length | Where |
| --- | --- | --- | --- |
| Master | 1920 x 1080 (16:9) | 4 to 5 min (never under 4) | YouTube |
| Short, one file per platform | 1080 x 1920 (9:16) | 50 to 60 s | YouTube Shorts, Instagram Reels, TikTok, Facebook Reels (section 8) |
| Feed cut | 1080 x 1350 (4:5) | same as the Short | X, Facebook feed, LinkedIn (section 8) |
| Thumbnail | 1280 x 720 | | YouTube |

Lengths (Muhammad, 2026-10-10): use the time. YouTube Shorts and Instagram Reels now allow up
to 3 minutes, but about a minute keeps students watching, so the Short aims at 50 to 60 s; the
master is at least 4 minutes.

The Short is NOT a crop of the master: it reuses chosen **lines of the master voice** (see the
cut list in each phase file) over its own 9:16 animation, big text and burned-in captions.

**Every Short teaches ONE complete idea**, so a viewer who only watches the Short still learns
something: question > answer > the mechanism (acted out) > a takeaway card, then the closing
line. Fill the 50 to 60 s with whole, consecutive master lines: fewer cuts, more content. Never stitch two half-ideas together (phase 1's first Short mixed the 3 decisions with a
binary puzzle and taught neither).

**No empty lines, spoken or on screen.** Every line carries information or a concrete next
step. A bare slogan ("Follow for more") says nothing; say what comes next and why to follow
(section 4, closing lines).

**Every explanation is animated on its words.** When the voice explains a diagram step by step,
the diagram moves on each step (phase 1: on each "number", a car drives to the CPU, memory or a
device). A static picture during an explanation is a bug.

## 2. How a phase runs

1. **Script (Claude):** `pipeline/phase-NN-<slug>.md`. **Read the book section first, from the
   PDF itself, every time** (Muhammad, 2026-10-11: "compulsory"): render the pages (the PDF is a
   scan with no text layer: `uv run --with pypdfium2 --with pillow`, page images, then read them;
   the Class 10 PDF runs 3 pages ahead of the printed page numbers) and compare with the parsed
   `curriculum/.../source/t<T>-*.md`. Quote definitions from the page, not from memory. Then:
   1. Metadata: class, chapter number and exact name, book, page, topic code.
   2. Three hook options, one picked.
   3. **Master transcript:** Roman Urdu + English terms, numbered beats, every line with an ID
      (`3.2` = beat 3, line 2) so the Short can reuse it.
   4. **Master visual plan**, beat by beat: what is on screen, the animation (moves, zoom in /
      out, spotlight, pulses), icons (verified lucide / Iconify names), on-screen text, SFX
      from `library/sfx/`, and the Remotion pieces.
   5. **Short cut list:** which line IDs, in which order, plus the 9:16 visual plan.
   6. End card, a 3-question website quiz (answers checked), thumbnail text, titles,
      descriptions and hashtags for each platform.
2. **Record (Muhammad):** read the whole master transcript once, straight through. Do not read
   the line IDs. A mistake? Just say the line again and keep going: the last complete take of
   a line wins. Save to `videos/recordings/phase-NN.m4a` (any phone format is fine).
3. **Clean the voice (Claude):** section 3 below. No silence, no "umm", even pace.
4. **Animate (Claude):** Remotion compositions in `apps/remotion/videos/<slug>/`, timed to the
   cleaned voice: `PhaseNNMaster` (16:9) plus the Short and feed compositions of section 8.
   Reusable pieces live in
   `apps/remotion/components/faceless/` (look, offline icons, voice timeline, captions, end card).
   Every animation is cued to a spoken word (`cue(tl, "4.5", "number")`); check that every cue
   word exists in what was said before rendering.
5. **Render:** the master, one Short per platform, the 4:5 feed cut (section 8) and the
   thumbnail into `output/phase-NN/`. Publish, then update the status in `progress.md`.

Status flow: `planned` > `scripted` > `recorded` > `animated` > `rendered` > `published`.

## 3. Voice editing rules

**NEVER EDIT MUHAMMAD'S WORDS (Muhammad, 2026-10-11, the hardest rule in this guide).** The
voice plays exactly as he recorded it: no trimmed pauses, no shortened gaps, no speed change,
no fades, no cut inside or at the edge of a word, no re-joined pieces. Phase 02's first render
broke this (pauses squeezed to 0.12 s, 80 ms fade-outs eating word endings, 0.95x speed) and he
rejected it: "they are editing my words ... you never, never, never do that". The pipeline is
now VERBATIM: the alignment script gives every line an untouched "span" of the recording, the
lines tile it, and `buildTimeline` plays them back to back as recorded (`sourceFrom` lines).
The ONLY allowed changes:
- a pause opened between two lines for a meme (`extraGapAfter`), always at a silence;
- the loudness evening-out of `voice_master.py` (EQ, compressor, limiter, never a boost);
- removing a whole retake or mistaken line, only when Muhammad points it out (CUTS, at
  silences, never inside a word).

**Never skip a word, and report every word the recording does not have.** After transcribing,
compare what was said with the written script, line by line, and TELL Muhammad before building
every phrase that is missing or different (phase 02: "uske do parts mein, Shell aur Kernel" was
never spoken after "Iska answer Operating System ke andar hi hai"; it was quietly dropped from the
build instead of being reported, and he took it for words the edit had eaten). He then decides:
a short pickup recording, or keep it as said. Claude never invents or synthesises his voice.
A meme pause never splits a sentence (Muhammad, 2026-10-12): it goes after the whole line, in
his own pause.

Muhammad never edits audio. Claude does the steps below, every time:

1. **Word timings:** Whisper word-level timestamps on the raw recording (`npm run transcribe`).
   Match them to the transcript line IDs.
2. **Retakes:** when a line is said more than once, keep only the last complete take.
3. **Fillers and false starts stay** unless Muhammad asks for a cut (then: whole words only,
   at silences). Do not "clean" his speech.
4. **Pauses stay as recorded.** (Old rule, phase 01 only: gaps trimmed to 0.12 to 0.35 s. It
   is withdrawn: it edited his words.)
5. **Speed stays 1.0x.** (Old rule, phase 01 only: 0.95x to 1.1x per beat. Withdrawn.)
6. **Loudness (Muhammad, 2026-10-10): equalise every sound first, always, then mix. Never
   make the voice louder** (Muhammad boosts loudness himself in another app if he wants it).
   - Voice: `voice_master.py`, one fast pass that keeps Muhammad's loudness exactly as he sent
     it (he maxes it himself): a "premium" EQ (high-pass 80 Hz, -2.5 dB at 300 Hz, +2.5 dB at
     3.5 kHz, +2 dB air above 10 kHz), a gentle 3:1 compressor so the ups and downs sit
     together, an expander for room tone, and a limiter so no peak clips. No boost.
   - SFX: every file equalised to a voiced RMS of -20 dBFS (`generate-sfx.mjs`, also
     `--equalize` for existing files), played low: cue `volume` 0.25 to 0.5, times `SFX_GAIN`
     (1.4, Muhammad 2026-10-11: "increase them a bit") in `components/faceless/theme.ts`.
   - Memes and meme sounds: equalised to -18 dBFS by `import-meme-assets.py`, played at about
     0.9 in a voice gap, so they sit just under the voice.
   - No background music or nasheed bed (it changed the lecture's vibe). See "Halal audio".
7. **Keep the edit reproducible:** every step is a script in `pipeline/build/` (first used in
   phase 1):
   1. `library/voiceover/phase-NN/voice.wav`: the recording's audio, loudness-normalised
      (Remotion's bundled ffmpeg, `loudnorm`).
   1b. `voice_master.py`: EQ + evening-out + limiter at the input's own loudness; one pass,
      about 30 s. Never a loudness boost.
   2. `fw_transcribe.py`: Whisper word timestamps (faster-whisper, `medium`, language `ur`; run
      with `uv`, see the file header) -> `videos/transcripts/phase-NN-ur.json`.
      If the whole-file run loops (it did on phase 02's spoken binary digits), use
      `fw_transcribe_chunked.py`. Then check every segment longer than about 8 s: a long piece
      can come back with only its first sentence (phase 02: 0.6 to 20.5 s held four lines but
      returned one). Re-transcribe those stretches one VAD region at a time and splice them in.
   3. `vad.py`: exact speech regions from loudness -> `videos/transcripts/phase-NN-vad.json`.
   4. `phase-NN-alignment.py` (from phase 1 v3 on, word timings come from `align_roman.py`, an
      automatic Roman Urdu to Whisper aligner, so no token counting by hand): per transcript line, the speech regions to keep (retakes and
      false starts left out, named in its header), the Roman Urdu words of what was ACTUALLY
      said (captions show this, not the script), and the per-beat speed.
   5. **Repeat check (never skip):** `chunk_transcribe.py` transcribes every kept chunk on
      its own (`videos/transcripts/phase-NN-chunks-ur.json`). Read it line by line against
      the script: any phrase said twice inside a line is a retake whose first take was kept.
      Whisper on the full recording hides these: it merges both takes into ONE sentence and
      stretches one word over the repeat (phase 1 v2 shipped two this way, in 4.2 and 4.9).
      Warning signs in the full transcript: one word lasting over 1.5 s, or a line slower than
      150 words a minute. Cut the first take in the alignment script, take that line's word
      timings from the chunk transcript (`RETOKEN`), and run the check again until clean.
   6. `render_voice_lines.py --verbatim` -> `apps/remotion/videos/<slug>/voice-lines.ts`: every
      line points into the untouched `voice.wav` at its span (`sourceFrom`), no line files, no
      fades, no speed. `VoiceTrack` plays the recording in one piece per stretch between meme
      pauses. (Without `--verbatim` it bakes phase 01's edited per-line WAVs; never for new
      videos.)
   - Cut ends follow the real end of the voice (quiet below -62 dB for 250 ms), not the
     speech-detector threshold, or soft endings ("likho", "hoga?") get chopped.
   - Never trim or speed audio inside Remotion: `trimBefore` / `trimAfter` ignore
     `playbackRate`, which cut the last word of every sped-up line in phase 1's first render.

### Halal audio (Muhammad, 2026-10-10)

Keep the audio as halal as possible while staying lively. Scholars differ on music; we take
the careful side:

- **No background music**, no instrumental beds (the old `library/music/` loops are not used in
  this series).
- **No bells and no melodies:** a hadith in Sahih Muslim calls the bell "the musical instrument
  of Shaytan". So `ding.wav`, `ting.wav`, `notify.wav` and `chime.wav` (bell and two-note
  sounds) are out.
- **Allowed: non-musical sound design**, like a door click or a page turn: `pop`, `click`,
  `click-soft`, `tick`, `type`, `whoosh`, `swoosh`, `zap`, plus `snap` (crisp emphasis,
  replaces `ting`) and `thud` (soft reveal / success, replaces `ding`, `chime` and `notify`),
  all synthesised by `library/scripts/shared/generate-sfx.mjs`.
- **No background bed** (Muhammad, 2026-10-10: a nasheed gives a different vibe than a
  lecture). The voice, the SFX and the memes carry the video. If a bed is ever wanted, only
  natural ambience (soft rain, room tone) at a very low level.
- **Meme sounds are voices, not music:** a meme clip is fine when its sound is people talking
  ("Shabash beta", "FAAAH"); a clip with a song or instrumental music is not used.
- Downloaded audio: only from a source with a clear licence (Pixabay / Mixkit SFX, Freesound
  CC0, Aswati Studio for instrument-free vocals), each file's source and licence recorded in
  `library/sfx/CREDITS.md` or `library/music/CREDITS.md`. When unsure about a sound, leave it
  out.

## 4. Transcript writing rules

- **Roman Urdu**, never Hindi words or Devanagari. Urdu vocabulary: sawal, jawab, zaroori,
  asal mein, yaani, misaal ke taur pe, istemal, tareeqa, maloomat, faisla, intezam.
- **Technical terms in English, exactly as the book writes them:** Operating System, Kernel,
  Shell, Process, Variable, Router, Firewall.
- Speak to one student as **"tum"** (direct, like an older brother: it hooks and makes them
  curious about who is talking). Never "aap".
- Count steps as **"Number ek, number do, number teen"**, never a bare "ek, do, teen": it
  pulls attention to each step.
- **Length: the master script is 4 to 5 minutes**, about 700 to 900 Roman Urdu words at the
  edited pace (170 to 200 a minute). Fill it with substance: a second real-life example, a
  "socho" prediction, a common mistake students make, the recap. Never padding.
- **Book only** (Muhammad, 2026-10-11): every fact comes from the book section; no extra facts,
  however interesting ("Android uses a Linux Kernel" was cut). Real-world examples that
  illustrate a book sentence are welcome; build the main scenario on the book's own example.
- **Say definitions simply, show the book's line on screen:** "Tumhari book ke mutabiq, Kernel
  Operating System ka core part hai. Simple terms mein, Kernel hardware ko directly control
  karta hai..." Students should understand, not memorise long sentences (the brand is "logic,
  not ratta").
- **Stay consistent with earlier videos:** if a past video said "the OS does X", the new one
  shows HOW (phase 02: the OS does it through its parts, the Shell and the Kernel). Call parts
  parts of the whole, never separate layers that compete with it.
- **One concept, done well** (Muhammad, 2026-10-11): this is an animated concept series, not the
  full lecture series. Each video takes ONE concept from a book section (phase 02: Kernel vs
  Shell, not the whole of 1.2 with layers, libraries and drivers) and explains it completely;
  the other parts of the section belong to the full lectures. Nothing off-syllabus is presented
  as book content.
- Short sentences, one idea per line. Describe the action, not body parts ("tum tap karte ho",
  not "tumhari ungli screen ko chhooti hai").
- Mark stressed words in **bold**. Do not write pauses: the edit removes them anyway.
- Label simplifications: "simple lafzon mein...". Never claim exam guarantees or board
  weightage.
- No em dashes or en dashes anywhere (scripts, overlays, slides).

**Sound like a person, not like notes** (Muhammad, 2026-10-10). Read every line out loud:
if it sounds like a slide bullet, rewrite it.

- **Full sentences with a subject and a verb.** No "label: list" lines ("OS ke kaam: ...",
  "OS ka doosra kaam: translator").
- **Spoken connectors:** "To", "Ab", "Dekho", "Chalo", "Socho", "Yaad rakhna".
- **First person:** "maine website pe daal diye hain", "hum dekhenge". The voice is a person
  who made this for them.
- **Every ask is an action with a reason:** what to do + why ("follow kar lo, taake agli
  video miss na ho jaye").
- **Questions are complete and specific:** who, what, and where to answer ("comments mein
  batao ke...").
- **Playful twists that make them curious** (Muhammad, 2026-10-10): a line that winks at the
  viewer beats a flat statement. "Lekin kabhi socha hai ke in sab ko control kaun karta hai?
  Aur mera matlab tum se nahi tha." beats "...Tum nahi karte, koi aur karta hai." Use one in the
  hook and at most one or two more per video.
- **Technically exact verbs** (students are examined on these): the CPU **processes**
  ("processing ki request", "process karega"); memory (RAM) **holds** what is running; storage
  **saves** files; the OS **manages, decides and schedules**. Never give one part's job to
  another. A question must have the answer we teach: "process kaun karega?" = the CPU, so to
  get "the OS" ask "kaun decide karega ke CPU pehle kis ko process kare?".

| Notes-style (never) | Spoken (write this) |
| --- | --- |
| Yaad rakho, OS ke kaam: hardware manage karna, apps chalana... | To OS ke yeh chaar kaam hamesha yaad rakhna: yeh hardware ko manage karta hai, saari apps chalata hai, user interface deta hai, aur har user ka data alag rakhta hai. |
| Ab tum batao: do apps ek saath CPU maangein, to faisla kaun karega? Comments mein likho. | To ab tum comments mein batao: agar teen apps ek saath CPU maangein, to faisla kaun lega? |
| Agle OS video mein: Kernel aur Shell. | OS ki agli video mein hum dekhenge ke Kernel aur Shell mein kya farq hota hai. |
| Is topic ke MCQs, short questions aur notes website pe hain. | Is topic ke MCQs, short questions aur notes maine website pe daal diye hain. Abhi jao aur dekho ke tum kitne sahi kar paate ho. |
| Follow aur subscribe kar lo. / Follow for more. | Follow aur subscribe kar lo, taake OS ki agli video miss na ho jaye. |
| OS ka doosra kaam: translator. | Ab OS ka doosra bara kaam dekho: yeh ek translator ki tarah kaam karta hai. |

**Mix in English the way students actually talk** (Muhammad, 2026-10-10). Roman Urdu is the
base, but everyday and tech words stay English, and a few English power words make the
delivery lively.

- **Use the English word when the Urdu one sounds bookish or odd on the mic:**

  | Avoid (sounds odd) | Say |
  | --- | --- |
  | chowk, chauraha | crossroad |
  | gaariyan | cars |
  | takra jayengi | crash ho jayengi |
  | baant'ta hai (time / resources) | share karta hai |
  | barabar | equally |
  | misaal | example |
  | faisla karna / faislay | decide karna / decisions |
  | sawal / jawab | question / answer |
  | waqt (a moment in time) | time |
  | galti | mistake |
  | ijazat | permission |
  | badalna (to binary / instructions) | convert karna |

- **Every line uses the English words students actually say** (structure, architecture,
  role, operate, command...). A line of pure bookish Urdu ("Operating System andar se bana kaise
  hai") sounds odd on the mic (Muhammad, 2026-10-11).
- **Say it directly, never a vague definition first:** "Tumhari book ke mutabiq, Operating
  System ki architecture ek school ki tarah hai, jahan har department ka apna kaam hota hai..."
  beats "...ka matlab hai ke uske parts kaise organize hote hain".
- **Link the series:** a hook may recall the previous video of the same topic ("Pichli video
  mein humne dekha tha..."), but the Short must open on lines that work alone, so put the
  recall in its own line and skip it in the Short's cut list.
- **English power words, about one every two or three lines** (never two in one sentence):
  "Imagine karo", "boom", "big question", "simple answer", "honestly", "exactly",
  "interesting", "behind the scenes", "step by step", "Smooth, right?", "common mistake".
- Keep the book's own terms in English exactly as printed, and keep simple Urdu where it is
  natural ("socho", "dekho", "yaad rakhna", "tum").

**Script checklist: run it on EVERY script before calling it ready** (skipping it is how v1
of phase 1 went wrong):

1. Master transcript 4 to 5 minutes (about 700 to 900 words); the Short cut 50 to 60 s.
2. Lines 1.1 and 1.2 work alone as the hook (they open the Short).
3. Every line is a full spoken sentence (subject + verb); no "label: list" lines.
4. "tum", never "aap"; steps counted "Number ek / do / teen".
5. No bookish or odd Urdu from the table above; English power words sprinkled in.
6. Every ask has a reason; every question says who answers and where ("comments mein batao").
7. Closing: website challenge line, "<subject> ki agli video mein hum dekhenge ke ...", the
   full-series line + follow and subscribe with its reason (from phase 02 on), "Allah Hafiz".
8. Natural wording, never a literal translation ("CPU time deta hai", not "CPU pe waqt").
9. The video covers ONE concept of the section completely (no other parts of the section);
   additions are framed as ours.
10. No em dashes or en dashes.
11. The visual plan's cue words match the transcript's actual words.
12. The hook has a playful twist ("Aur mera matlab tum se nahi tha"), not a flat statement.
13. Every technical verb is exact (the CPU processes, the OS decides / manages), and every
    question's correct answer is the one the video teaches.

**Write every master so the Short can be cut from it:**

- Lines 1.1 and 1.2 are a **standalone hook** (no "is video mein", no reference to anything
  before): they open the Short too.
- Include one **"socho"** line (the viewer predicts something) followed directly by its
  answer, so the Short's prediction moment exists in the master voice.
- **Natural wording, not literal translation:** "app ko CPU time deta hai", not "CPU pe waqt
  deta hai". Keep the English term when the Urdu sounds forced.
- The website line is **platform-neutral**: "MCQs, short questions aur notes website pe hain."
  The master says it; the Short only shows the website on screen.
  Never "link description mein" or "link bio mein" in the voice; the on-screen text and each
  platform's caption say where the link is.
- **Closing lines, every video, in this order:**
  1. Website (master only): "Is topic ke MCQs, short questions aur notes maine website pe daal
     diye hain. Abhi jao aur dekho ke tum kitne sahi kar paate ho." (Keep it: the website is
     where they practise, and the line is a challenge, not an advert.)
  2. **Next step + reason to follow** (master and Short), two spoken sentences: "<Subject> ki
     agli video mein hum dekhenge ke <next topic, as a question or a difference>." + "Follow
     aur subscribe kar lo, taake agli video miss na ho jaye." On screen: the next topic's
     title + the follow button. Never a bare "Follow for more" (Muhammad, 2026-10-10:
     it completes nothing). One line covers every platform: follow on Instagram / TikTok /
     Facebook, subscribe on YouTube.
  3. **The full lecture series (from phase 02 on; phase 01 does not have it)**, master and
     Short, two sentences: "Aur yaad rakhna, yeh animated series sirf concepts ko samajhne ke
     liye hai. Meri full lecture series is se kahin zyada detailed aur interesting hai." + "To
     follow aur subscribe kar lo, taake jab woh series launch ho, to tum usay foran access kar
     sako, aur meri website pe quizzes aur important short aur long questions ki practice kar
     sako." This replaces the plain follow line of step 2 (one ask, with the better reason). Say
     "important short aur long questions", never "guess" questions (no exam claims). On screen:
     a "Full lecture series: coming soon" card with the follow button.
  4. "Allah Hafiz." (master only)
- Line IDs (`1.1`, `2.3` ...) are for reference only: never read them.
- Keep the Short's lines usable alone: a line it reuses must not start with "is liye" or
  "jaisa maine kaha".

## 5. Brand on every video

| Item | Value |
| --- | --- |
| On-screen name | Muhammad Raheel (MR avatar) |
| Byline | Muhammad Raheel · Full Stack Developer · AI Engineer |
| Website | REPLACE-ME (brand name not final; live today: student-learning-app-sigma.vercel.app) |
| Topic deep link | `<website>/<course>/<chapter>/<topic>` (the real page, once the topic is on the site) |
| YouTube | REPLACE-ME |
| Instagram | REPLACE-ME |
| TikTok | REPLACE-ME |
| Facebook | REPLACE-ME |

- Never show "bytemotion" on screen (internal repo name only).
- Handle and website small in a corner during the video, full size on the end card.
- End card text: "MCQs + short questions + notes" + website + handles.
- Ask for the follow only once, at the very end (the fixed closing line), never in the middle.
- Thumbnail: top-left "CLASS 10 | CH 01" (grade always shown), then 2 to 5 hook words. Own
  diagrams only, never textbook scans.

### Series and playlists (Muhammad, 2026-10-11)

These are **standalone animated explainers of selected book sections**, not a complete,
sequential course: each video works alone, and phases jump between chapters and classes.

- **One playlist per class and subject:** "Class 10 Computer Science | Animated Concepts" and
  "Class 12 Computer Science | Animated Concepts". The playlist description says "Selected topics
  from the Punjab board book, in book order."
- **Order each playlist by book section** (1.1, 1.2, 1.3 ...), not by upload date, so a student
  can follow the book even with gaps; insert new videos in their book position.
- **Topic playlists** once a chapter has 3 or more videos, e.g. "Operating Systems | Class 10 CS
  Ch 1".
- **Keep the top-left tag** "Class 10 | Ch 1 | 1.2 <section title>": because the videos are not
  sequential, the tag is what tells a student exactly where the video sits in their book, and
  students search by class, chapter and section. The phase number is internal and never on screen.
- **First line of every description:** "Part of: Class 10 Computer Science | Animated Concepts
  (selected topics, in book order)."
- **The "agli video" line** points to the next video *of the same topic* ("OS ki agli video"),
  which is not always the next upload.

## 6. Shape of each output

| | Master (YouTube) | Short (all vertical platforms) |
| --- | --- | --- |
| Length | 4 to 5 min | 50 to 60 s |
| Shape | hook, problem, book definition, mechanism (numbered), examples, common mistake, recap, question, next topic, end card | hook (0 to 3 s), answer, the mechanism acted out, takeaway card, next topic + follow |
| Text | normal size | big, inside the platform's safe area (section 8), captions always burned in |
| Ending | website line, next topic + follow, 5 s end card | takeaway, next topic + follow (website on screen), last frame matches the first so it loops |

## 7. Style recipe

**Colours: GitHub dark** (Muhammad, 2026-10-10: no bluish backgrounds), in
`apps/remotion/components/faceless/theme.ts`: background `#0d1117`, panels `#161b22`, borders
`#30363d`, text `#e6edf3`, muted `#8b949e`; accent (the concept) `#58a6ff`, highlight
`#d29922`, red `#f85149`, green `#3fb950`, purple `#bc8cff`. No gradients or glows on the
background; colour lives in the content.

**Background: a grid** (like The Engineering Mindset's blueprint grid, in GitHub dark): fine
lines every 40 px and stronger ones every 200 px, so faint they never compete with the content
(`GRID` and `gridBackground()` in `components/faceless/kit.tsx`). The grid stays still (fine moving
lines shimmer after YouTube compression and pull the eye from the content); it only lights up
with a 1 s accent sweep at each new beat (`GridSweep`).

**Master: a framed stage.** The 16:9 master sits on a rounded grid canvas inset 28 px from the
edges with a darker surround (`StageFrame`): it separates the content from the screen edge like
a drawing board. Shorts and the feed cut stay full-bleed (a phone needs every pixel).

A blend of Fireship (speed, no intro, code typing in), ByteByteGo (diagrams built step by step
with flowing dots), Slaying The Dragon ("Learn X in N minutes", show the effect live) and No
Fluff Academy ("idea before formula", real-world examples first).

1. **Hook in the first 2 seconds, no logo intro.** A question or a surprise whose answer is
   the payoff, or "[Term], yaani [book definition]".
2. **Voice first, visuals second.** The cleaned recording drives every timing.
3. **Every word that names something is animated, on that word** (Muhammad, 2026-10-11): when the
   voice says "user", a user appears; "hard drive", the hard drive lights up; "CPU", the CPU
   pulses; "Shell", the Shell ring glows. Every noun and key verb in the recording gets a visual
   cue (icon pops, highlights, moves), built from the transcript of what was actually said.
   **COMPULSORY: a thing appears ON its word, never earlier, never later** (Muhammad,
   2026-10-11). Nothing is on screen before the voice names it: no box "set up" at the scene
   start, no dim placeholder, no icon popping a few frames after a scene opens. The Operating
   System box appears on "Operating System", the phone on "phone", the computer on "computer".
   In code every appear time is `cue(tl, line, "<the word that names it>")`; `start + N` or
   `lineStart + N` as an appear time is a bug. Small staggers for several icons of ONE word
   (CPU, printer, screen on "hardware") start on that word. Then:
   **Every clause gets its own animation, on its words** (Muhammad, 2026-10-10: "add
   animation with every line I speak"). "Kis ko kitni memory milegi" pulses the RAM and shows
   "Kitni?"; "woh foran khul jaati hai" opens the app. If you cannot picture what moves on a
   clause, the clause or the scene needs rethinking. **Never 2 s or more of an unchanged
   picture while the voice speaks**, checked by `pipeline/build/picture_audit.sh` on the
   master and on a Short before every render (it also lists any text overflowing its card or
   phone, from the `overflowCheck` prop in `kit.tsx`) (it prints each dead stretch with its words; the
   check is part of done). Not always a hard cut: a pulse, a label, a dot, a highlight.
4. **Build diagrams in narration order** (ByteByteGo): one part per sentence, numbered steps
   that appear on "number ek / do / teen", dots travelling along arrows, left to right. Never
   the full diagram at once.
5. **Real icons, short labels.** Iconify / lucide icons and tech logos, labels of 1 to 3
   words; the voice carries the detail.
6. **Code types in line by line** (`TypeIn`), then holds still long enough to read.
7. **One highlight at a time:** `Spotlight` dims the rest, one `Indicate` pulse on the punch
   word, `ZoomHold` (zoom in / out) for the "look here" moments.
8. **Cut decoration.** A frame that does not teach, move the story or get a smile goes.
9. **Humour as seasoning:** one light, classroom-safe, Pakistani-context beat per 60 to 90 s
   (cricket, load shedding, chai, exam season). Not Fireship's meme density.
10. **Pace:** Muhammad's own, as recorded (section 3). Keep the picture moving on his words
    instead of cutting his pauses.
11. **Sound (halal, section 3):** `pop.wav` when things appear, `whoosh.wav` / `swoosh.wav` on
    scene changes, `snap.wav` on the key word, `thud.wav` on reveals and the recap. No music,
    no bells, no melodies.
12. **Quiet branding:** small corner name + handle; full byline and website only on the end
    card and in the description / pinned comment. One follow line at the very end (the fixed
    closing line), never a mid-video "subscribe" break.
13. **Shorts:** one idea, captions burned in (2 to 4 words at a time, key word in colour),
    design for "send this to a classmate" (Instagram ranks sends highly).
14. **Titles:** "[Topic] Explained Simply | Class 10 Computer Science Ch 1", always with class
    and chapter.

### Memes (Muhammad, 2026-10-10)

A meme cut-in every 40 to 60 s, where the script already has a joke or a twist: the voice
pauses (`extraGapAfter` in `timeline.ts`); a silent one (Goku) may play over the voice. One
look for every meme (Muhammad, 2026-10-11): the raw clip, no border or label, centred, tilted
3 degrees, always the same height, while the whole picture pauses and blurs behind it
(`MemePause` + `MemeLayer` in `components/faceless/Meme.tsx`; the voice and captions stay
outside the pause). No meme on the end card. The last meme of a video (the subscribe one)
sits straight (`tilt: 0`); the others keep the tilt.

**Handles (Muhammad, 2026-10-11):** YouTube (with the name), Facebook, Instagram and X stay
along the bottom of the master all video long (`SocialBar`), small and quiet; the end card
shows them big.

**The voice is the script:** Muhammad edits lines while he records, so captions, cues and
animations follow the transcript of what he actually said, never the written script. Muhammad's collection lives in `videos/source-clips/meme-and-sound-assets/`
(gitignored); `pipeline/build/import-meme-assets.py` copies only the used ones into
`library/memes/`, trimmed to the punchline (under 3 s) and loudness-equalised. Rules: no
swearing, no insults at the viewer, no songs, family-safe for 15-year-olds; record each one in
`library/memes/CREDITS.md`. These clips belong to films, TV shows and creators, so a copyright
claim can land on any of them: swap the file and re-render if it does.

## 8. One render per platform

Same voice and content, a layout tuned to each platform's frame and on-screen buttons. Each is
a layout preset + a render command, so it costs only render time (about 1 to 2 minutes each).

| File | Size | For | Layout notes |
| --- | --- | --- | --- |
| `phase-NN-master.mp4` | 1920 x 1080 | YouTube (also fine on X) | full frame |
| `phase-NN-shorts.mp4` | 1080 x 1920 | YouTube Shorts | Shorts safe area |
| `phase-NN-reels.mp4` | 1080 x 1920 | Instagram Reels | Reels safe area; the profile grid shows a 3:4 crop, keep the subject centred |
| `phase-NN-tiktok.mp4` | 1080 x 1920 | TikTok | TikTok safe area (its caption and buttons take more of the bottom and right) |
| `phase-NN-fb-reels.mp4` | 1080 x 1920 | Facebook Reels | Reels safe area |
| `phase-NN-feed.mp4` | 1080 x 1350 | X, Facebook feed, LinkedIn | 4:5, no platform buttons over the video: use the whole frame |

- **Never leave the protected areas blank.** Text and key content stay inside the safe area,
  but the edges keep moving: the diagram continues behind the buttons, a progress bar, a brand
  strip. (Phase 1's first Short left the bottom empty.)
- Safe-area sizes come from each platform's own preview / template (check when building the
  presets; they change). Presets live in `LAYOUT_PORTRAIT` (`components/theme.ts`), one per
  platform, validated by `npm run check:layout`.
- Composition ids: `PhaseNNMaster`, `PhaseNNShorts`, `PhaseNNReels`, `PhaseNNTiktok`,
  `PhaseNNFbReels`, `PhaseNNFeed`: one Short component with a `platform` prop that picks the
  preset.

## 9. Figma assets

Thumbnails and posts are made in Figma with the same look as the videos. `figma-assets/` (repo
root) holds the series' theme tokens, palette, grid patterns (every canvas size, plus the
master's framed stage), the icons the videos use and the avatar. It is GENERATED from the video
code by `node pipeline/build/export-figma-assets.mjs`, so Figma never drifts from the videos:
re-run it after adding icons or changing the theme, and never edit the folder by hand.

Also in it: the **Conceptoscope brand** (`brand/conceptoscope-mark.svg`, a lens with a lightbulb
inside, and the wordmarks for dark and light backgrounds, tagline "See the concept.") and
**full-size PNG frames of every beat** of each rendered phase (`frames/phase-NN/master/` and
`/short/`), made by `python3 pipeline/build/export-figma-frames.py NN <video slug>` after the
renders. No voice, music or meme clips go in `figma-assets/`: Figma cannot use them.
