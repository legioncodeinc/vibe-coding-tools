"""
Facebook group intelligence extractor.

Connects to Oxylabs Headless Browser with the John persona, walks a group list
in descending member order, and writes one JSON object per group to JSONL.

Usage:
    export OXY_UNBLOCKER_USERNAME=... OXY_UNBLOCKER_PASSWORD=...
    python fb_group_extract.py groups_input.json groups_out.jsonl

groups_input.json: [{"group_id": "...", "group_name": "...", "member_count": N}, ...]
"""
import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone

from playwright.sync_api import sync_playwright

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PAUSE = (3.0, 6.0)
BREAK_EVERY = 25
BREAK = (45, 90)


def build_url():
    user = os.environ["OXY_UNBLOCKER_USERNAME"]
    pw = os.environ["OXY_UNBLOCKER_PASSWORD"]
    return (
        f"wss://{user}:{pw}@ubc.oxylabs.io"
        "?p_cc=US&p_state=ohio&solve_captcha=true"
        "&o_profile=john&proxy_resi_ses_id=johnohio1&proxy_resi_ses_time=1440"
    )


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def parse_date(text):
    """Best-effort parse of Facebook date strings like 'March 4, 2019'."""
    for fmt in ("%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.strptime(text.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None


def extract_about(page):
    return page.evaluate(
        """() => {
            const t = document.body.innerText || '';
            const grab = (re) => { const m = t.match(re); return m ? m[1].trim() : null; };
            const history = [];
            for (const m of t.matchAll(/Group created on ([A-Za-z]+ \\d{1,2}, \\d{4})/g))
                history.push({event: 'created', date_text: m[1]});
            for (const m of t.matchAll(/Name last changed on ([A-Za-z]+ \\d{1,2}, \\d{4})/g))
                history.push({event: 'name_changed', date_text: m[1]});
            return {
                description: grab(/About this group\\s*\\n([\\s\\S]{10,800})/),
                privacy: /\\bPrivate\\b/.test(t) ? 'private' : (/\\bPublic\\b/.test(t) ? 'public' : null),
                activity_raw: (t.match(/[\\d,]+ posts? in the last month/g) || []),
                history,
            };
        }"""
    )


def extract_admins(page):
    return page.evaluate(
        """() => {
            const out = [];
            const anchors = document.querySelectorAll('a[href*="profile.php?id="], a[href*="/pages/"]');
            for (const a of anchors) {
                const name = (a.innerText || '').trim().split('\\n')[0];
                if (!name) continue;
                const href = a.href;
                const idm = href.match(/profile\\.php\\?id=(\\d+)/);
                const img = a.querySelector('img');
                out.push({
                    name: name.slice(0, 120),
                    type: href.includes('/pages/') ? 'page' : 'user',
                    profile_id: idm ? idm[1] : null,
                    profile_url: href.split('?')[0] + (idm ? '?id=' + idm[1] : ''),
                    profile_pic_url: img ? img.src : null,
                });
            }
            return out;
        }"""
    )


def main():
    inp, out_path = sys.argv[1], sys.argv[2]
    with open(inp, encoding="utf-8") as f:
        groups = json.load(f)
    groups.sort(key=lambda g: -(g.get("member_count") or 0))

    done = set()
    if os.path.exists(out_path):
        with open(out_path, encoding="utf-8") as f:
            for line in f:
                try:
                    done.add(json.loads(line)["group_id"])
                except Exception:
                    pass
    print(f"{len(groups)} groups queued, {len(done)} already done", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(build_url(), timeout=60_000)
        try:
            ctx = browser.contexts[0] if browser.contexts else browser.new_context()
            page = ctx.pages[0] if ctx.pages else ctx.new_page()

            # session validation
            page.goto("https://www.facebook.com/", wait_until="domcontentloaded", timeout=45000)
            time.sleep(5)
            if "Log into Facebook" in (page.inner_text("body") or ""):
                print("NOT LOGGED IN - aborting", flush=True)
                return

            out = open(out_path, "a", encoding="utf-8")
            n = 0
            for g in groups:
                gid = g["group_id"]
                if gid in done:
                    continue
                rec = {
                    "group_id": gid,
                    "group_name": g.get("group_name"),
                    "group_url": f"https://www.facebook.com/groups/{gid}",
                    "member_count": g.get("member_count"),
                    "scraped_at": now_iso(),
                    "errors": [],
                }
                try:
                    page.goto(rec["group_url"] + "/about",
                              wait_until="domcontentloaded", timeout=45000)
                    time.sleep(random.uniform(*PAUSE))
                    about = extract_about(page)
                    rec.update({
                        "description": about["description"],
                        "privacy": about["privacy"],
                        "activity": {
                            "raw": about["activity_raw"],
                            "posts_last_month": (
                                int(about["activity_raw"][0].split()[0].replace(",", ""))
                                if about["activity_raw"] else None
                            ),
                        },
                        "history": [
                            {**h, "date_iso": parse_date(h["date_text"])}
                            for h in about["history"]
                        ],
                    })
                    page.goto(rec["group_url"] + "/members",
                              wait_until="domcontentloaded", timeout=45000)
                    time.sleep(random.uniform(*PAUSE))
                    rec["admins"] = extract_admins(page)
                except Exception as e:
                    rec["errors"].append(str(e)[:200])
                out.write(json.dumps(rec, ensure_ascii=False) + "\n")
                out.flush()
                n += 1
                print(f"[{n}] {gid} {str(g.get('group_name'))[:40]} ok={not rec['errors']}", flush=True)
                if n % BREAK_EVERY == 0:
                    time.sleep(random.uniform(*BREAK))
            out.close()
        finally:
            browser.close()


if __name__ == "__main__":
    main()
