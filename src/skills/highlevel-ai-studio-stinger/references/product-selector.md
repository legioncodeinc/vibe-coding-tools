# HighLevel AI creation product selector

Use this before giving any steps when the user says `AI Content Studio`, `AI website builder`, `Vibe`, or another ambiguous HighLevel AI phrase.

## Fast selection table

| User wants | Select | Confirming UI path | Do not confuse with |
|---|---|---|---|
| A prompt-built site, landing page, dashboard, storefront, interactive form, booking experience, or front-end app | AI Studio | Sub-account left navigation contains `AI Studio` after Labs enablement | Standard Sites builder, Agent Studio |
| A standard funnel or website asset with HighLevel's normal builder controls | Funnel & Website AI | `Sites > Funnels` or `Sites > Websites`, then `Build with AI` or Ask AI inside the builder | AI Studio project |
| A WordPress landing page for continued Elementor editing | WordPress AI-Powered Page Builder | `Sites > WordPress > All Sites > Manage Website > Pages > AI Generated Pages` | AI Studio and standard Sites |
| A guided first draft for a social post | Content AI | Social Planner content editor with Content AI enabled | AI Studio |
| Conversational editing of an existing social post | Edit with Ask AI | Social Planner AI menu | Content AI first-draft flow |
| General branded content, images, platform answers, or supported cross-module actions | Ask AI | Top-bar Ask AI button or the full Ask AI workspace | Customer-facing Conversation AI |
| A blog created and refined inside the Blog Editor | Blog Post AI | `Sites > Blogs`, open a post, then Ask AI panel with `Assist` or `Build` | A blog draft written in general Ask AI chat |
| A complete branded email template | Email AI | `Email Marketing > Emails > Templates > Build with AI` | Workflow-generated email copy |
| An event-driven agent with triggers, routers, tools, knowledge, or API nodes | Agent Studio | `AI Agents > Agent Studio` | AI Studio |

Sources: [research/raw/ai-studio-overview.md], [research/raw/funnel-website-ai.md], [research/raw/wordpress-ai-page-builder.md], [research/raw/social-planner-ask-ai.md], [research/raw/ask-ai-overview.md], [research/raw/blog-post-ai.md], [research/raw/email-ai.md], [research/raw/agent-studio-overview-distinction.md].

## Three questions that resolve most ambiguity

1. What do you want to end up with: a site or app, a standard funnel page, a WordPress page, social content, a blog, an email, or an automated agent?
2. Which HighLevel menu are you currently in?
3. Must the output remain a standard Sites or WordPress asset, or can it publish directly from AI Studio?

Do not choose a surface from the word `AI` alone. The artifacts do not freely convert between products. AI Studio projects cannot be moved into standard Funnels or Websites. [research/raw/ai-studio-overview.md]

## Alias handling

- `HighLevel AI Studio`, `GoHighLevel AI Studio`, `GHL AI Studio`, `AI Studio (Vibe)`, `HighLevel vibe coding`, and `HighLevel vibe code` can all route to AI Studio when the requested output is a web experience. [research/raw/ai-studio-form-trigger.md], [research/raw/highlevel-blog-ai-studio-vibe-coding.md], [research/raw/highlevel-blog-ai-studio-landing-page.md]
- The current archive documents Content AI and AI Studio as separate product names and does not establish which product a user means by `AI Content Studio`. Route by output: AI Studio for a web experience, Content AI for a guided content draft, Ask AI for a chat workspace, Blog Post AI for an in-editor blog, or Email AI for a complete email template. [research/raw/ai-tools-overview.md], [research/raw/ai-product-pricing.md]
- `AI website builder` requires a destination check. AI Studio, Funnel & Website AI, and WordPress AI-Powered Page Builder have different editors, output types, and publishing paths. [research/raw/ai-studio-overview.md], [research/raw/funnel-website-ai.md], [research/raw/wordpress-ai-page-builder.md]

## Handoff boundaries

- Calls to `services.leadconnectorhq.com`, OAuth, Private Integration Tokens, resource sync, webhook code, or Marketplace apps: use `gohighlevel-stinger`.
- Generic codebase website construction outside HighLevel: use `website-stinger` or the stack-specific development Stinger.
- Agent Studio design: do not improvise from AI Studio guidance. Route to an Agent Studio specialist if one is registered, otherwise report the gap.
- Security review of generated code, forms, third-party scripts, data handling, or domain setup: use `security-stinger`.
