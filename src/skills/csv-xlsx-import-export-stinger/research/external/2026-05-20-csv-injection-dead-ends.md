---
source_url: https://deadends.dev/data/csv-formula-injection/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: csv-injection
stinger: csv-xlsx-import-export-stinger
---

# Fix Excel CSV Formula Injection: 2 Dead Ends & 3 Verified Workarounds

## Summary
Practitioner deep-dive into CSV injection mitigation strategies with empirical success rates. Tests which approaches actually survive Excel's save-reopen cycle (which re-activates formulas that were only quoted away).

## Key quotations / statistics
- Tab character prefix approach: ~90% success rate (survives Excel save/reopen)
- Space prefix approach: ~88% success rate
- HTTP headers mitigation (Content-Type: text/csv + Content-Disposition: attachment): ~82% success rate
- "Microsoft Excel removes quotes and escape characters when files are saved and reopened, causing previously escaped formulas to become active again"
- Simple quoting/prepending single quote: does NOT survive Excel save/reopen

## Annotations for stinger-forge
- Provides empirical success rates for `guides/04-csv-injection-prevention.md` - more actionable than OWASP's theoretical guidance
- The 3 layered approaches should all be applied together for defense-in-depth
- The "tab prefix survives save/reopen" finding is the key practical recommendation over the simple single-quote approach
- HTTP header approach alone is insufficient (only 82%) - must be combined with cell-level sanitization
