# HighLevel Pack

One installable Wasp Nest pack with three distinct HighLevel jobs:

| Job | Stinger | Drone |
| --- | --- | --- |
| REST API integrations, OAuth, CRM resources, and webhooks | [GoHighLevel](skills/gohighlevel-stinger/SKILL.md) | [GoHighLevel Drone](agents/gohighlevel-wasp-drone.md) |
| AI Studio and other HighLevel AI creation surfaces | [AI Studio](skills/highlevel-ai-studio-stinger/SKILL.md) | [AI Studio Drone](agents/highlevel-ai-studio-wasp-drone.md) |
| Offline account-export conversion to Mermaid charts | [GHL to Mermaid](skills/ghl-to-mermaid-stinger/SKILL.md) | [GHL to Mermaid Drone](agents/ghl-to-mermaid-wasp-drone.md) |

The converter reads a location export. It does not call the live HighLevel API. The REST API Stinger owns live integration; the AI Studio Stinger owns in-product creation and publishing. Install this pack when you need any of the three. A fresh core-only install omits all three specialist pairs; the core router can identify them but must ask for this pack before dispatch. The local installer does not delete files left by an older install, so a prior core installation may retain older standalone HighLevel files until the user reviews them.

The three Python scripts in the Stinger's `scripts/` directory are copied from [highlevel-workflow-to-mermaid-chart](https://github.com/legioncodeinc/highlevel-workflow-to-mermaid-chart) at commit `2168ef1`. No customer export or generated chart is bundled. Python 3.9 or newer is sufficient for the converter.

First-party pack material is licensed under [AGPL-3.0-or-later](LICENSE.md). External HighLevel and Mermaid research captures remain under their publishers' rights; see [third-party notices](THIRD-PARTY-NOTICES.md). The built plugin includes distilled research and omits raw captures.
