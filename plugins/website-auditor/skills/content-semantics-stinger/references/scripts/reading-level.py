#!/usr/bin/env python3
"""Compute a quantified reading-level estimate per crawled page from
site-data/, using the Flesch Reading Ease and Flesch-Kincaid Grade Level
formulas, plus the word count, sentence count, and syllable count inputs
that feed them.

Deterministic, harness-portable, no absolute paths (per build plan section
6's scripting convention). This is a pair-local script: none of the eleven
centrally shared scripts in shared/scripts/README.md cover readability
scoring.

GROUNDING (read before trusting a number this script prints):

  This Stinger's research archive (references/research/distilled-content-
  semantics.md, section 8) states plainly: "No source in this archive
  provides a reading-level formula, grade-level target, or sentence/
  syllable-complexity methodology." Neither the seo-standards cluster nor
  the aeo-and-answer-engines cluster fetched for this pair addresses
  readability formulas at all.

  The Flesch Reading Ease and Flesch-Kincaid Grade Level formulas below are
  therefore NOT sourced from this Stinger's own research archive. They are
  well-established, decades-old public-domain formulas (originally
  published by Rudolf Flesch in 1948 and by Kincaid et al. for the U.S.
  Navy in 1975) implemented here from general technical knowledge, not from
  a downloaded primary source in references/research/raw/. This is an
  explicit judgment call, not a grounded claim: PRD-010 AC-1 requires "a
  quantified reading-level estimate... with the formula and inputs shown,"
  and Flesch-Kincaid is the most widely recognized formula that satisfies
  that requirement, but if a stricter reading of "every factual claim
  traces to references/research/raw/" is required for this specific
  formula choice, a dedicated readability-literature research pass is the
  correct next step, not a fabricated citation. Report the formula and its
  inputs transparently (per AC-1) so a reader can verify the arithmetic
  independently of whether the formula choice itself is archive-sourced.

  Syllable counting uses a standard vowel-group heuristic (count vowel-
  sound groups per word, with common silent-e and common-exception
  adjustments). This heuristic is approximate, not a dictionary lookup;
  it will misjudge syllable counts for some words (irregular pluralizations
  such as "boxes," compound and unusual proper nouns, values borrowed from
  other languages). Treat the per-page scores as directional and
  reproducible, not as precisely authoritative to the decimal point.

Usage:
    python3 reading-level.py --site-data path/to/site-data \\
        [--slug some-page] [--out reading-level.json]

Reads every <slug>.md file under --site-data (Markdown extraction is
preferred over the raw .html because it already strips markup noise that
would otherwise inflate/deflate word and sentence counts). Strips Markdown
link/emphasis syntax and heading markers before counting so the score
reflects prose, not markup characters.
"""

import argparse
import json
import re
import sys
from pathlib import Path

VOWEL_GROUPS = re.compile(r"[aeiouy]+", re.IGNORECASE)
SENTENCE_SPLIT = re.compile(r"[.!?]+(?:\s|$)")
WORD_SPLIT = re.compile(r"[A-Za-z']+")

MARKDOWN_NOISE = [
    (re.compile(r"```.*?```", re.DOTALL), " "),      # fenced code blocks
    (re.compile(r"`[^`]*`"), " "),                    # inline code
    (re.compile(r"!\[[^\]]*\]\([^)]*\)"), " "),       # images
    (re.compile(r"\[([^\]]*)\]\([^)]*\)"), r"\1"),    # links, keep label text
    (re.compile(r"^#{1,6}\s*", re.MULTILINE), ""),    # heading markers
    (re.compile(r"[*_~>#|-]"), " "),                  # remaining markdown punctuation
]


def strip_markdown(text):
    for pattern, repl in MARKDOWN_NOISE:
        text = pattern.sub(repl, text)
    return text


def count_syllables(word):
    word = word.lower()
    if not word:
        return 0
    groups = VOWEL_GROUPS.findall(word)
    count = len(groups)
    if word.endswith("e") and not word.endswith("le") and count > 1:
        count -= 1
    if word.endswith("le") and len(word) > 2 and word[-3] not in "aeiouy":
        count += 1
    return max(count, 1)


def score_text(text):
    prose = strip_markdown(text)
    sentences = [s for s in SENTENCE_SPLIT.split(prose) if s.strip()]
    words = WORD_SPLIT.findall(prose)

    sentence_count = max(len(sentences), 1)
    word_count = len(words)
    syllable_count = sum(count_syllables(w) for w in words)

    if word_count == 0:
        return {
            "word_count": 0,
            "sentence_count": 0,
            "syllable_count": 0,
            "flesch_reading_ease": None,
            "flesch_kincaid_grade": None,
            "note": "no prose extracted after stripping markdown noise",
        }

    words_per_sentence = word_count / sentence_count
    syllables_per_word = syllable_count / word_count

    # Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
    reading_ease = 206.835 - 1.015 * words_per_sentence - 84.6 * syllables_per_word

    # Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
    grade_level = 0.39 * words_per_sentence + 11.8 * syllables_per_word - 15.59

    return {
        "word_count": word_count,
        "sentence_count": sentence_count,
        "syllable_count": syllable_count,
        "words_per_sentence": round(words_per_sentence, 2),
        "syllables_per_word": round(syllables_per_word, 3),
        "flesch_reading_ease": round(reading_ease, 1),
        "flesch_kincaid_grade": round(grade_level, 1),
    }


def main():
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--site-data", required=True)
    parser.add_argument("--slug", default=None,
                         help="score a single slug instead of every page")
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    site_data = Path(args.site_data)
    if args.slug:
        files = [site_data / f"{args.slug}.md"]
    else:
        files = sorted(site_data.glob("*.md"))

    if not files or not any(f.exists() for f in files):
        print(f"error: no .md files found under {args.site_data}", file=sys.stderr)
        return 1

    results = {}
    for f in files:
        if not f.exists():
            print(f"error: {f} does not exist", file=sys.stderr)
            return 1
        text = f.read_text(encoding="utf-8", errors="replace")
        results[f.stem] = score_text(text)

    if results:
        graded = [r["flesch_kincaid_grade"] for r in results.values() if r["flesch_kincaid_grade"] is not None]
        aggregate = {
            "pages_scored": len(results),
            "pages_with_no_prose": sum(1 for r in results.values() if r["flesch_kincaid_grade"] is None),
            "average_flesch_kincaid_grade": round(sum(graded) / len(graded), 1) if graded else None,
        }
    else:
        aggregate = {"pages_scored": 0}

    output = {
        "formula": "Flesch Reading Ease and Flesch-Kincaid Grade Level (public-domain formulas, not sourced from this Stinger's research archive; see script docstring)",
        "aggregate": aggregate,
        "pages": results,
    }

    text_out = json.dumps(output, indent=2)
    if args.out:
        Path(args.out).write_text(text_out, encoding="utf-8")
        print(f"wrote {args.out}")
    else:
        print(text_out)

    return 0


if __name__ == "__main__":
    sys.exit(main())
