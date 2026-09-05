# Get Pipelines | HighLevel API (official) + ghl-sdk Rust opportunities endpoint table

- URL: https://marketplace.gohighlevel.com/docs/ghl/opportunities/get-pipelines/
- Secondary URL: https://docs.rs/ghl-sdk/latest/ghl_sdk/opportunities/index.html
- Fetched: 2026-08-14
- Source type: Official endpoint doc + community Rust SDK docs (reproduces endpoint list accurately against the OpenAPI spec)
- Component: opportunities, pipelines - endpoint catalog and scopes

## Get Pipelines (official)

```
GET https://services.leadconnectorhq.com/opportunities/pipelines?locationId={locationId}
```

Response: a `pipelines` array, each with `id`, `name`, `stages` (array of `{id, name, position}`), `locationId`, `showInFunnel`, `showInPieChart` (per the smartmarketingarchitect.com worked-example secondary source, consistent with the official schema fields it lists).

## Full opportunities endpoint table (community SDK, generated from the official OpenAPI spec)

| Method | Endpoint | Scope |
|---|---|---|
| pipelines | `GET /opportunities/pipelines` | `opportunities.readonly` |
| search | `GET /opportunities/search` | `opportunities.readonly` |
| get | `GET /opportunities/{id}` | `opportunities.readonly` |
| create | `POST /opportunities/` | `opportunities.write` |
| update | `PUT /opportunities/{id}` | `opportunities.write` |
| update_status | `PUT /opportunities/{id}/status` | `opportunities.write` |
| delete | `DELETE /opportunities/{id}` | `opportunities.write` |

- "Unlike the rest of the API, `GET /opportunities/search` takes snake_case query parameters (`location_id`, `pipeline_id`)" -- called out explicitly by the SDK author as an inconsistency versus the rest of the platform's camelCase convention.
- Stage IDs are not standalone; a `PipelineStage` only exists nested inside a `Pipeline`, so callers must call `GET /opportunities/pipelines` first to resolve a `pipelineId` + `stageId` pair before creating or moving an opportunity.
- A GitHub-hosted community docs mirror (`keith-wohnv/GHL-API-Docs/API/Opportunities.md`) confirms the same endpoint set plus `Upsert Opportunity`, matching the "upsert exists for opportunities too" pattern seen for contacts.

## Notes for the distillation

`opportunities.readonly` / `opportunities.write` map cleanly to read vs write endpoints -- unlike some other resources, there is no separate "search" scope. The snake_case-query-params-on-an-otherwise-camelCase-API quirk on `/opportunities/search` is a genuine, narrow gotcha worth a callout in the field-mapping worksheet and troubleshooting guide.
