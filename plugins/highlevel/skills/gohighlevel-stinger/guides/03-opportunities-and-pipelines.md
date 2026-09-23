# 03. Opportunities and pipelines

## Resolve pipeline structure first

Stage IDs are not standalone -- a stage only exists nested inside a pipeline. Always call `GET /opportunities/pipelines?locationId={id}` first and cache the result; every opportunity create/update needs a valid `pipelineId` + `pipelineStageId` pulled from that response [raw/ghl--opportunities--pipelines-and-crud-endpoints.md].

Response shape: `pipelines[]`, each with `id`, `name`, `stages[]` (each `{id, name, position}`), `locationId`, `showInFunnel`, `showInPieChart`.

## Endpoint table

| Method | Endpoint | Scope | Notes |
|---|---|---|---|
| GET | `/opportunities/pipelines` | `opportunities.readonly` | Call first, cache the result |
| GET | `/opportunities/search` | `opportunities.readonly` | **snake_case query params** (`location_id`, `pipeline_id`) -- unlike the rest of the API |
| GET | `/opportunities/{id}` | `opportunities.readonly` | |
| POST | `/opportunities/` | `opportunities.write` | Create |
| PUT | `/opportunities/{id}` | `opportunities.write` | Update |
| PUT | `/opportunities/{id}/status` | `opportunities.write` | Status transition specifically |
| DELETE | `/opportunities/{id}` | `opportunities.write` | |

[raw/ghl--opportunities--pipelines-and-crud-endpoints.md]

## The snake_case gotcha

Every other resource in this research uses camelCase query and body parameters. `GET /opportunities/search` is the one documented exception, taking `location_id` and `pipeline_id` instead of `locationId`/`pipelineId`. This is exactly the kind of detail that produces a silent empty-result-set bug rather than an error -- verify parameter casing per endpoint rather than assuming platform-wide consistency [raw/ghl--opportunities--pipelines-and-crud-endpoints.md].

## Worked example: create an opportunity in the first pipeline stage

See `references/request-examples.md` §4 for the full curl + TypeScript pair. Pattern: fetch pipelines, pick the target pipeline and stage, then `POST /opportunities/` with `locationId`, `pipelineId`, `pipelineStageId`, `name`, `contactId`, `status`.

## Scoping

`opportunities.readonly` covers all read endpoints including search; `opportunities.write` covers create/update/status/delete. There is no separate "search" scope, unlike some platforms [raw/ghl--opportunities--pipelines-and-crud-endpoints.md].

## Attaching an opportunity to a contact

Opportunities reference a `contactId` -- resolve or create the contact first (see `guides/02-contacts-and-custom-fields.md`) before creating the opportunity. There is no combined "create contact and opportunity in one call" endpoint documented in this research.
