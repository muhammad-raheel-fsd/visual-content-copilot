"""Bulk premium-name search: generate, then keep names with a free .com AND a free YouTube handle."""
import itertools, json, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

ROOTS_PEDIA = "claro lumino sapio veri cogno noeto logo sophi menti axio lucido aletheo gnosi erudi ingenio clari lumi sapienti cogita intelli rationa ideo"
A = [r + "pedia" for r in ROOTS_PEDIA.split()]
FIRST = "mind master brain think logic concept wise bright clear true deep keen sage lucid".split()
SECOND = "forge crown summit vault compass quest legend lantern beacon atlas harbor haven works house hall guild craft smith academy circle garden path".split()
B = [a + b for a, b in itertools.product(FIRST, SECOND)]
ROOTS_C = "clar lum sapi ver cogn noet log soph ment ax gnos erud ingen lucid alethe sag insig".split()
ENDS = "ora ia ium ara ena ira ova ella ion ica eon iva".split()
C = [r + e for r, e in itertools.product(ROOTS_C, ENDS)]
names = sorted(set(A + B + C))

def status(url, ua=False):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"} if ua else {})
    for attempt in range(3):
        try:
            return urllib.request.urlopen(req, timeout=12).status
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2 + attempt * 3); continue
            return e.code
        except Exception:
            time.sleep(1)
    return -1

def check_com(n):
    return n, status(f"https://rdap.verisign.com/com/v1/domain/{n}.com")

with ThreadPoolExecutor(6) as ex:
    com = dict(ex.map(check_com, names))
free_com = [n for n in names if com[n] == 404]
def check_yt(n):
    return n, status(f"https://www.youtube.com/@{n}", ua=True)
with ThreadPoolExecutor(4) as ex:
    yt = dict(ex.map(check_yt, free_com))
both = [n for n in free_com if yt[n] == 404]
errors = [n for n in names if com[n] not in (200, 404)]
json.dump({"total": len(names), "free_com": free_com, "both": both, "errors": errors}, open(sys.argv[1], "w"), indent=1)
print(f"{len(names)} names, {len(free_com)} free .com, {len(both)} free .com + YouTube, {len(errors)} check errors")
