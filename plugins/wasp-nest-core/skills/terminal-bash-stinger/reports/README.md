# Reports

This folder collects past-run audit summaries produced by `terminal-bash-wasp-drone`.

Each run may optionally append a dated report file here:

```
reports/
└── YYYY-MM-DD-{scope}-{developer-or-project}.md
```

The format follows `templates/findings-report.md`.

Reports accumulate over time as an audit trail. They are not auto-generated; the Drone writes one only when the user asks for a persisted record.
