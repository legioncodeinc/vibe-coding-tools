# Desktop portability

## Claude desktop

Claude Code desktop uses `/documentation-tools:library-packets`, the paired agent and the skill in the installed `documentation-tools` package. Core remains required. Claude Cowork receives the plugin with flat `commands/library-packets.md` alongside `skills/library-packets-stinger` and `agents/library-packets-wasp-drone.md`. Commands load Pest Controller first; the agent loads its paired skill before work. If the installed skill resolver is unavailable, read the packaged file through the host's file tool; do not claim the native invocation succeeded.

## ChatGPT and Codex desktop

Codex desktop receives the shared skill and the generated source-command wrapper through the Wasp Nest build. The paired role is projected to Codex TOML by the existing builder. Optional Codex role registration requires Core's trusted registration hook and the explicit installed-plugin registry; native marketplace installation is not proven to populate that registry. Follow the [version 3 layout guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/learn/reference/PLUGIN-LAYOUT.md) before claiming the role is available. Use the actual installed selector name shown by the desktop app; do not promise that a Claude slash command is native in Codex.

Plain ChatGPT desktop needs an accessible library attachment/archive or connector plus file-creation and rendering tools. Provide the portable starter instructions and packaged skill files. The same workflow can run through those tools, but an ordinary chat does not gain local folder access, a registered native agent or a slash command merely from reading a prompt. When required output tools are unavailable, report the dependent output as blocked.

## Capability contract

Use the host's runtime discovery and available packages. Helpers need Python; text inventory uses the standard library, while Word/PDF export and page review need the documented packages and an existing renderer. Native DOCX/PDF tools can satisfy the format contract when available. No hardcoded author home, forced model, credential, MCP-server configuration or automatic dependency installation ships with this capability.

The bundled output helper requires POSIX directory handles and no-follow file opens, as available on macOS and Linux. It creates private JSON files with mode 0600 and fresh render roots with mode 0700. It reports unsupported file-output runtimes as blocked. Windows helper execution has not been qualified. What is in place: renderer discovery accepts `soffice.exe`, the `SOFFICE_PATH` environment variable and the standard `Program Files\LibreOffice\program` locations, so a Windows LibreOffice install can be found. What still blocks: the private JSON writer needs POSIX no-follow opens, so `render` and `inventory` stop with a blocked result on native Windows. Untested: any run on Windows, including `validate`, and LibreOffice pagination differences. On Windows, run the helper under WSL, or use the host's native document tools only when their private-file behavior can satisfy the same output contract.

The portable skill frontmatter uses only the six Agent Skills fields. Flat commands remain in the Claude/Cowork plugin. Any plain-ChatGPT starter is a workflow carrier, not a native agent registration.

Harness authority: Queen's [support matrix](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/queen-wasp-stinger/guides/harness-support-matrix.md), [field procedures](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/queen-wasp-stinger/guides/per-type-per-harness-specific-guide.md) and its cited primary archive. Domain construction/conversion and limitations: [F07-F14, F19-F22, F27-F28](../references/research/distilled-library-packets.md), Word, LibreOffice. Report only the packaging/validation and host behavior actually exercised.
