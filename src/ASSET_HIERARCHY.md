# Honeybee asset hierarchy

Every active installable asset is traceable through this hierarchy. The individual row-level map is generated in `reports/asset-hierarchy.csv`; it describes filesystem pairing only and does not claim beekeeper-suit registration.

```text
beekeeper command
  -> beekeeper-suit
     -> hive namespace
        -> worker-bee agent
           -> paired stinger skill
              -> optional MCP placement instructions

smoke-it command
  -> beekeeper-suit
     -> the same hive and worker-bee routing model for PRD completion
```

The three orchestrator-level exceptions do not require a worker-bee: `queen-bee-stinger`, `get-started-stinger`, and `beekeeper-suit`.

`library-*`, `knowledge-*`, and `security-*` remain complete active pairs in the core namespace. Quarantined assets have no route through `beekeeper` until they are intentionally paired and promoted.
