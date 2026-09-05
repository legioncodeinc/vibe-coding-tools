---
source_url: https://csv.js.org/parse/options/bom/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: encoding
stinger: csv-xlsx-import-export-stinger
---

# CSV Parse - Option: bom | node-csv Documentation

## Summary
Official documentation for the `bom` option in the node-csv csv-parse library. The BOM (Byte Order Mark) is a common encoding gotcha when dealing with CSV files from Excel on Windows.

## Key quotations / statistics
- Default: `bom: false`
- `bom: true`: automatically detects and removes BOM from the beginning of the file
- "It is best practice to always activate this option when working with UTF-8 files"
- Without the `bom` option, BOM bytes appear in output - either in values or corrupting column property names, making the first column inaccessible

## Code example
```javascript
import { parse } from "csv-parse/sync";
const data = "\ufeffa,b,c\n";  // \ufeff is the UTF-8 BOM
const records = parse(data, { bom: true });
// Result: [["a", "b", "c"]] - BOM stripped correctly
```

## Annotations for stinger-forge
- Essential for `guides/05-encoding-edge-cases.md`: always set `bom: true` in csv-parse
- PapaParse also handles BOM (added late 2022) but may need testing with specific edge cases
- Excel on Windows saves CSVs with BOM by default - without this option, the first column key gets a silent `\ufeff` prefix that breaks object property lookups
