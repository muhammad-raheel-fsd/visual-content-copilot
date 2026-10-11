# Phase 01: Who controls your phone? (What does an OS actually do?)

| | |
| --- | --- |
| Topic code | C10-01-01 |
| Class | Class 10 |
| Book | Computer Science and Entrepreneurship - Class 10 (PECTAA, 1st edition, April 2026) |
| Chapter | Chapter 1: Operating Systems: Structure and Services (chapter starts p. 1) |
| Book section | 1.1 Introduction to Operating System (OS), pages 2 to 3 |
| Book source used | `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md` |
| Priority / effort | A / M |
| Playlist | Class 10 Computer Science \| Animated Concepts (in book order; also "Operating Systems \| Class 10 CS Ch 1" once 3 videos exist) |
| Website page | `<website>/<class-10 course>/<chapter-1>/intro-to-os` (topic slug `intro-to-os`) |
| Status | v2 scripted (ready to record). v1 rendered earlier (history at the end). |

Rules for every phase: [production-guide.md](production-guide.md). One recording; the master,
every Short and the feed cut come from it.

**What the book says (quoted, used on screen word for word):**

- Definition: "Operating System (OS) is a type of system software that manages hardware, runs
  application software, and provides a user interface"
- Analogy: "An operating system works like a traffic controller for the computer. It decides
  which task should be done first, how the computer's memory is used, and which devices (like a
  printer or speakers) should be active at a given time."
- Translator: "The operating system acts as a translator between the user and the hardware
  system."
- Do You Know: "The letter A in binary is (01000001)."
- Multi-user: the OS creates separate **user accounts**, keeps each user's files **private**,
  shares the computer's resources **fairly** and protects them from **unauthorized access**.

Complete: every idea of book section 1.1 has its beat. Added for life (marked as ours, not the
book's): the phone scene, the one-tap journey, a common mistake, one real-life example.

---

## 1. Hook options

Lines 1.1 and 1.2 open the master AND the Short, so they must work alone.

1. **(picked)** "Tumhare phone mein shayad pachaas se zyada apps hain. Lekin kabhi socha hai ke
   in sab ko control kaun karta hai? Aur mera matlab tum se nahi tha." The playful twist makes
   them smile and stay for the answer.
2. "Teen apps, ek CPU. Kaun decide karta hai ke pehle kaun chalega?" Sharp, but needs the scene
   first.
3. "Tumhara phone ek busy crossroad hai, aur har app ek car. Signal kaun hai?" Fun, but gives
   the analogy away before the question lands.

---

## 2. Master transcript (read once, straight through)

About 4 minutes 12 seconds after editing (about 740 words). **Bold** = stress the word. Do not
read the line IDs. A mistake? Say the line again and carry on: the last complete take wins and
every pause is trimmed in the edit. Speak like you are explaining to your younger brother.

### Beat 1: Hook (0:00 to 0:22)

> `1.1` Tumhare phone mein shayad **pachaas** se zyada apps hain.
> `1.2` Lekin kabhi socha hai ke in sab ko **control** kaun karta hai? Aur mera matlab tum se
> nahi tha.
> `1.3` Tum kisi app pe tap karte ho, aur woh foran open jaati hai. Lekin us ek tap
> ke peeche, under the hood, actually kya hota hai?
> `1.4` Aaj hum yahi samjhenge, step by step, bilkul simple terms mein.

### Beat 2: The problem (0:22 to 0:44)

> `2.1` Chalo, ek scene **imagine** karo.
> `2.2` Tumhare phone pe music chal raha hai, usi time WhatsApp pe message aata hai, aur tum
> simultaneously YouTube bhi khol lete ho.
> `2.3` Ab **teeno** apps ek hi time pe CPU se **processing** ki request karti hain, aur
> teeno ko memory yani RAM aur speaker bhi chahiye.
> `2.4` To **sawal** yeh hai: kaun decide karega ke pehle kaun process hoga, kis ko kitni
> memory milegi, aur speaker pe kis ki awaaz aayegi?

### Beat 3: The answer, book definition (0:44 to 1:05)

> `3.1` Is question ka simple answer hai: **Operating System**, yaani OS.
> `3.2` Tumhari book ke mutabiq OS ek system
> software hai, jo hardware ko **manage** karta hai, application software ko **chalata** hai,
> aur **user interface** deta hai.
> `3.3` Windows, macOS, Linux, Android aur iOS, yeh sab Operating Systems hain. Tumhare phone
> mein Android ya iOS exactly yahi kaam kar raha hai.

### Beat 4: The traffic controller (1:05 to 1:53)

> `4.1` Tumhari book OS ko computer ka **traffic controller** kehti hai, which is a perfect example.
> `4.2` Imagine karo ek busy **crossroad**, jahan har taraf se cars aa rahi hain. Agar wahan
> traffic signal nahi hai, to saari cars aapas mein **crash** ho jayengi.
> `4.3` Tumhare phone mein yeh cars tumhari apps hain, aur traffic **signal** Operating System hai.
> `4.4` Aur yeh signal teen important **decisions** leta hai.
> `4.5` **Number ek**: kaunsa kaam pehle hoga, yaani CPU sab se pehle kis app ko **process**
> karega.
> `4.6` **Number do**: computer ki memory kis app ko kitni milegi.
> `4.7` **Number teen**: kaunsa device, jaise printer ya speaker, kis time per activate hoga.
> `4.8` In simple terms, the OS switches the CPU between apps in the blink of an eye.
> `4.9` Isi liye tum song sunte hue WhatsApp bhi chala sakty ho, aur tumhara phone **hang** bhi nahi hota. Smooth, right?

### Beat 5: The translator (1:53 to 2:25)

> `5.1` Ab OS ki doosri bri responsibility hain **translation**.
> `5.2` Yani Hum Urdu ya English bolte hain, lekin computer sirf **binary** samajhta hai, just the zero aur one.
> `5.3` To socho: jab tum keyboard pe letter **A** dabate ho, to computer tak actually kya
> pohnchta hai?
> `5.4` Computer tak pohnchta hai yeh binary code: zero, one, zero, zero, zero, zero, zero,
> one.
> `5.5` OS ne tumhare A ko binary mein convert kiya, aur phir screen pe A dikha diya. Aur yeh
> sab behind the scenes itna fast hota hai ke tumhein pata bhi nahi chalta.

### Beat 6: Many users, one computer (2:25 to 2:51)

> `6.1` Ab ek aur situation imagine karo: tumhare school ki computer lab, jahan ek hi computer
> pe kai students kaam karte hain.
> `6.2` Yahan OS har student ka alag **user account** banata hai, different username aur password ke
> saath.
> `6.3` Har student ki files **private** rehti hain, aur koi bhi doosre ki files bina
> permission ke nahi acess kr sakta.
> `6.4` Aur OS computer ke resources sab mein **equally** share karta hai, taake ek student ki
> wajah se baaqi sab ka computer slow na hojaey.

### Beat 7: One tap, start to finish (2:51 to 3:22)

> `7.1` Chalo, ab wapas apne pehle question pe aate hain: jab tum YouTube pe tap karte ho, to
> under the hood kya hota hai?
> `7.2` **Number ek**: OS tumhare tap ko hardware ki instruction mein convert karta hai.
> `7.3` **Number do**: OS YouTube ko memory yani RAM mein place hai.
> `7.4` **Number teen**: OS app ko CPU tkk ki access deta hai, taake CPU us ko **process** kar sake.
> `7.5` **Number chaar**: OS screen aur speaker ko activate krta hai.
> `7.6` And this is how tum ye video dekh paa rhy ho. Yaani tumhary 1 tap pe OS apni sari super powers activate krdeta hain.

### Beat 8: A common mistake (3:22 to 3:36)

> `8.1` Ab ek **common mistake**, jo bohat se students karte hain: woh samajhte hain ke
> Windows ya Android bhi bas ek app hai.
> `8.2` Lekin yaad rakhna: WhatsApp aur YouTube **application software** hain, aur Operating
> System **system software** hai, jis ke upar yeh saari apps chalti hain.

### Beat 9: Recap (3:36 to 3:47)

> `9.1` To OS ke yeh chaar kaam hamesha yaad rakhna: yeh hardware ko manage karta hai, saari
> apps chalata hai, user interface deta hai, aur har user ka data alag rakhta hai.

### Beat 10: Question, website, next video (3:47 to 4:12, then a 5 s end card)

> `10.1` To ab tum comments mein batao: agar chaar apps ek hi time pe CPU ko processing ki
> request bhejein, to kaun **decide** karega ke CPU pehle kis app ko process kare?
> `10.2` Is topic ke MCQs, short questions aur notes maine website pe daal diye hain. Abhi jao
> aur check karo ke tum kitne solve kar paate ho.
> `10.3` OS ki agli video mein hum dekhenge ke **Kernel** aur **Shell** mein kya **difference** hai.
> `10.4` Follow aur subscribe kar lo, taake agli video miss na ho jaye.
> `10.5` Allah Hafiz.

---

## 3. Master visual plan (16:9)

Look (production guide, section 7): GitHub dark, grid background, the master on a framed stage
(`StageFrame`). Blue = Operating System, yellow = question / highlight, red = conflict, green =
success. Build each diagram one part per sentence; every explanation moves on its words.
No music, no bells or melodies (production guide, "Halal audio"): voice + non-musical SFX only.

Constant overlays: top-left `Class 10 | Ch 1 | 1.1 Introduction to Operating System (OS)`
(small, muted); bottom-right small `MR` avatar + handle (until the website line).

| Beat | On screen | Animation on the words | SFX |
| --- | --- | --- | --- |
| 1 Hook | Phone in the centre, app icons fill its grid (WhatsApp, YouTube, TikTok, calculator, camera, music, chat, then grey tiles). A counter climbs to "50+". | Icons burst in on "pachaas". On "control" a big yellow "?" pops over the phone (zoom in). On "mera matlab tum se nahi tha" a stick figure shrugs with a red "Tum nahi!" and a wink. On "under the hood" the phone tilts and its screen goes dark (we look inside). On 1.4 the title "Who controls your phone?" types in. | `tick.wav` per few icons, `snap.wav` on "control", `pop.wav` on "mera matlab", `whoosh.wav` on "under the hood" |
| 2 Problem | Three app cards on the left (Music, WhatsApp, YouTube) as named; three boxes on the right (CPU, RAM, Speaker). | On "processing" request dots fly from each app to the CPU and jam (red). The spotlight moves CPU, RAM, Speaker as named. On 2.4 "Pehle kaun?" in yellow. | `pop.wav` per card, `zap.wav` on the jam, `snap.wav` on the question |
| 3 Answer | Blue band "Operating System (OS)". The book definition types in (English, word for word) with "Book: Class 10, Chapter 1, page 2". Logos: Windows, macOS, Linux, Android, iOS. | Band lands on "Operating". The three key phrases light up blue on "manage", "chalata", "user interface". Logos pop as named; on "tumhare phone mein" the Android and iOS logos lift and glow. | `swoosh.wav`, soft `type.wav`, `snap.wav` per phrase, `pop.wav` per logo |
| 4 Traffic controller | The crossroad (`Crossroad`) on the left; "OS ke 3 decisions" cards on the right; a time bar below. | Cars (apps) drive in on "crossroad" and crash on "crash". The OS signal drops in on "signal" and lines them up. On each "number" a car drives to its box (CPU top, Memory right, Device bottom) and its card slams in. On "simple lafzon mein" the apps take turns in the CPU box and the time bar fills by app colour. On 4.9 a music note and a WhatsApp bubble play together on a small phone, "hang nahi hota" with a green check. | `zap.wav`, `thud.wav` on the signal, `snap.wav` + `whoosh.wav` per number, `thud.wav` on 4.9 |
| 5 Translator | Keyboard, the OS box "Translator", a monitor. Header "Hum: Urdu / English. Computer: 0 aur 1". | On "socho" the A key glows yellow and a "?" hangs over the OS box. On 5.4 the 8 bits type in, one per spoken digit, travel to the monitor, and a big "A" appears on "screen". | `click.wav`, `type.wav` per bit, `pop.wav` on the A |
| 6 Many users | A lab computer in the centre; three student cards (Ali, Ayesha, Hamza). | Cards pop on "students"; "Account + password" and a lock on "user account"; locks turn blue on "private"; "Access denied" in red on "permission"; on 6.4 three equal resource bars fill side by side ("equally"). | `pop.wav`, `click-soft.wav` on the locks, `zap.wav` on "Access denied", `thud.wav` on 6.4 |
| 7 One tap | Phone with the YouTube icon; a path of numbered steps: OS, RAM, CPU, Screen + speaker. | Tap ripple on "tap". Each step pops on its "number" with a dot flowing along the arrow; "CPU time" under the CPU step. On "video chal parti hai" the phone plays a video, then the caption "Ek tap ke peeche: OS ka poora architecture". | `click.wav`, `snap.wav` per number, `thud.wav` on the video |
| 8 Common mistake | Left: Windows and Android logos with "App?" and a red cross. Right: two layers, the bottom one "Operating System (system software)", the top one "Apps (application software)" holding WhatsApp and YouTube. | On "common mistake" the logos get the red "App?" tag. On "lekin yaad rakhna" the logos slide into the bottom OS layer; on "application software" the app icons drop onto the top layer; "jis ke upar" draws arrows up from the OS layer. | `zap.wav` on the mistake, `thud.wav` when the layers settle |
| 9 Recap | Card "OS ke 4 kaam" with four rows (hardware, apps, user interface, data alag). | Each row checks in on its words. | `pop.wav` per row, `thud.wav` at the end |
| 10 End | Question card with "Comments mein batao"; website card ("MCQs + short questions + notes" + website, "Test yourself"); next-topic card "Next: Kernel vs Shell, kya farq hai?"; follow button; end card (5 s). | Question pulses on "decide karega"; website card slides up on "website"; next-topic card on "Kernel"; the follow button pulses on "follow" with "agli video miss na ho" under it; end card fades in after "Allah Hafiz". | `pop.wav`, `thud.wav` on the website, `pop.wav` on next, `snap.wav` on follow |

---

## 4. Short (9:16, about 58 s): cut list from the master voice

One complete idea: who controls the apps, the book's traffic controller and its 3 decisions,
then what comes next. (4.8, time sharing, stays in the master only; if the recording runs long,
4.4 is the next line to drop.) Whole consecutive lines, few cuts. One render per platform
(production guide, section 8): YouTube Shorts, Instagram Reels, TikTok, Facebook Reels, plus the
4:5 feed cut.

| Order | Lines | What it says | 9:16 visual |
| --- | --- | --- | --- |
| 1 | `1.1`, `1.2` | 50 apps... control kaun karta hai? Aur mera matlab tum se nahi tha. | Phone fills the frame, icons burst in; yellow "?"; on "mera matlab" a wink sticker and "Tum nahi!" in red. |
| 2 | `3.1` | Is question ka simple answer hai: Operating System, yaani OS. | Traffic light drops in, big "Operating System (OS)". |
| 3 | `4.1` to `4.4` | Book: traffic controller; busy crossroad; apps = cars, signal = OS; teen decisions. | Book card, then the crossroad: cars crash, the OS signal lines them up. |
| 4 | `4.5` to `4.7` | Number ek / do / teen. | On each "number" a car drives to CPU, Memory, Device. |
| 5 | 1.2 s beat | (no voice: rows pop with sound) | Takeaway card "OS = traffic controller: 1 CPU pehle kis ko? 2 Memory kis ko, kitni? 3 Kaunsa device, kab?" (same labels as the master's decision cards) |
| 6 | `10.3`, `10.4` | OS ki agli video mein Kernel aur Shell ka difference... Follow aur subscribe kar lo, taake agli video miss na ho jaye. | "Next: Kernel vs Shell" card, avatar + handle + follow button, website on screen. Last frame = first frame so it loops. |

- Captions burned in, 3 words at a time, key words in blue.
- The website is on screen only; each platform's caption says where the link is.
- The protected areas (bottom, right) are never blank: the grid, a progress line and a faint
  strip of the video's icons drifting left (`ShortStrip`) sit behind the platform's caption and
  buttons; text stays inside the safe area.

---

## 5. Website quiz (3 questions, answers checked against the book)

1. Agar do apps ek hi time pe CPU ko processing ki request bhejein, to kaun decide karta hai
   ke CPU pehle kis ko process kare?
   a) Speaker b) **Operating System** c) Keyboard d) WhatsApp. Answer: b (book: the OS
   "decides which task should be done first").
2. "An operating system works like a ______ for the computer."
   a) printer b) **traffic controller** c) speaker d) keyboard. Answer: b (book, 1.1).
3. The letter A in binary is:
   a) **01000001** b) 10000010 c) 00000001 d) 11111111. Answer: a (book, Do You Know box;
   A = 65 = 01000001).

## 6. Thumbnail

- Top-left tag: **CLASS 10 | CH 01**.
- Main text (2 lines): **WHO CONTROLS** / **YOUR PHONE?** (second line in yellow).
- Right side: a phone with app icons and a traffic light with "OS" on it, on the grid
  background (`figma-assets/patterns/grid-1280x720-thumbnail.svg`).
- Own artwork only, no textbook scans.

## 7. Titles, descriptions, hashtags

**YouTube master title:** Who Controls Your Phone? Operating System Explained Simply | Class 10
Computer Science Ch 1

**YouTube master description:**

> Tumhare phone ki saari apps ko control kaun karta hai? Is video mein Operating System (OS) ko
> traffic controller aur translator ke example se samjho, aur dekho ke ek tap ke peeche kya
> hota hai.
>
> Book: Computer Science and Entrepreneurship - Class 10, Chapter 1: Operating Systems:
> Structure and Services, 1.1 Introduction to Operating System (OS).
>
> MCQs, short questions aur notes: REPLACE-ME (website link to this topic)
>
> 0:00 Hook
> 0:22 Teen apps, ek CPU
> 0:44 Operating System kya hai (book definition)
> 1:05 OS: traffic controller
> 1:53 OS: translator (A = 01000001)
> 2:25 Ek computer, kai users
> 2:51 Ek tap ke peeche kya hota hai
> 3:22 Students ki common mistake
> 3:36 Recap
>
> Muhammad Raheel · Full Stack Developer · AI Engineer

(Update the timestamps from the final render.)

**Short title (YouTube Shorts):** Who controls your phone apps? | Class 10 Computer Science Ch 1

**Instagram / TikTok / Facebook caption:**

> Tumhare phone ki apps ko control kaun karta hai? Tum nahi. Operating System, computer ka
> traffic controller, aur yeh teen decisions har second leta hai. Agla part: Kernel vs Shell.
> MCQs aur notes: link in bio. Class 10 Computer Science, Ch 1.

**Hashtags:** #Class10ComputerScience #OperatingSystem #ComputerScience #PunjabBoard
#MatricComputer #LearnInUrdu #StudyWithMe #Shorts

**Pinned comment:** "Agar chaar apps ek hi time pe CPU ko processing ki request bhejein, to kaun
decide karega ke CPU pehle kis ko process kare? Comments mein
batao, phir website pe 3 sawal ka quiz try karo: REPLACE-ME"

---

## 8. Recording notes (for you)

- One recording only: read section 2 from `1.1` to `10.5` in one go, one steady tone. Do not
  read the line IDs.
- Mistake? Just say the line again and keep going. You never edit anything: silences, "umm",
  retakes and speed are all fixed in the edit (production guide, section 3).
- Say "number ek / number do / number teen" clearly: each one moves something on screen.
- Read the binary digits clearly: the animation types one bit per digit.
- Let each sentence finish naturally; do not clip the last word (the edit keeps your full
  ending).
- Save as `videos/recordings/phase-01-v2.m4a` (any phone format is fine).

## 9. Build notes (for the Remotion step)

- Folder: `apps/remotion/videos/phase-01-who-controls-your-phone/`. Compositions:
  `Phase01Master` (16:9) + the per-platform Shorts and feed cut (production guide, section 8).
- Voice: `pipeline/build/` steps (transcribe, vad, `phase-01-v2-alignment.py`,
  `chunk_transcribe.py` repeat check, `render_voice_lines.py`) > `library/voiceover/phase-01-v2/lines/` (43 lines, 3:58).
- Compositions: `Phase01Master` (4:15 with the end card), and one Short per platform from
  `Phase01Short` with a `platform` prop: `Phase01Shorts`, `Phase01Reels`, `Phase01Tiktok`,
  `Phase01FbReels` (1080 x 1920) and `Phase01Feed` (1080 x 1350), all 55.8 s. Presets:
  `LAYOUT_PORTRAIT.fl{Shorts,Reels,Tiktok,FbReels}` and `LAYOUT_FEED.flFeed`.
- v2 visuals as built: 1.4 "step by step / bilkul simple", 3.3 Android + iOS lift on
  "tumhare", 4.9 phone (song + WhatsApp, "Hang nahi hota", "Smooth, right?"), 6.4 equal 1/3
  CPU bars, beat 8 `SceneMistake` (logos tagged "App?", slide into the OS layer, apps on top,
  arrows on "upar"), beat 10 question / website / next / follow.

### As recorded (v4, 2026-10-11, calm even tone): the current master

`videos/recordings/phase-01-v4.m4a` (4:36 raw). The voice is the script: dropped compared with
the written lines are the 1.2 twist ("Aur mera matlab tum se nahi tha"), 2.1 ("Chalo, ek scene
imagine karo"), "jo ek perfect example hai" (4.1) and "Smooth, right?" (4.9); 9.1 says "har user
ka data separate rakhta hai", 7.6 starts "And this is how". No retakes. Voice: EQ + gentle
compression + limiter at Muhammad's own loudness (`voice_master.py`). Built by
`pipeline/build/phase-01-v4-alignment.py`. The hook's left side now shows a game controller and
"Control kaun karta hai?" on "control kaun karta hai?", followed by the "Bas hawa nikal gayi"
meme. Handles run along the bottom all video long; the last meme (Carry's subscribe) is straight.

### As recorded (v3, 2026-10-10, the humour pass)

`videos/recordings/phase-01-v3.m4a` (4:29 raw). Cut: the first take of 10.4. Not said, so not
animated: the end of 6.4 ("taake ek student ki wajah se ... slow na hojaey"). Spoken
differences kept in the captions: 6.2 "alag user account manage karta hai", 7.6 "aap yeh video
bhi dekh pa rahe ho", 9.1 "har user ka data alag se manage karta hai", 10.2 "saare MCQs". Built
by `pipeline/build/phase-01-v3-alignment.py`; voice evened out by `voice_master.py` (no boost). Master 4:24,
Short 57.9 s.

Memes (`memes.tsx`, `library/memes/CREDITS.md`): "Bas hawa nikal gayi" after "mera matlab tum
se nahi tha" (also in the Short), "Abhi maza aayega na bhidu" after 1.4, FAAAH on "hang",
"Shabash beta, bahut badhiya" after "Smooth, right?", Goku Ultra Instinct on "superpowers"
with Carry's "Raja ji apni shaktiyon ka poora istemaal kar rahe hain" over him, "Kuch to
gadbad hai, Daya" after 8.1, Carry's "subscribe karo, woh jo laal wala button hai, usko click
karo" after 10.4 (master only: the Short would pass 60 s). Every meme: raw clip, centred, tilted 3
degrees, same height, while the whole picture pauses and blurs. No background music or nasheed.

### As recorded (v2, 2026-10-10)

`c:/Users/mdrah/Videos/2026-10-10 15-54-44.mp4`. Cut in the edit: the mike check, 7 false
starts (2.4, 3.2, 4.3, 4.5 "request", 5.1, 5.3, the first ending of 7.6), a click + "uhh"
in 3.3, and two repeats found later by the per-chunk repeat check (the first "Agar wahan
traffic signal na ho" in 4.2, the first take of 4.9); the last complete take wins each time. Spoken differences kept: 7.3 says "Number two",
7.6 ends "OS apni poori jaan laga deta hai". Details: `pipeline/build/phase-01-v2-alignment.py`.

---

## History: v1 (recorded 2026-10-10)

`videos/recordings/phase-01.mp4` (3:25 raw), rendered to `output/phase-01/` (master 2:51, Short
46 s). Two mistakes cut in the edit: the false start "itni tezi se" in 5.5 and the first take
of the follow line. Muhammad's review led to v2: the master must be 4 to 5 minutes and the
Short 50 to 60 s; lines must sound spoken, not like notes ("Yaad rakho, OS ke kaam: ..." became
a full sentence); every ask has a reason; the closing names the next video; GitHub dark with a
grid; one render per platform. The v1 alignment is `pipeline/build/phase-01-alignment.py`.
