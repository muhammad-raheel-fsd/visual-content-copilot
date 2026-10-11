"""
Phase 1 v4 alignment (production guide, section 3). Recording: videos/recordings/phase-01-v4.m4a
(4:36 raw, 2026-10-11), recorded in a calm, even tone, loudness set by Muhammad.

LINES holds the Roman Urdu words AS SPOKEN (the voice is the script: captions and cues follow
it). Compared with the written v3 script he dropped the 1.2 twist ("Aur mera matlab tum se nahi
tha"), line 2.1 ("Chalo, ek scene imagine karo"), "jo ek perfect example hai" (4.1) and
"Smooth, right?" (4.9). Word timings come from align_roman.py; boundaries snap to silences.
No retakes in this recording, so CUTS is empty. Whisper (language ur) drops English-only
sentences: 4.8 was transcribed separately in English (ENGLISH_TOKENS).

Run from the repo root: python3 pipeline/build/phase-01-v4-alignment.py
"""
import array
import json
import math
import sys
import wave

sys.path.insert(0, "pipeline/build")
from align_roman import align  # noqa: E402

LINES = [
    ("1.1", "Tumhare phone mein shayad pachaas se zyada apps hain."),
    ("1.2", "Lekin kabhi socha hai in sab ko control kaun karta hai?"),
    ("1.3", "Tum kisi app pe tap karte ho, aur woh foran open ho jaati hai. Lekin us ek tap ke peeche, under the hood, actually kya hota hai?"),
    ("1.4", "Aaj hum yahi samjhenge, step by step, bilkul simple terms mein."),
    ("2.2", "Tumhare phone pe music chal raha hai, usi time WhatsApp pe message aata hai, aur tum simultaneously YouTube bhi khol lete ho."),
    ("2.3", "Ab teeno apps ek hi time pe CPU se processing ki request karti hain, aur teeno ko memory yaani RAM aur speaker bhi chahiye."),
    ("2.4", "To sawal yeh hai: kaun decide karega ke pehle kaun process hoga, kis ko kitni memory milegi, aur speaker pe kis ki awaaz aayegi?"),
    ("3.1", "Is question ka simple answer hai: Operating System, yaani OS."),
    ("3.2", "Tumhari book ke mutabiq OS ek system software hai, jo hardware ko manage karta hai, application software ko chalata hai, aur user interface provide karta hai."),
    ("3.3", "Windows, macOS, Linux, Android aur iOS, yeh sab Operating Systems hain. Tumhare phone mein Android ya iOS exactly yahi kaam kar raha hai."),
    ("4.1", "Tumhari book OS ko computer ka traffic controller kehti hai."),
    ("4.2", "Imagine karo ek busy crossroad, jahan har taraf se cars aa rahi hain. Agar wahan traffic signal nahi hai, to saari cars aapas mein crash ho jayengi."),
    ("4.3", "Tumhare phone mein yeh cars tumhari apps hain, aur traffic signal Operating System hai."),
    ("4.4", "Aur yeh signal teen important decisions leta hai."),
    ("4.5", "Number ek: kaunsa kaam pehle hoga, yaani CPU sab se pehle kis app ko process karega."),
    ("4.6", "Number do: computer ki memory kis app ko kitni milegi."),
    ("4.7", "Number teen: kaunsa device, jaise printer ya speaker, kis time par activate hoga."),
    ("4.8", "In simple terms, the OS switches the CPU between apps in the blink of an eye."),
    ("4.9", "Isi liye tum song sunte hue WhatsApp bhi chala sakte ho, aur tumhara phone hang bhi nahi hota."),
    ("5.1", "Ab OS ki doosri bari responsibility hai translation."),
    ("5.2", "Yaani hum Urdu ya English bolte hain, lekin computer sirf binary samajhta hai, just zeros aur ones."),
    ("5.3", "To socho, jab tum keyboard pe letter A type karte ho, to computer tak actually kya pohnchta hai?"),
    ("5.4", "Computer tak pohnchta hai yeh binary code:"),
    ("5.5", "OS ne tumhare A ko binary mein convert kiya, aur phir screen pe A display kar diya. Aur yeh sab behind the scenes itna fast hota hai, ke tumhein pata bhi nahi chalta."),
    ("6.1", "Ab ek aur situation imagine karo: tumhare school ki computer lab, jahan ek hi computer pe kai students kaam karte hain."),
    ("6.2", "Yahan har student ka alag user account banata hai, different username aur passwords ke saath."),
    ("6.3", "Har student ki files private rehti hain, aur koi bhi doosre ki files bina permission ke access nahi kar sakta."),
    ("6.4", "Aur OS computer ke resources sab mein equally share karta hai."),
    ("7.1", "Chalo, ab wapas apne pehle question pe aate hain: jab tum YouTube pe tap karte ho, to under the hood kya hota hai?"),
    ("7.2", "Number ek: OS tumhare tap ko hardware ki instructions mein convert karta hai."),
    ("7.3", "Number do: OS YouTube ko memory yaani RAM mein place karta hai."),
    ("7.4", "Number teen: OS app ko CPU tak ki access deta hai, taake CPU us ko process kar sake."),
    ("7.5", "Number chaar: OS screen aur speaker ko activate karta hai."),
    ("7.6", "And this is how tum yeh video bhi dekh pa rahe ho. Yaani tumhare ek tap par OS apni saari superpowers activate kar leta hai."),
    ("8.1", "Ab ek common mistake, jo bohat se students karte hain: woh samajhte hain ke Windows ya Android bhi bas ek app hai."),
    ("8.2", "Lekin yaad rakhna: WhatsApp aur YouTube application softwares hain, aur Operating System ek system software hai, jis ke upar yeh saari apps chalti hain."),
    ("9.1", "To OS ke yeh chaar kaam hamesha yaad rakhna: yeh hardware ko manage karta hai, saari apps chalata hai, user interface deta hai, aur har user ka data separate rakhta hai."),
    ("10.1", "To ab tum comments mein batao: agar chaar apps ek hi time pe CPU ko processing ki request bhejein, to kaun decide karega ke CPU pehle kis app ko process karega?"),
    ("10.2", "Is topic ke MCQs, short questions aur notes maine website pe daal diye hain. Abhi jao aur check karo tum kitne solve kar paate ho."),
    ("10.3", "OS ki agli video mein hum dekhenge ke Kernel aur Shell mein kya difference hai."),
    ("10.4", "Follow aur subscribe kar lo, taake agli video tum se miss na ho jaye."),
    ("10.5", "Allah Hafiz."),
]

CUTS = []

# 4.8, transcribed with language "en" (a clip of 106.3 to 111.5 s)
ENGLISH_TOKENS = [
    (106.5, 106.7, "In"), (106.7, 107.0, "simple"), (107.0, 107.56, "terms"), (107.56, 107.66, "the"),
    (107.66, 108.0, "OS"), (108.0, 108.52, "switches"), (108.52, 108.84, "the"), (108.84, 109.18, "CPU"),
    (109.18, 109.68, "between"), (109.68, 110.14, "apps"), (110.14, 110.42, "in"), (110.42, 110.58, "the"),
    (110.58, 110.82, "blink"), (110.82, 111.08, "of"), (111.08, 111.18, "an"), (111.18, 111.32, "eye"),
]
DIGITS = (138.38, 141.62, "01000001")

VAD = "videos/transcripts/phase-01-v4-vad.json"
WHISPER = "videos/transcripts/phase-01-v4-ur.json"
WAV16 = ".whisper/phase-01-v4.wav"
OUT = "videos/transcripts/phase-01-v4-lines.json"
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
        if ENGLISH_TOKENS[0][0] - 0.1 <= w["start"] < ENGLISH_TOKENS[-1][1]:
            continue
        if DIGITS[0] - 0.1 <= w["start"] < DIGITS[1]:
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
span["5.4"] = (span["5.4"][0], DIGITS[1])

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

# 5.4: the 8 digits, spread over their speech region
d0, d1, bits = DIGITS
step = (d1 - d0) / len(bits)
for i, bit in enumerate(bits):
    s = d0 + i * step
    out["5.4"]["words"].append(["zero" if bit == "0" else "one", round(s, 3), round(s + step * 0.85, 3)])

# Speed: one rate per beat, 170 to 200 Roman Urdu words a minute, only 0.95x to 1.1x
beats = {}
for lid, spec in out.items():
    beat = lid.split(".")[0]
    voiced = sum(e - s for s, e in spec["chunks"]) + 0.12 * (len(spec["chunks"]) - 1)
    w, t = beats.get(beat, (0, 0.0))
    beats[beat] = (w + len(spec["words"]), t + voiced)
for beat, (w, t) in sorted(beats.items(), key=lambda kv: int(kv[0])):
    wpm = w / t * 60
    rate = round(min(1.1, 175 / wpm) if wpm < 170 else max(0.95, 200 / wpm) if wpm > 200 else 1.0, 3)
    for lid in out:
        if lid.split(".")[0] == beat:
            out[lid]["rate"] = rate
    print(f"beat {beat}: {w} words in {t:.1f}s = {wpm:.0f} wpm -> rate {rate}")

json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print(f"{len(out)} lines -> {OUT}")
