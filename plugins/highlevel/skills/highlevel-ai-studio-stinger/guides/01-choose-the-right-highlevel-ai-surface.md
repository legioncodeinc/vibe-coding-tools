# Choose the right HighLevel AI surface

Run this selection step before giving build instructions. HighLevel uses several similar AI product names for outputs that do not share the same editor or publishing path.

## 1. Identify the destination artifact

Ask what the user needs to end up with:

- AI Studio project published from AI Studio
- Standard HighLevel Funnel or Website asset
- HighLevel-hosted WordPress page edited in Elementor
- Social post, blog, email template, or other marketing content
- Event-driven agent with triggers and nodes

If the requested artifact is still unclear, ask which HighLevel menu the user sees. Use [../references/product-selector.md] for the complete decision table.

HighLevel currently documents AI Studio, Funnel & Website AI, and WordPress AI-Powered Page Builder as separate page-building surfaces. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/funnel-website-ai.md], [../references/research/raw/wordpress-ai-page-builder.md]

## 2. Normalize aliases without erasing product distinctions

- Treat `AI Studio`, `HighLevel AI Studio`, `AI Studio (Vibe)`, `Vibe`, `vibe coding`, and `vibe code` as AI Studio signals when the output is a web experience. [../references/research/raw/ai-studio-form-trigger.md], [../references/research/raw/highlevel-blog-ai-studio-vibe-coding.md]
- The current archive documents Content AI and AI Studio as separate product names, so treat `AI Content Studio` as ambiguous. [../references/research/raw/ai-tools-overview.md], [../references/research/raw/ai-product-pricing.md]
- Treat `AI website builder` as ambiguous until the user identifies AI Studio, Sites, or WordPress. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/funnel-website-ai.md], [../references/research/raw/wordpress-ai-page-builder.md]
- Never confuse Agent Studio with AI Studio. Agent Studio is the node-based runtime for event-driven agents. [../references/research/raw/agent-studio-overview-distinction.md]

## 3. Route the task

Choose AI Studio when the user wants a prompt-built, code-backed web experience with AI Studio's own preview, versions, Code Editor, and publishing flow. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-code-editor.md]

Choose Funnel & Website AI when the result must remain in the standard drag-and-drop Sites builder. Choose WordPress AI-Powered Page Builder when the result must be a WordPress page for Elementor. [../references/research/raw/funnel-website-ai.md], [../references/research/raw/wordpress-ai-page-builder.md]

Choose Content AI, Ask AI, Blog Post AI, or Email AI by the content destination. Use Guide 06 for their current, evidence-backed workflows. [../references/research/raw/social-planner-ask-ai.md], [../references/research/raw/ask-ai-overview.md], [../references/research/raw/blog-post-ai.md], [../references/research/raw/email-ai.md]

## 4. State irreversible or non-portable consequences before building

AI Studio projects publish from AI Studio and cannot be moved into standard Funnels or Websites. Reference URLs and images guide generation but do not guarantee a one-to-one copy. Confirm both facts before work begins when either matters to the user. [../references/research/raw/ai-studio-overview.md]

## 5. Hand off work outside this pair

- HighLevel REST API, OAuth, Private Integration Tokens, SDKs, CRM resource sync, webhook code, or Marketplace apps: `gohighlevel-stinger`.
- Generic website construction outside HighLevel: `website-stinger` or the stack-specific development Stinger.
- General AI application architecture, RAG, memory, routing, or evaluation: `mind-stinger`.
- Security audit of generated code, form data, third-party scripts, or credentials: `security-stinger`.
