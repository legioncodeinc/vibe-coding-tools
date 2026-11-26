# Crew ledger

`ledger.jsonl` in this folder is the Interstellar Coding crew's record of what happened and who decided it. OWEL keeps it. Place this file beside the ledger as `README.md`.

## Rules

- Append only. No entry is ever edited or deleted. A mistake is fixed by a later `correction` entry that names the entry it corrects.
- One writer: OWEL, through `crew-protocol/scripts/ledger.mjs`. Do not open the file in an editor.
- Every entry carries the hash of the one before it. Run `node <crew-protocol>/scripts/ledger.mjs verify --ledger ledger.jsonl` to check the chain; it names the first edited, removed or reordered entry. It prints the head hash. Compare that with the head hash OWEL last recorded outside this folder: a mismatch with fewer entries means the end was cut off or the file was rewritten.
- `role` and `by` are what each submitter stated. The script does not authenticate them.

## Reading it

```bash
node <crew-protocol>/scripts/ledger.mjs tail --ledger ledger.jsonl --n 20
```

Each line is one JSON object: `id`, `at` (when it happened), `recorded_at`, `role`, `type`, `effort`, `text`, `evidence`, `by`, optional `corrects`, `prev`, `hash`.

## What is not in here

Secrets, credentials, customer data and transcript bodies. Entries point at evidence by path, PR or commit.
