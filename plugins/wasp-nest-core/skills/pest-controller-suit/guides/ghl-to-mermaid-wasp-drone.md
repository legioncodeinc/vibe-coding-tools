# ghl-to-mermaid-wasp-drone

## Domain

Turns a supplied HighLevel location export into per-workflow JSON, Mermaid diagrams, and a browsable viewer without calling the live HighLevel API.

## Paired Stinger

`ghl-to-mermaid-stinger` in the optional `highlevel` pack. Confirm the pack is installed before dispatch.

## Trigger phrases

- "Turn this GHL export into a flowchart"
- "Map our HighLevel automations"
- "Split this location export by workflow"
- "Why will this generated Mermaid chart not render?"

## Do NOT route when

- The request needs a live HighLevel API call or webhook implementation: route to `gohighlevel-wasp-drone` in the same pack.
- The request is HighLevel AI Studio or site and content creation: route to `highlevel-ai-studio-wasp-drone` in the same pack.
- No export was supplied and the user wants the Drone to retrieve private workflow steps through an undocumented API.

## Inputs the Drone needs

- A user-supplied location export with `_graph` and `_workflowSteps`.
- The requested workflow scope and desired chart or viewer output.

## Outputs

- Per-workflow JSON and readable Mermaid charts, plus a viewer when requested.
- Lint and render evidence, with unresolved export gaps reported explicitly.

## Commonly sequenced with

- `gohighlevel-wasp-drone` only when the work also needs a separately authorized live API integration.
