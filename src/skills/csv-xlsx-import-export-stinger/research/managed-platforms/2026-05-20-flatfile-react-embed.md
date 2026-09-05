---
source_type: official_docs
authority: high
relevance: H
topic: flatfile-react-embed
url: https://flatfile.com/docs/embedding/react
fetched: 2026-05-20
---

# Flatfile: React Embed, File Size Limits, and Column Mapping

## Summary

Flatfile is an enterprise-grade managed import platform with a React SDK (`@flatfile/react`). The embed pattern uses a `FlatfileProvider` wrapper component and the `useFlatfile()` hook for imperative control (opening/closing the import portal). Unlike a simple dialog component, Flatfile's portal is a full browser-hosted iframe that handles upload, mapping, validation, and confirmation.

Flatfile's documented file size limits (as of 2025-2026 support articles): the platform supports up to 1 million records per sheet as the maximum recommended limit. Pagination is required for API calls that retrieve data from sheets with more than 10,000 records (`sheet.allData()` has a 10,000-record cap per call). For bulk operations, Flatfile recommends processing in chunks of 5,000-10,000 rows. Performance degrades significantly above 1 million records; very large datasets should be split across multiple sheets.

Flatfile's schema definition uses `fields` arrays with `{ label: string, key: string, type: string, validators: [...] }` objects. The `type` field drives automatic validation and column mapping hints. Flatfile's column mapping UI presents uploaded column headers alongside schema field labels, with AI-assisted matching enabled by default. Developers cannot disable AI matching without enterprise configuration.

A notable Flatfile limitation for browser-only deployments: files larger than ~50 MB benefit from server-side upload offload (Flatfile's own ingestion servers), not direct browser-to-platform upload. The exact browser-only file size ceiling before degraded UX is not documented; the Command Brief's open question about this remains partially unresolved - the answer appears to be "Flatfile handles the upload server-side automatically; the browser limit is a network/timeout concern, not a Flatfile hard limit."

Flatfile supports hooks (`listener.on("job:ready")`, `listener.on("record:created")`) for server-side transformation and validation at record ingestion time. This webhook-based architecture differs from OneSchema's synchronous SDK callback.

## Key quotations / statistics

- "Supports up to 1 million records per sheet as the maximum recommended limit." (support.flatfile.com)
- "When extracting data from sheets with more than 10,000 records, you must use pagination." (support.flatfile.com)
- "For optimal performance with bulk operations, process records in chunks of 5,000-10,000 rows." (support.flatfile.com)

## React embed snippet

```jsx
import { FlatfileProvider, useFlatfile, Sheet, Workbook } from "@flatfile/react";

function ImportButton() {
  const { openPortal } = useFlatfile();
  return <button onClick={openPortal}>Import Data</button>;
}

export function App() {
  return (
    <FlatfileProvider publishableKey={process.env.FLATFILE_KEY}>
      <Workbook
        onSubmit={(sheet) => console.log(sheet)}
        onCancel={() => console.log("cancelled")}
      >
        <Sheet
          name="Contacts"
          fields={[
            { label: "Name", key: "name", type: "string", validators: [{ validate: "required" }] },
            { label: "Email", key: "email", type: "string", validators: [{ validate: "required" }] },
          ]}
        />
      </Workbook>
      <ImportButton />
    </FlatfileProvider>
  );
}
```

## Key takeaways for stinger-forge

- Document the 10,000-record pagination limit for `sheet.allData()` in `examples/flatfile-embed.md`; this is a common gotcha for large imports.
- Flatfile's architecture is webhook/event-driven (server-side listeners); document this distinction vs OneSchema's synchronous callback model in `guides/00-library-selection.md`.
- The `formulaMode` critical directive from the Command Brief applies to Flatfile's `fields` type configuration - document how to keep formula fields disabled.
- For the comparison guide: Flatfile is the enterprise choice (SOC2 Type II, HIPAA, event-driven hooks); OneSchema is the startup-friendly choice (simpler pricing, synchronous SDK).
- Warn that Flatfile's 1-million-row limit is "recommended", not hard; actual limits depend on plan tier and server-side processing configuration.
