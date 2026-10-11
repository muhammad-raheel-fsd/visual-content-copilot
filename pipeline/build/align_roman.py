"""
Roman Urdu <-> Whisper (Urdu script) word aligner, so an alignment script does not have to
count tokens by hand. Both sides are reduced to a consonant skeleton ("tumhare" -> "tmr",
"تمہارے" -> "tmr"), then a dynamic-programming alignment matches the script's words to the
transcript's tokens in order. A matched word takes its token's time; an unmatched word is placed
between its matched neighbours. Latin tokens (English words Whisper kept in Latin, or an English
clip transcribed separately) go through the same skeleton.

Used by pipeline/build/phase-NN-alignment.py: align(words, tokens) -> [(word, t0, t1)].
"""
import re

URDU = {
    "ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "s", "ج": "j", "چ": "c", "ح": "h", "خ": "k",
    "د": "d", "ڈ": "d", "ذ": "z", "ر": "r", "ڑ": "r", "ز": "z", "ژ": "z", "س": "s", "ش": "s",
    "ص": "s", "ض": "z", "ط": "t", "ظ": "z", "غ": "g", "ف": "f", "ق": "k", "ک": "k", "گ": "g",
    "ل": "l", "م": "m", "ن": "n", "ں": "n", "ہ": "h", "ھ": "h", "ۃ": "h", "و": "v", "ی": "y",
    "ے": "y", "ئ": "y", "ۓ": "y", "ي": "y", "ك": "k", "ه": "h",
}
DIGRAPHS = [("sh", "s"), ("ch", "c"), ("kh", "k"), ("gh", "g"), ("ph", "f"), ("th", "t"), ("dh", "d"),
            ("bh", "b"), ("jh", "j"), ("rh", "r"), ("ck", "k"), ("q", "k"), ("x", "ks"), ("w", "v"), ("c", "k")]
NUMBERS = {"0": "zero", "1": "one", "50": "pachaas"}


def skeleton(word: str) -> str:
    w = word.strip().lower()
    w = NUMBERS.get(re.sub(r"[^0-9]", "", w), w) if re.fullmatch(r"[0-9.,]+", w) else w
    if re.search(r"[؀-ۿ]", w):
        out = "".join(URDU.get(ch, "") for ch in w)
    else:
        w = re.sub(r"[^a-z]", "", w)
        for a, b in DIGRAPHS:
            w = w.replace(a, b)
        out = re.sub(r"[aeiou]", "", w)
    # y, v and h are vowels or silent as often as consonants on both sides: keep them only first
    return out[:1] + re.sub(r"[yvh]", "", out[1:]) if out else ""


def _dist(a: str, b: str) -> float:
    if not a and not b:
        return 0.3
    if not a or not b:
        return 0.8
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1] / max(len(a), len(b))


def align(words: list[str], tokens: list[tuple[float, float, str]], gap: float = 0.75) -> list[tuple[str, float, float]]:
    """words in script order, tokens (t0, t1, text) in time order -> [(word, t0, t1)]."""
    ws = [skeleton(w) for w in words]
    ts = [skeleton(t[2]) for t in tokens]
    n, m = len(ws), len(ts)
    INF = float("inf")
    cost = [[INF] * (m + 1) for _ in range(n + 1)]
    back = [[None] * (m + 1) for _ in range(n + 1)]
    cost[0] = [j * gap * 0.5 for j in range(m + 1)]  # tokens before the first word are cheap to skip
    for i in range(1, n + 1):
        cost[i][0] = i * gap
        back[i][0] = "w"
        for j in range(1, m + 1):
            options = [
                (cost[i - 1][j - 1] + _dist(ws[i - 1], ts[j - 1]), "m"),
                (cost[i - 1][j] + gap, "w"),  # script word with no token (merged or dropped)
                (cost[i][j - 1] + gap, "t"),  # token with no script word (filler, repeat)
            ]
            cost[i][j], back[i][j] = min(options)
    match: dict[int, int] = {}
    i, j = n, m
    while i > 0:
        step = back[i][j]
        if step == "m":
            if _dist(ws[i - 1], ts[j - 1]) < 0.75:
                match[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif step == "w":
            i -= 1
        else:
            j -= 1
    out: list[tuple[str, float, float]] = []
    for k, w in enumerate(words):
        if k in match:
            t = tokens[match[k]]
            out.append((w, t[0], t[1]))
            continue
        before = max((x for x in match if x < k), default=None)
        after = min((x for x in match if x > k), default=None)
        t0 = tokens[match[before]][1] if before is not None else (tokens[0][0] if tokens else 0.0)
        t1 = tokens[match[after]][0] if after is not None else (tokens[-1][1] if tokens else t0 + 0.3)
        lo = before if before is not None else -1
        hi = after if after is not None else len(words)
        share = max(0.05, t1 - t0) / max(1, hi - lo - 1)
        start = t0 + (k - lo - 1) * share + share * 0.05
        out.append((w, round(start, 3), round(start + share * 0.9, 3)))
    return out
