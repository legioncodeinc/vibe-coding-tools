# Security and secrets

Install plugins from the [public marketplace](../../README.md#start-here), then inspect their manifests and instructions before enabling the capabilities you need. Installing a plugin does not itself authorize a home instruction merge, repository initialization, push, deployment, purchase, or message. The [Getting Started guide](GETTING-STARTED.md) describes the separate consent checks and lock files.

Do not put API keys, access tokens, database URLs, private customer data, or production credentials into Stinger examples, research captures, PRDs, CTRs, or bug reports. Use explicit placeholders. The source publisher validates common credential patterns and excludes raw research, dependency trees, and ingested photography models from the public distribution. Automated checks are useful defenses, not proof that every possible secret has been found.

A Stinger can describe a change but cannot approve it for you. The task's authority still controls external effects such as publishing, deployment, messages, purchases, and pushing a branch. When you choose to run the [Ship Gate workflow](../../commands/ship-gate.md), it orders security review before quality review so a security fix does not invalidate an earlier quality result.

If you believe a published file exposes a secret or private data, do not paste it into an issue. Contact the repository maintainers through a private channel and rotate the affected credential with its provider.
