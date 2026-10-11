"""
Phase 02 alignment (production guide, section 3). Recording: videos/recordings/phase-02.m4a
(3:54 raw, 2026-10-11), Kernel vs Shell.

LINES holds the Roman Urdu words AS SPOKEN (he said 1.5 without "uske do parts mein", added 7.5
"Aur yahan driver tum ho" and changed 10.2 to "Abhi ja ke visit karo") (the voice is the script: captions and cues follow
it), checked against the transcript (pipeline/build/fw_transcribe_chunked.py: the whole-file run
looped on the spoken binary digits; 0-20.6 s and 173-193 s were re-transcribed per VAD region
because 20 s pieces dropped text). Word timings come from align_roman.py; boundaries snap to
silences. CUTS lists retakes and fillers (named here).

The voice is played VERBATIM (see "span" below): nothing inside the recording is cut, faded or
re-timed. Then: python3 pipeline/build/render_voice_lines.py --verbatim ...

Run from the repo root: python3 pipeline/build/phase-02-alignment.py
"""
import array
import json
import math
import sys
import wave

sys.path.insert(0, "pipeline/build")
from align_roman import align  # noqa: E402

LINES = [
    ("1.1", 'Tum phone ya computer pe type karte ho, click karte ho, ya tap karte ho.'),
    ("1.2", 'Pichli video mein humne dekha tha ke Operating System tumhari in saari commands ko manage karta hai.'),
    ("1.3", 'Lekin kabhi socha hai ke yeh saari commands hardware tak pohnchti kaise hain?'),
    ("1.4", 'Jaise letter A ka binary code 01000001 hai. Lekin A hardware tak kaise pohncha, aur hardware ne isay samjha kaise?'),
    ("1.5", 'Iska answer Operating System ke andar hi hai.'),
    ("1.6", 'Aaj hum in dono ko step by step samjhenge, bilkul simple terms mein.'),
    ("2.1", 'Sab se pehle ek baat clear kar lo: Shell aur Kernel, dono Operating System ke hi parts hain.'),
    ("2.2", 'Operating System tumhari commands ka kaam inhi do parts ke zariye karta hai.'),
    ("2.3", 'Shell is ka bahar wala part hai, jo tum se baat karta hai. Aur Kernel is ka andar wala part hai, jo hardware se baat karta hai.'),
    ("3.1", 'To pehle Kernel ko samajhte hain.'),
    ("3.2", 'Tumhari book ke mutabiq, Kernel Operating System ka core part hai.'),
    ("3.3", 'Simple terms mein, Kernel computer ke hardware ko directly control karta hai, jaise CPU, memory aur devices.'),
    ("3.4", 'Aur Kernel hi decide karta hai ke kaunsa program in resources ko kab aur kaise use karega.'),
    ("3.5", 'Jaise agar do apps ek hi time pe speaker use karna chahein, to Kernel decide karta hai ke awaaz kis ki aayegi.'),
    ("4.1", 'Ab aate hain Shell ki taraf.'),
    ("4.2", 'Tumhari book ke mutabiq, Shell Operating System ka outer part hai, jo user se interact karta hai.'),
    ("4.3", 'Yaani Shell tumhari commands receive karta hai, aur unhein Kernel tak pass karta hai.'),
    ("4.4", 'Shell do types ke hote hain.'),
    ("4.5", 'Number ek: graphical shell, jaise Windows desktop, jahan tum icons pe click karte ho aur menus choose karte ho.'),
    ("4.6", 'Number do: command-line shell, jaise Command Prompt ya Terminal, jahan tum instructions type karte ho.'),
    ("5.1", 'Ab poora scenario dekhte hain, tumhari book ki example ke saath: jab tum ek file open karte ho, to kya hota hai?'),
    ("5.2", 'Number ek: tum file pe click karte ho, aur Operating System ka Shell yeh command receive karta hai.'),
    ("5.3", 'Number do: Shell yeh command OS ke Kernel tak pass karta hai.'),
    ("5.4", 'Number teen: Kernel hard drive se file read karta hai, aur CPU aur memory ko kaam pe lagata hai.'),
    ("5.5", 'Number chaar: Kernel file ko screen tak bhejta hai, aur Shell ke zariye file tumhare saamne open ho jati hai.'),
    ("5.6", 'To command Shell se Kernel tak jati hai, aur Kernel se hardware tak. Aur result wapas hardware se Kernel, aur Kernel se Shell ke zariye tum tak aata hai.'),
    ("5.7", 'Tumhara A bhi isi tarah pohnchta hai: jab tum Command Prompt mein A type karte ho, to Shell usay receive karta hai, aur Kernel, jo hardware ko control karta hai, usay screen tak pohnchata hai.'),
    ("6.1", 'Tumhari book yahi baat ek diagram se dikhati hai.'),
    ("6.2", 'Sab se upar user aur applications hain, phir Operating System, aur sab se neeche hardware.'),
    ("6.3", 'Aur Operating System ke andar, Shell user ki taraf hai, aur Kernel hardware ki taraf.'),
    ("7.1", 'Tumhari book in dono ko ek car ki example se bhi samjhati hai.'),
    ("7.2", 'Car ka engine Kernel hai, jo asal kaam karta hai.'),
    ("7.3", 'Aur steering wheel aur dashboard Shell hain, jin ke zariye driver car ko control karta hai.'),
    ("7.4", 'Driver engine ko directly handle nahi karta. Woh steering use karta hai, aur baaqi kaam engine karta hai.'),
    ("7.5", 'Aur yahan driver tum ho.'),
    ("8.1", 'Ab ek common mistake, jo bohat se students karte hain: woh samajhte hain ke Shell sirf Command Prompt jaisi black screen hoti hai.'),
    ("8.2", 'Lekin Windows desktop bhi ek Shell hai, graphical shell. Dono hi Shell hain.'),
    ("9.1", 'To yeh hamesha yaad rakhna: Shell aur Kernel, dono Operating System ke parts hain.'),
    ("9.2", 'Shell outer part hai, jo tumhari commands leta hai. Aur Kernel is ka core part hai, jo hardware ko control karke woh kaam karwata hai.'),
    ("10.1", 'To ab tum comments mein batao: jab tum Command Prompt mein ek command type karte ho, to is ka kaunsa part tumhari command receive karta hai, Shell ya Kernel?'),
    ("10.2", 'Is topic ke MCQs, short questions aur notes maine website pe daal diye hain. Abhi ja ke visit karo.'),
    ("10.3", 'OS ki agli video mein hum dekhenge ke Operating System kaise decide karta hai ke CPU apps ko kis order mein process karta hai.'),
    ("10.4", 'Aur yaad rakhna, yeh animated series sirf concepts ko samjhane ke liye hai. Meri full lecture series is se kahin zyada detailed aur interesting hai.'),
    ("10.5", 'To follow aur subscribe kar lo, taake jab woh series launch ho, to tum usay foran access kar sako, aur meri website pe quizzes aur important short questions aur long questions ki practice bhi kar sako.'),
    ("10.6", 'Allah Hafiz.'),
]

CUTS = []

ENGLISH_TOKENS = []
# no digit spreading: 1.4's "01000001" stays one word (the scene types the bits itself)
DIGITS = None

VAD = "videos/transcripts/phase-02-vad.json"
WHISPER = "videos/transcripts/phase-02-ur.json"
WAV16 = ".whisper/phase-02.wav"
OUT = "videos/transcripts/phase-02-lines.json"
PAD = 0.08
QUIET_DB, QUIET_FOR = -62, 25

# speech regions under 0.15 s are clicks and breaths, not words
vad = [r for r in json.load(open(VAD))["segments"] if r[1] - r[0] >= 0.15]
_w = wave.open(WAV16)
_hop = _w.getframerate() // 100
_pcm = array.array("h", _w.readframes(_w.getnframes()))
DB = [20 * math.log10(math.sqrt(sum(x * x for x in _pcm[i:i + _hop]) / _hop) / 32768 + 1e-12) for i in range(0, len(_pcm) - _hop, _hop)]


def natural_end(e, limit):
    k, last_loud, stop = int(e * 100), int(e * 100), int(limit * 100)
    while k < stop and k < len(DB):
        if DB[k] > QUIET_DB:
            last_loud = k
        elif k - last_loud >= QUIET_FOR:
            break
        k += 1
    return min(limit, (last_loud + 1) / 100 + 0.06)


def natural_start(s, limit):
    k = int(s * 100)
    floor = max(int(limit * 100), k - 20)
    while k - 1 > floor and DB[k - 1] > QUIET_DB:
        k -= 1
    return max(limit, k / 100 - 0.03)


def cut(t0, t1):
    return any(min(t1, ce) - max(t0, cs) > 0 for cs, ce in CUTS)


# tokens: Whisper's (deduplicated, retakes removed), the English clip spliced in, digits dropped
tokens, seen = [], set()
for seg in json.load(open(WHISPER))["segments"]:
    for w in seg["words"]:
        key = (round(w["start"], 2), w["word"])
        if key in seen or cut(w["start"], w["end"]):
            continue
        if ENGLISH_TOKENS and ENGLISH_TOKENS[0][0] - 0.1 <= w["start"] < ENGLISH_TOKENS[-1][1]:
            continue
        if DIGITS and DIGITS[0] - 0.1 <= w["start"] < DIGITS[1]:
            continue
        seen.add(key)
        tokens.append((w["start"], w["end"], w["word"].strip()))
tokens += ENGLISH_TOKENS
tokens.sort()

script = [(lid, word) for lid, text in LINES for word in text.split()]
timed = align([w for _, w in script], tokens)

# report runs of 3+ unmatched tokens: extra speech (a retake, a filler) to check by ear
used = {(t0, t1) for _, t0, t1 in timed}
run = []
for t in tokens + [(1e9, 1e9, "")]:
    if (t[0], t[1]) in used:
        if len(run) >= 3:
            print(f"EXTRA SPEECH {run[0][0]:.2f}-{run[-1][1]:.2f}: {' '.join(x[2] for x in run)}")
        run = []
    else:
        run.append(t)

by_line: dict[str, list] = {}
for (lid, _), (w, t0, t1) in zip(script, timed):
    by_line.setdefault(lid, []).append([w, t0, t1])
ids = [lid for lid, _ in LINES]
span = {lid: (min(w[1] for w in ws), max(w[2] for w in ws)) for lid, ws in by_line.items()}
# the binary code stays one caption word ("01000001"); no digit spreading in this phase

# Line boundaries: the midpoint between two lines, snapped to the nearest silence between speech
# regions when one is within 0.6 s (Whisper's word starts can be late; a cut mid-word is worse).
silences = [(vad[r][1] + vad[r + 1][0]) / 2 for r in range(len(vad) - 1)]


def boundary(t):
    near = min(silences, key=lambda g: abs(g - t))
    if abs(near - t) < 0.6:
        return near
    # continuous speech: split at the quietest 10 ms within 0.4 s of the midpoint
    k0, k1 = int((t - 0.4) * 100), int((t + 0.4) * 100)
    return min(range(k0, k1), key=lambda k: DB[k]) / 100


# A meme pause opens only between whole sentences, in Muhammad's own pause (2026-10-12: the
# typing meme goes after "...ya tap karte ho", not inside the sentence).
bounds = [boundary((span[ids[k]][1] + span[ids[k + 1]][0]) / 2) for k in range(len(ids) - 1)]

out = {}
for k, lid in enumerate(ids):
    s0, s1 = span[lid]
    lo = bounds[k - 1] if k else 0.0
    hi = bounds[k] if k + 1 < len(ids) else len(DB) / 100
    chunks = []
    for r, (vs, ve) in enumerate(vad):
        if min(ve, hi) - max(vs, lo) <= 0.05:
            continue
        prev_end = vad[r - 1][1] if r > 0 else 0.0
        next_start = vad[r + 1][0] if r + 1 < len(vad) else len(DB) / 100
        start = natural_start(vs - PAD, prev_end + 0.02) if vs >= lo else lo
        end = natural_end(ve + PAD, next_start - 0.04) if ve <= hi else hi
        start, end = max(start, lo), min(end, hi)
        if end - start < 0.05:
            continue
        if chunks and start <= chunks[-1][1] + 0.15:
            chunks[-1][1] = round(end, 3)
        else:
            chunks.append([round(start, 3), round(end, 3)])
    for cs, ce in CUTS:
        kept = []
        for c0, c1 in chunks:
            if ce <= c0 or cs >= c1:
                kept.append([c0, c1])
                continue
            if c0 < cs:
                kept.append([c0, round(cs, 3)])
            if c1 > ce:
                kept.append([round(ce, 3), c1])
        chunks = kept

    def clamp(t, chunks=chunks):
        if any(c[0] <= t <= c[1] for c in chunks):
            return t
        return min((c[0] if t < c[0] else c[1] for c in chunks), key=lambda x: abs(x - t))

    words = []
    for w, t0, t1 in by_line[lid]:
        t0, t1 = clamp(t0), clamp(t1)
        words.append([w, round(t0, 3), round(max(t1, t0 + 0.12), 3)])
    out[lid] = {"chunks": chunks, "rate": 1.0, "words": words}

# VERBATIM (Muhammad, 2026-10-11, "never edit my words"): no speed change, no trimmed pauses, no
# fades. Each line is the untouched stretch of the recording between its two boundaries
# ("span", seconds, on whole video frames so lines join sample-exact); the lines tile the
# recording, so playing them back to back IS the recording.
FPS = 30
total = len(DB) / 100
for k, lid in enumerate(ids):
    lo = bounds[k - 1] if k else max(0.0, out[lid]["chunks"][0][0] - 0.25)
    hi = bounds[k] if k + 1 < len(ids) else min(total, out[lid]["chunks"][-1][1] + 0.5)
    out[lid]["span"] = [round(round(lo * FPS) / FPS, 4), round(round(hi * FPS) / FPS, 4)]
    out[lid]["rate"] = 1.0

# PICKUPS (Muhammad, 2026-10-12): a phrase he re-recorded separately and asked to have put back,
# played as its own untouched file right after the line it belongs to (in that line's pause).
# Not one sample of the main recording is removed; the pickup is only finished by voice_master.py.
PICKUPS = [
    # "Iska answer Operating System ke andar hi hai" > "Uske do parts mein: Shell aur Kernel."
    ("1.5b", "1.5", 'Uske do parts mein: Shell aur Kernel.', "library/voiceover/phase-02/pickup-1.5.wav", "videos/transcripts/phase-02-pickup-1.5-ur.json"),
]
for pid, after, text, wav, tx in PICKUPS:
    _p = wave.open(wav)
    dur = _p.getnframes() / _p.getframerate()
    ptok = [(w["start"], w["end"], w["word"].strip()) for seg in json.load(open(tx))["segments"] for w in seg["words"]]
    pwords = text.split()
    ptimed = align(pwords, ptok)
    entry = {
        "file": wav,
        "chunks": [[0.0, round(dur, 3)]],
        "rate": 1.0,
        # a whole number of video frames (the file is padded by its own silence, under 1 frame)
        "span": [0.0, round(math.ceil(dur * FPS) / FPS, 4)],
        "words": [[w, round(t0, 3), round(max(t1, t0 + 0.12), 3)] for (w, t0, t1) in ptimed],
    }
    keys = list(out)
    out = {k: v for k in keys for k, v in ([(k, out[k])] + ([(pid, entry)] if k == after else []))}

json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print(f"{len(out)} lines -> {OUT}")
