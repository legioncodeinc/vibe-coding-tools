# Facebook Data Processing Guide

What to do once the user uploads their Facebook export .zip. This is the exact pipeline
used to build the original mario-aldayuz-voice skill from a 1,703-post export.

## 1. Unpack

Unzip into a working directory (NOT the final skill folder yet - keep raw data out of the
deliverable until it's sanitized):

```bash
mkdir -p /tmp/fb && cd /tmp/fb && unzip -o -q "<uploaded zip path>"
```

The files that matter (JSON export):

| File | Contents |
|---|---|
| `your_facebook_activity/posts/your_posts__check_ins__photos_and_videos_1.json` | The user's own timeline posts - the core corpus |
| `your_facebook_activity/posts/posts_on_other_pages_and_profiles.json` | Posts/comments on other people's walls (often birthday wishes) |
| `your_facebook_activity/messages/` | DM threads if Messages was selected |
| `your_facebook_activity/personal_information/` | Profile info if selected - biography guardrails |

## 2. Strip media

Remove all images, videos, and other media immediately. Only raw JSON survives:

```bash
find /tmp/fb -type f ! -name '*.json' -delete
find /tmp/fb -type d -empty -delete
```

## 3. Fix the encoding

Facebook exports mojibake: UTF-8 bytes stored as latin-1. Every string must be repaired
or emoji and punctuation turn to garbage:

```python
def fix(s):
    try:
        return s.encode('latin-1').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s
```

## 4. Extract the user's own text

For timeline posts, each item's `data` array holds `{"post": "..."}` entries:

```python
import json
data = json.load(open('your_facebook_activity/posts/your_posts__check_ins__photos_and_videos_1.json'))
posts = []
for it in data:
    for d in it.get('data', []):
        if 'post' in d:
            b = fix(d['post']).strip()
            if b:
                posts.append((it.get('timestamp', 0), b))
```

For `posts_on_other_pages_and_profiles.json`, text lives in `label_values` under the
`"Message"` label.

## 5. Sanitize - CRITICAL

Ask the user (AskUserQuestion) for their exact Facebook display name first. Then remove
everything not written by them:

- In Messages threads, keep ONLY messages where `sender_name` matches the user. Drop
  everyone else's messages entirely - they must never leak into the corpus or the skill.
- Shared posts often embed the ORIGINAL author's text. If a post is a share, keep only
  the user's added commentary.
- Drop quoted/forwarded content and anything an AI or bot posted on their behalf.
- When attribution is uncertain, DROP it. A polluted corpus produces someone else's voice.

## 6. Analyze

Two passes, both required:

**Quantitative stylometrics** (script it - counts beat impressions):
- Em/en dash usage vs spaced hyphen vs ellipsis (both `...` and unicode `…`)
- Exclamation marks per post (many people are far calmer than assumed)
- Emoji: which ones, how often, position, skin-tone modifiers, share of posts with zero
- Hashtags: which ones, how many per post
- ALL CAPS words, top openers (first 2 words), signature phrases, profanity by register
- Post length distribution: long form (800+), mid (300-800), short (under 300)

**Qualitative register reading** (read at least 15-20 long posts and 30-40 short ones):
- Identify their registers (hype, storyteller, vulnerable, savage, teacher, technical,
  casual) and how each one actually sounds
- Structural moves: list formats, CTA patterns, story arcs, sign-offs
- Real biography facts for the guardrails section (and what must NEVER be claimed -
  verify service history, credentials, and life events with the user before encoding)
- Typos they leave in - preserve examples verbatim, they are part of the fingerprint

## 7. Draft samples and get approval

Generate sample posts in their voice and present them for approval:

- Long form (500+ words) across their registers
- Short form (under 3 sentences)
- Quick statements (8 words or less)

Use AskUserQuestion to approve or tune each batch. Iterate until the user says they
match. THE USER IS THE JUDGE - never ship samples they haven't approved.

## 8. Commit to the skill

Approved material goes into the skill's `references/` folder:

- `references/corpus.md` - REAL posts, verbatim, grouped by register (ground truth)
- `references/samples/long-form.md` - approved generated long-form pieces
- `references/samples/short-form.md` - approved generated short-form pieces
- `references/samples/quick-statements.md` - approved 8-words-or-less one-liners
- `references/fingerprint.md` - the linguistic analysis
- `references/anti-ai-rules.md` - the NEVER/ALWAYS detection ruleset

Then build the final SKILL.md per `voice-skill-template.md` and save the skill to Claude
Cowork. Delete the raw export data from the working directory when done - it contains
private information and does not belong in the shipped skill.
