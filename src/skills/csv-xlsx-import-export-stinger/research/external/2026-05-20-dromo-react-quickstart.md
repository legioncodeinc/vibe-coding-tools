---
source_url: https://developer.dromo.io/getting-started/react
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: medium
topic: managed-importers
stinger: csv-xlsx-import-export-stinger
---

# Dromo React Quickstart - Official Documentation

## Summary
Official Dromo documentation for React integration. Shows the `DromoUploader` component props, license key setup, field schema definition, and `onResults` callback. Dromo's framework-agnostic approach and private mode are key selling points.

## Key quotations / statistics
- Install: `npm install dromo-uploader-react`
- Component: `<DromoUploader licenseKey="..." fields={...} settings={...} onResults={handleResults}`
- `onResults` callback receives cleaned/validated data array
- Private Mode: data never leaves the browser (available on Professional plan)
- Schema Studio: no-code schema configuration for non-technical team members

## Key code pattern
```jsx
import DromoUploader from 'dromo-uploader-react';

<DromoUploader
  licenseKey="YOUR_KEY"
  fields={[
    { label: "Full Name", key: "name" },
    { label: "Email", key: "email", validators: [{ validate: "email" }] }
  ]}
  settings={{ importIdentifier: "Contacts" }}
  onResults={(data, metadata) => {
    console.log(data); // array of validated row objects
  }}
>
  Import Contacts
</DromoUploader>
```

## Annotations for stinger-forge
- The field schema pattern (label + key + validators) is a useful reference for the hand-rolled wizard's data model in `guides/02-column-mapping-ux.md`
- Private Mode on Professional ($499/month) is too expensive for most early-stage products - document the trade-off
- Dromo's Schema Studio (non-technical configuration) is a differentiator if the product team needs to manage schemas without deploying code
