"""
Phase 1 v2 alignment: what Muhammad actually said, line by line (production guide, section 3).
Recording: videos/recordings/phase-01-v2.mp4 (5:59 raw, 2026-10-10).

Each line: the source windows to KEEP (speech regions overlapping them are kept), the Whisper
token window, and the Roman Urdu words for those tokens ("word|n" covers n tokens, "word|0"
shares the previous token, "#SKIP|n" drops n tokens). Cut on purpose (not in any keep window):
  - 1.08 to 3.12   "mike check"
  - 45.6 to 48.3   false start of 2.4 ("To bara sawal yeh hai, kaun decide karega")
  - 69.6 to 73.2   false start of 3.2 ("Operating System ek software hai")
  - 114.4 to 116.7 first take of 4.3
  - 125.3 to 131.3 first take of 4.5 (said "request karega"; the retake says "process karega")
  - 166.0 to 172.5 two false starts of 5.1
  - 186.7 to 192.4 first take of 5.3
  - 286.2 to 289.9 first ending of 7.6 ("...OS ka poora architecture"); the retake says
                   "...OS apni poori jaan laga deta hai"
  - 107.5 to 110.2 first take of "Agar wahan traffic signal na ho" in 4.2
  - 154.5 to 158.3 first take of 4.9 ("Isi liye tum song sunte hue WhatsApp bhi chala...")
The last two were missed at first: Whisper merged each take pair into ONE sentence (one word
stretched over the repeat), so the full transcript showed no repeat. They were found by
pipeline/build/chunk_transcribe.py, which transcribes every kept chunk on its own
(videos/transcripts/phase-01-v2-chunks-ur.json). RETOKEN lines take their word timings from
that file, because the full transcript's timings point at the dropped first take.
Output: videos/transcripts/phase-01-v2-lines.json (input of render_voice_lines.py).
Run from the repo root: python3 pipeline/build/phase-01-v2-alignment.py
"""
import array
import json
import math
import wave

# (id, keep windows, token window, text)
LINES = [
    ("1.1", [(8.0, 10.9)], (8.0, 10.9), "Tumhare phone mein shayad pachaas se zyada apps hain."),
    ("1.2", [(10.9, 15.9)], (10.9, 15.9), "Lekin kabhi socha hai in sab ko control kaun karta hai? Aur mera matlab tum se nahi tha."),
    ("1.3", [(16.0, 23.6)], (16.0, 23.6), "Tum kisi app pe tap karte ho, aur boom, woh foran khul jaati hai. Lekin us ek tap ke peeche, under the hood, actually kya hota hai?"),
    ("1.4", [(24.0, 27.5)], (24.0, 27.5), "Aaj hum yahi|2 samjhenge,|2 step by step, bilkul simple words mein."),
    ("2.1", [(27.6, 29.5)], (27.6, 29.5), "Chalo, ek scene imagine karo."),
    ("2.2", [(29.8, 37.0)], (29.8, 37.0), "Tumhare phone pe music chal raha hai, usi time pe WhatsApp pe message aata hai, aur usi lamhe tum YouTube|2 bhi khol lete ho."),
    ("2.3", [(37.2, 43.5)], (37.2, 43.5), "Ab teeno apps ek hi time pe CPU|2 se processing ki request karti hain, aur teeno ko memory aur speaker bhi chahiye."),
    ("2.4", [(50.0, 58.2)], (50.0, 58.2), "To sawal yeh hai: kaun decide karega|2 ke pehle kaun chalega,|2 kis ko kitni memory milegi,|2 aur speakers pe kis ki awaaz aayegi?|2"),
    ("3.1", [(62.9, 66.0)], (62.9, 66.0), "Is question ka simple answer hai: Operating System, yaani OS."),
    ("3.2", [(66.0, 69.3), (74.3, 82.5)], (66.0, 82.5), "Tumhari book Operating System ki definition yeh deti hai: #SKIP|5 Operating System ek system software hai, jo hardware ko manage karta hai, application software ko chalata hai, aur ek user interface deta hai."),
    ("3.3", [(82.5, 95.2)], (82.5, 95.2), "Windows, macOS,|2 Linux, Android aur iOS.|2 Yeh sab Operating Systems hain. Tumhare phone mein Android ya iOS|2 exactly yahi kaam kar raha hai."),
    ("4.1", [(96.7, 103.0)], (96.7, 103.0), "Tumhari book OS|2 ko computer ka traffic controller kehti hai, aur honestly, yeh example bilkul perfect hai."),
    ("4.2", [(103.2, 107.5), (110.2, 114.2)], (103.2, 114.2), "Imagine karo, ek busy crossroad|2 jahan har taraf se cars aa rahi hain. Agar wahan traffic signal na ho, to saari cars aapas mein crash ho jayengi.|2"),
    ("4.3", [(118.0, 121.9)], (118.0, 121.9), "Tumhare phone mein yeh cars hain tumhari apps, aur traffic signal hai Operating System."),
    ("4.4", [(122.7, 125.2)], (122.7, 125.2), "Aur yeh signal teen important decisions leta hai."),
    ("4.5", [(132.5, 138.4)], (132.5, 138.4), "Number ek:|0 kaunsa|2 kaam pehle hoga, yaani CPU sab se pehle kis app ko process karega.|2"),
    ("4.6", [(138.6, 141.8)], (138.6, 141.8), "Number do:|0 computer ki memory kis app ko kitni milegi?|2"),
    ("4.7", [(141.9, 146.0)], (141.9, 146.0), "Number teen:|0 kaunsa|2 device, jaise printer ya speaker, kis time kaam karega?|2"),
    ("4.8", [(146.8, 154.0)], (146.8, 154.0), "Simple lafzon mein, OS CPU ka time apps mein itni fast share karta hai, ke tumhein lagta hai teeno apps ek saath chal rahi hain."),
    ("4.9", [(158.3, 166.0)], (154.5, 166.0), "Isi liye tum song sunte hue WhatsApp bhi chala sakte ho, aur tumhara phone hang nahi hota. Smooth, right?"),
    ("5.1", [(174.6, 180.6)], (174.6, 180.6), "Ab OS|2 ka doosra bara kaam, aur yeh kaafi interesting hai: OS|2 ek translator ki tarah kaam karta hai."),
    ("5.2", [(180.7, 186.2)], (180.7, 186.2), "Hum Urdu ya English bolte hain, lekin computer sirf binary samajhta hai, yaani zero ya one."),
    ("5.3", [(195.1, 200.2)], (195.1, 200.2), "To socho, jab tum keyboard|2 par A type karte ho, to computer tak kya pohnchta hai?"),
    # the 8 digits come out of Whisper as 7 tokens: they are spread over their speech below
    ("5.4", [(200.5, 206.6)], (200.5, 203.2), "Computer tak pohnchta hai yeh binary code:"),
    ("5.5", [(206.6, 216.2)], (206.6, 216.2), "OS ne tumhare A ko binary mein convert kiya, aur phir screen pe A display kar diya. Aur yeh sab behind the scenes itna fast hota hai, ke tumhein pata bhi nahi chalta."),
    ("6.1", [(230.7, 237.0)], (230.7, 237.0), "Ab ek aur situation imagine karo: tumhare school ke computer lab, jahan ek hi computer pe kai students kaam karte hain."),
    ("6.2", [(237.2, 243.9)], (237.2, 243.9), "Yahan OS har student ka alag user account banata hai, saare different username|2 aur passwords ke saath."),
    ("6.3", [(244.7, 250.2)], (244.7, 250.2), "Har student ki files private rehti hain, aur koi bhi doosre ki files bina permissions ke access nahi kar sakta."),
    ("6.4", [(250.9, 254.3)], (250.9, 254.3), "Aur OS computer ke resources sab mein equally share karta hai."),
    ("7.1", [(256.0, 262.2)], (256.0, 262.2), "Chalo, ab wapas apne pehle question par aate hain: jab tum YouTube pe tap karte ho, to under the hood kya hota hai?"),
    ("7.2", [(262.4, 266.9)], (262.4, 266.9), "Number ek: OS tumhari app ko hardware ki instructions mein convert karta hai."),
    ("7.3", [(267.1, 271.2)], (267.1, 271.2), "Number two: OS YouTube ko memory mein jagah deta hai."),
    ("7.4", [(271.4, 276.4)], (271.4, 276.4), "Number teen: OS app ko CPU time deta hai, taake CPU us ko process kar sake."),
    ("7.5", [(276.5, 280.9)], (276.5, 280.9), "Number chaar: OS screen aur speakers ko kaam pe lagata hai."),
    ("7.6", [(283.1, 285.9), (291.9, 296.5)], (283.0, 297.0), "Aur yeh hai ke video chal parti hai. #SKIP|13 Yaani tumhare ek chhote se tap ke peeche OS apni poori jaan laga deta hai."),
    ("8.1", [(298.6, 305.5)], (298.6, 305.5), "Ab ek common mistake, jo bohat se students karte hain: woh samajhte hain ke Windows ya Android bhi bas ek app hai."),
    ("8.2", [(306.2, 314.8)], (306.2, 314.8), "Lekin yaad rakhna: WhatsApp aur YouTube application softwares hain, aur Operating System ek system software hai, jis ke upar yeh saari apps chalti hain."),
    ("9.1", [(315.6, 325.6)], (315.6, 325.6), "To OS ke yeh chaar kaam hamesha yaad rakhna: yeh hardware ko manage karta hai, saari apps chalata hai, user interface deta hai, aur har user ka data alag rakhta hai."),
    ("10.1", [(327.2, 336.6)], (327.2, 336.6), "To tum comments mein batao: agar chaar apps ek hi time par CPU ko processing ki request bhejein, to kaun decide karega|2 ke CPU pehle kis app ko process karega?|2"),
    ("10.2", [(337.3, 345.6)], (337.3, 345.6), "Is topic ke MCQs, short questions aur notes maine|2 website par daal diye hain. Abhi jao aur check karo ke tum kitne sahi kar paate ho."),
    ("10.3", [(346.2, 351.2)], (346.2, 351.2), "OS ki agli video mein hum dekhenge|2 Kernel aur Shell ke darmiyan kya difference hota hai."),
    ("10.4", [(351.5, 355.3)], (351.5, 355.3), "Follow aur subscribe kar|1 lo,|0 taake agli video miss|1 na|0 ho jaye."),
    ("10.5", [(355.5, 356.5)], (355.5, 356.5), "Allah Hafiz."),
]

# Cut inside a kept line (fillers and noises found by checking every wordless speech region):
#   3.3: a click (84.7 s) and an "uhh" (86.6 to 87.6 s) between "macOS" and "Linux".
CUTS = [(84.5, 87.62)]

# Lines whose tokens come from the per-chunk transcript (see the header).
RETOKEN = {"4.2", "4.9"}
CHUNK_TX = "videos/transcripts/phase-01-v2-chunks-ur.json"

VAD = "videos/transcripts/phase-01-v2-vad.json"
WHISPER = "videos/transcripts/phase-01-v2-ur.json"
WAV16 = ".whisper/phase-01-v2.wav"
OUT = "videos/transcripts/phase-01-v2-lines.json"
PAD = 0.08
QUIET_DB, QUIET_FOR = -62, 25

vad = json.load(open(VAD))["segments"]
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


tokens, seen = [], set()
for seg in json.load(open(WHISPER))["segments"]:
    for w in seg["words"]:
        key = (round(w["start"], 2), w["word"])
        if key not in seen:
            seen.add(key)
            tokens.append((w["start"], w["end"], w["word"].strip()))
tokens.sort()

out = {}
for lid, keeps, (a, b), text in LINES:
    regions = sorted({i for i, (s, e) in enumerate(vad) for ks, ke in keeps if min(e, ke) - max(s, ks) > 0.05})
    chunks = []
    for r in regions:
        prev_end = vad[r - 1][1] if r > 0 else 0.0
        next_start = vad[r + 1][0] if r + 1 < len(vad) else len(DB) / 100
        lo = min(ks for ks, _ in keeps)
        start = natural_start(max(0, vad[r][0] - PAD, lo - 0.3), prev_end + 0.02)
        end = natural_end(vad[r][1] + PAD, next_start - 0.04)
        if chunks and start <= chunks[-1][1] + 0.15:
            chunks[-1][1] = round(end, 3)
        else:
            chunks.append([round(start, 3), round(end, 3)])
    for cs, ce in CUTS:
        cut = []
        for s0, e0 in chunks:
            if ce <= s0 or cs >= e0:
                cut.append([s0, e0])
                continue
            if s0 < cs:
                cut.append([s0, round(cs, 3)])
            if e0 > ce:
                cut.append([round(ce, 3), e0])
        chunks = cut
    toks = [t for t in tokens if a <= t[0] < b]
    if lid in RETOKEN:
        toks = []
        for c in json.load(open(CHUNK_TX)):
            if c["line"] == lid and any(min(c["chunk"][1], e0) - max(c["chunk"][0], s0) > 0 for s0, e0 in chunks):
                starts = [max(c["chunk"][0], t) for t, _ in c["words"]]
                ends = starts[1:] + [c["chunk"][1]]
                toks += [(t0, t1, w) for t0, t1, (_, w) in zip(starts, ends, c["words"])]
    words, i, group = [], 0, []
    for item in text.split():
        word, _, n = item.partition("|")
        n = int(n) if n else 1
        group = toks[i:i + n] if n else group
        i += n
        if word == "#SKIP" or not group:
            continue
        words.append([word, group[0][0], group[-1][1]])
    if i != len(toks):
        print(f"WARN {lid}: {len(toks)} tokens, words cover {i}: {[t[2] for t in toks]}")

    def clamp(t):
        if any(c[0] <= t <= c[1] for c in chunks):
            return t
        return min((c[0] if t < c[0] else c[1] for c in chunks), key=lambda x: abs(x - t))

    for w in words:
        w[1], w[2] = clamp(w[1]), clamp(w[2])
        if w[2] <= w[1]:
            w[2] = round(w[1] + 0.2, 3)
    out[lid] = {"chunks": chunks, "rate": 1.0, "words": [[w, round(s, 3), round(e, 3)] for w, s, e in words]}

# 5.4: the 8 digits, spread over the speech after "binary code"
digit_regions = [(s, e) for s, e in vad if e > 203.1 and s < 206.6]
d0, d1 = max(203.1, digit_regions[0][0]), digit_regions[-1][1]
step = (d1 - d0) / 8
for k, bit in enumerate("01000001"):
    s = d0 + k * step
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
