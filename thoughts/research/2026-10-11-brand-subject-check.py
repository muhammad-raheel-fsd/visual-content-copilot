import itertools, json, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
ROOTS = "concept logic reason idea mind think clar lumin sapi insight cogn noet logo ment clarity wisdom".split()
SUFS = "ometry metry ology istry onomy ics osophy ophy omatics ematics ebra istics onics ography ometrics".split()
def blend(r, s):
    # avoid double vowels at the joint: "idea" + "ology" -> "ideology"
    if r[-1] in "aeiou" and s[0] in "aeiou":
        return r[:-1] + s
    return r + s
names = sorted({blend(r, s) for r, s in itertools.product(ROOTS, SUFS)})
def status(url, ua=False):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"} if ua else {})
    for a in range(3):
        try:
            return urllib.request.urlopen(req, timeout=12).status
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(2 + 3 * a); continue
            return e.code
        except Exception: time.sleep(1)
    return -1
with ThreadPoolExecutor(6) as ex:
    com = dict(zip(names, ex.map(lambda n: status(f"https://rdap.verisign.com/com/v1/domain/{n}.com"), names)))
free = [n for n in names if com[n] == 404]
with ThreadPoolExecutor(4) as ex:
    yt = dict(zip(free, ex.map(lambda n: status(f"https://www.youtube.com/@{n}", True), free)))
both = [n for n in free if yt[n] == 404]
json.dump({"total": len(names), "free_com": free, "both": both, "errors": [n for n in names if com[n] not in (200, 404)]}, open(sys.argv[1], "w"), indent=1)
print(len(names), "names;", len(free), "free .com;", len(both), "free .com + YouTube")
print("BOTH:", " ".join(both))
print("COM ONLY:", " ".join(n for n in free if n not in both))
