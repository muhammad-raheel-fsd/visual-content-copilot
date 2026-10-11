"""
Phase 1 alignment: what Muhammad actually said, line by line (pipeline/production-guide.md, s. 3).

For every transcript line: the speech regions to keep (indexes into the loudness regions of
videos/transcripts/phase-01-vad.json), the Whisper token window, and the Roman Urdu words for
those tokens (a word may span several tokens: "ویٹس اپ" = "WhatsApp"). Mistakes are left out:
  - region 45: the false start "itni tezi se" (line 5.5 keeps the retake, region 46)
  - region 77: the first take of the follow line (line 9.4 keeps the retake's first words,
    region 78: "Follow aur subscribe kar lo"; region 79, "kyunke main ... plan kar raha hoon",
    is dropped on purpose)
Output: videos/transcripts/phase-01-lines.json (input of make_voice_lines.py).
Run from the repo root: python3 pipeline/build/phase-01-alignment.py
"""
import json

# (line id, regions kept, whisper token window [a, b), [(roman word, tokens it covers), ...])
LINES = [
    ("1.1", [0], (1.5, 4.0), "Tumhare phone mein pachaas se zyada apps hain."),
    ("1.2", [1, 2], (4.0, 7.5), "Lekin inhein control kaun karta hai? Tum nahi karte."),
    ("1.3", [3], (7.5, 12.5), "Tum kisi app par tap karte ho, to under the hood asal mein kya hota hai?"),
    ("2.1", [4], (12.5, 13.5), "Chalo ek scene dekho."),
    ("2.2", [5], (13.5, 18.0), "Music chal raha hai, WhatsApp|2 par message aata hai, aur tum YouTube khol lete ho."),
    ("2.3", [6, 7], (18.0, 24.0), "Teen apps, aur teenon ko ek hi waqt mein CPU chahiye, memory chahiye, speaker bhi chahiye."),
    ("2.4", [8, 9], (24.0, 28.0), "To faisla kaun karega|2 ke pehle kaun chalega?|2"),
    ("3.1", [10, 11], (28.5, 32.0), "To jawab hai: Operating System, yaani OS.|2"),
    ("3.2", [12, 13], (32.0, 41.5), "Tumhari book ke mutabiq, Operating System ek system software|2 hai, jo hardware|2 ko manage karta hai, application software|2 ko chalata hai, aur ek user interface deta hai."),
    ("3.3", [14], (41.5, 47.5), "Windows, macOS,|3 Linux, Android aur iOS.|3 Yeh sab Operating Systems hain."),
    ("4.1", [15], (48.0, 51.6), "Book OS|2 ko computer ka traffic controller kehti hai."),
    ("4.2", [16, 17, 18], (51.6, 58.0), "Socho, ek bara chowk hai, har taraf se gaariyan aa rahi hain. Signal na ho, to sab takra jayengi.|2"),
    ("4.3", [19, 20], (58.0, 62.0), "Gaariyan hain tumhari apps, aur signal hai Operating System."),
    ("4.4", [21], (62.0, 64.2), "OS teen faislay karta hai."),
    ("4.5", [22, 23, 24], (64.2, 70.2), "Number ek: kaunsa kaam pehle hoga, yaani CPU kis ko milega?|2"),
    ("4.6", [25, 26], (70.2, 73.0), "Number do: memory kaise istemal hogi?"),
    ("4.7", [27, 28, 29], (73.0, 77.5), "Number teen: kaunsa device, jaise printer ya speaker, kab active hoga?"),
    ("4.8", [30, 31, 32], (77.5, 86.0), "Simple lafzon mein, OS CPU ka waqt itni tezi se baant'ta hai, ke teenon apps ek saath chalne lagti hain."),
    ("5.1", [33, 34], (86.0, 90.0), "OS ka doosra kaam: translator."),
    ("5.2", [35, 36], (90.0, 96.0), "Hum Urdu ya English bolte hain, lekin computer sirf binary samajhta hai: zero aur one."),
    ("5.3", [37, 38, 39], (96.0, 101.7), "To socho: tum keyboard pe A dabate ho, to computer tak kya pohnchta hai?"),
    # The 8 digits are one Whisper token ("0100001"): spread over region 41 below.
    ("5.4", [40, 41], (101.7, 105.6), "To computer tak sirf binary code pohnchta hai:"),
    ("5.5", [42, 43, 44, 46], (109.0, 121.5), "Us ne A ko binary mein badla, aur screen pe A aa gaya.|0 #SKIP|3 Aur yeh sab itni tezi se hota hai ke tumhein pata bhi nahi chalta."),
    ("6.1", [47], (121.5, 126.8), "Aur agar ek computer pe kai log kaam karein? Jaise school ki computer lab."),
    ("6.2", [48, 49], (126.8, 131.0), "OS har student ka alag user account banata hai, apne password ke saath."),
    ("6.3", [50, 51], (131.0, 137.0), "Har ek ki files private rehti hain, aur bina ijazat koi doosre ki cheezein nahi khol sakta."),
    ("7.1", [52, 53, 54], (138.0, 144.5), "Ab wapas apne sawal pe: tum YouTube pe tap karte ho, to kya hota hai?"),
    ("7.2", [55, 56], (144.5, 148.9), "Number ek: OS tap ko hardware ki instructions mein badalta hai."),
    ("7.3", [57, 58], (148.9, 151.7), "Number do: app ko memory mein jagah deta hai."),
    ("7.4", [59, 60], (151.7, 154.9), "Number teen: CPU pe waqt deta hai."),
    ("7.5", [61, 62], (154.9, 159.0), "Number chaar: screen aur speaker ko kaam mein lagata hai."),
    ("7.6", [63, 64], (159.0, 164.0), "Aur video chal parti hai. Ek tap ke peeche OS ka poora architecture.|2"),
    ("8.1", [65, 66, 67, 68, 69, 70], (164.0, 173.0), "Yaad rakho, OS ke kaam: hardware manage karna, apps chalana, user interface dena, aur har user ka data alag rakhna."),
    ("9.1", [71, 72, 73], (173.0, 182.0), "Ab tum batao: do apps ek saath CPU|2 maangein, to faisla kaun karega?|2 Comments mein likho."),
    ("9.2", [74], (182.0, 185.9), "Agle OS video mein, Kernel aur Shell ke baare mein dekhenge.|2"),
    ("9.3", [75, 76], (185.9, 191.0), "Is topic ke MCQs, short questions aur notes website par daal diye hain."),
    # Closing line kept to "Follow aur subscribe kar lo" (Muhammad, 2026-10-10: no "bara plan" line).
    ("9.4", [78], (197.5, 199.6), "Follow aur subscribe kar lo."),
    ("9.5", [80], (203.0, 204.5), "Allah Hafiz."),
]

PAD = 0.08  # seconds kept around each region (the pauses are digital silence)

vad = json.load(open("videos/transcripts/phase-01-vad.json"))["segments"]

# Loudness per 10 ms of the 16 kHz recording, to find where a phrase REALLY ends. The speech
# regions use a -49 dB threshold, which cuts soft endings ("likho", "hoga?" fade out at -45 to
# -60 dB for up to 0.6 s) and makes the cut sound like it eats the last word.
import array
import math
import wave

_w = wave.open(".whisper/phase-01.wav")
_hop = _w.getframerate() // 100
_pcm = array.array("h", _w.readframes(_w.getnframes()))
DB = []
for _i in range(0, len(_pcm) - _hop, _hop):
    _c = _pcm[_i:_i + _hop]
    DB.append(20 * math.log10(math.sqrt(sum(x * x for x in _c) / _hop) / 32768 + 1e-12))

QUIET_DB = -62  # below this the voice has gone
QUIET_FOR = 25  # ... for 250 ms (shorter dips happen inside a word ending)


def natural_end(e, limit):
    """Extend a cut end until the voice stays below QUIET_DB for QUIET_FOR frames."""
    k, last_loud = int(e * 100), int(e * 100)
    stop = int(limit * 100)
    while k < stop and k < len(DB):
        if DB[k] > QUIET_DB:
            last_loud = k
        elif k - last_loud >= QUIET_FOR:
            break
        k += 1
    return min(limit, (last_loud + 1) / 100 + 0.06)


def natural_start(s, limit):
    """Pull a cut start back over a soft first sound (up to 0.2 s)."""
    k = int(s * 100)
    floor = max(int(limit * 100), k - 20)
    while k - 1 > floor and DB[k - 1] > QUIET_DB:
        k -= 1
    return max(limit, k / 100 - 0.03)
whisper = json.load(open("videos/transcripts/phase-01-ur.json"))
tokens, seen = [], set()
for seg in whisper["segments"]:
    for w in seg["words"]:
        key = (round(w["start"], 2), w["word"])
        if key not in seen:
            seen.add(key)
            tokens.append((w["start"], w["end"], w["word"].strip()))
tokens.sort()

out = {}
for lid, regions, (a, b), text in LINES:
    chunks = []
    for r in regions:
        prev_end = vad[r - 1][1] if r > 0 else 0.0
        next_start = vad[r + 1][0] if r + 1 < len(vad) else len(DB) / 100
        start = natural_start(max(0, vad[r][0] - PAD), prev_end + 0.02)
        end = natural_end(vad[r][1] + PAD, next_start - 0.04)
        if chunks and start <= chunks[-1][1] + 0.15:
            chunks[-1][1] = round(end, 3)  # pieces this close play as one (fewer cuts)
        else:
            chunks.append([round(start, 3), round(end, 3)])
    toks = [t for t in tokens if a <= t[0] < b]
    words = []
    for item in text.split():
        word, _, n = item.partition("|")
        words.append((word, int(n or 1)))
    i = 0
    timed = []
    group = []
    for word, n in words:
        # n = 0: the word shares the previous token ("aa gaya" is one token; written word|0)
        group = toks[i:i + n] if n else group
        i += n
        if word == "#SKIP" or not group:
            continue
        timed.append([word, group[0][0], group[-1][1]])
    if i != len(toks):
        print(f"WARN {lid}: {len(toks)} tokens, words cover {i}: {[t[2] for t in toks]}")
    # clamp every word into the kept chunks (Whisper times can sit in a pause)
    def clamp(t):
        inside = [c for c in chunks if c[0] <= t <= c[1]]
        if inside:
            return t
        return min((c[0] if t < c[0] else c[1] for c in chunks), key=lambda x: abs(x - t))
    for w in timed:
        w[1], w[2] = clamp(w[1]), clamp(w[2])
        if w[2] <= w[1]:
            w[2] = round(w[1] + 0.2, 3)
    out[lid] = {"chunks": chunks, "rate": 1.0, "words": [[w, round(s, 3), round(e, 3)] for w, s, e in timed]}

# 5.4: the 8 binary digits, said one by one inside region 41
r = vad[41]
step = (r[1] - r[0]) / 8
for k, bit in enumerate("01000001"):
    s = r[0] + k * step
    out["5.4"]["words"].append(["zero" if bit == "0" else "one", round(s, 3), round(s + step * 0.85, 3)])

json.dump(out, open("videos/transcripts/phase-01-lines.json", "w"), indent=1, ensure_ascii=False)
print(f"{len(out)} lines -> videos/transcripts/phase-01-lines.json")

# Speed (production guide, section 3): one rate per beat. Roman Urdu has many short words
# ("ke", "hai", "ko"), so a natural pace counts 180 to 230 words a minute; aim at 170 to 200,
# and only nudge, never outside 0.95x to 1.1x, so the voice stays natural.
beats = {}
for lid, spec in out.items():
    beat = lid.split(".")[0]
    voiced = sum(e - s for s, e in spec["chunks"])
    gaps = 0.12 * (len(spec["chunks"]) - 1)
    w, t = beats.get(beat, (0, 0.0))
    beats[beat] = (w + len(spec["words"]), t + voiced + gaps)
for beat, (w, t) in sorted(beats.items(), key=lambda kv: int(kv[0])):
    wpm = w / t * 60
    rate = 1.0
    if wpm < 170:
        rate = min(1.1, 175 / wpm)
    elif wpm > 200:
        rate = max(0.95, 200 / wpm)
    rate = round(rate, 3)
    for lid in out:
        if lid.split(".")[0] == beat:
            out[lid]["rate"] = rate
    print(f"beat {beat}: {w} words in {t:.1f}s = {wpm:.0f} wpm -> rate {rate} ({wpm * rate:.0f} wpm)")
json.dump(out, open("videos/transcripts/phase-01-lines.json", "w"), indent=1, ensure_ascii=False)
