# Distilled research: HighLevel AI Studio

Research window: 2026-03-03 through 2026-09-03. Fetch date: 2026-09-03. This article distills 27 official HighLevel sources. Support Portal pages control operational guidance. Product blog posts supply launch history and official search language where newer support pages do not. Every factual statement points to a local raw file.

## 1. Canonical terminology

| Phrase | Evidence-based interpretation | Runtime rule | Evidence |
|---|---|---|---|
| AI Studio | The canonical product name for HighLevel's conversational builder for websites, pages, and interactive front-end experiences. | Use this name in titles and instructions. | [raw/ai-studio-overview.md] |
| HighLevel AI Studio | The official marketing-qualified form of AI Studio. | Treat it as the same product. | [raw/highlevel-blog-ai-studio-launch.md] |
| AI Studio (Vibe) | An official alias used for AI Studio sites in the dedicated form workflow documentation. | Accept `Vibe`, `Vibe site`, and `Vibe website` as AI Studio search aliases when HighLevel is explicit. | [raw/ai-studio-form-trigger.md] |
| vibe coding, vibe code | Official descriptive language for building with prompts in AI Studio, not a separate product. | Normalize these phrases to AI Studio. | [raw/highlevel-blog-ai-studio-vibe-coding.md], [raw/highlevel-blog-ai-studio-landing-page.md] |
| AI Content Studio | The current archive documents Content AI and AI Studio as separate product names and does not establish which one a user means by this phrase. | Treat the phrase as ambiguous, ask what the user wants to create, and route by output. | [raw/ai-tools-overview.md], [raw/ai-product-pricing.md] |
| AI website builder | Ambiguous. HighLevel currently documents AI Studio, Funnel & Website AI, and a WordPress AI-Powered Page Builder as different surfaces. | Ask for the UI path or destination artifact before giving steps. | [raw/ai-studio-overview.md], [raw/funnel-website-ai.md], [raw/wordpress-ai-page-builder.md] |
| Agent Studio | A separate node-based environment for event-driven agents. | Do not route Agent Studio work to the AI Studio procedure. | [raw/agent-studio-overview-distinction.md] |

## 2. Product selector

| Desired result or visible UI | Product | Location | Important distinction | Evidence |
|---|---|---|---|---|
| A prompt-built site, landing page, dashboard, storefront, form, booking experience, or other interactive front end | AI Studio | Enable in Labs, then open `AI Studio` in the sub-account navigation | Code-backed project with its own editor, versions, publishing, and domains. It does not convert into the standard Sites builders. | [raw/ai-studio-overview.md], [raw/ai-studio-code-editor.md] |
| A standard HighLevel funnel or website page with normal builder controls | Funnel & Website AI | `Sites > Funnels` or `Sites > Websites`, then `Build with AI`, or open an asset and use Ask AI | `Assist` and `Build` operate inside the standard builder. | [raw/funnel-website-ai.md] |
| A HighLevel-hosted WordPress landing page that will continue in Elementor | WordPress AI-Powered Page Builder | `Sites > WordPress > All Sites > Manage Website > Pages > AI Generated Pages` | Produces a WordPress draft and has a separate monthly page-credit allowance. | [raw/wordpress-ai-page-builder.md] |
| A first social-post draft from guided fields | Content AI | Social Planner where Content AI is enabled | Content AI generates the initial draft. Quick AI Actions and Edit with Ask AI refine it. | [raw/social-planner-ask-ai.md] |
| General branded content or cross-module work in a chat workspace | Ask AI | Top navigation or the dedicated Ask AI workspace | Ask AI can create content and act across supported modules, but some areas are read-only or not connected. | [raw/ask-ai-overview.md] |
| A full blog created and edited inside the Blog Editor | Blog Post AI | `Sites > Blogs`, open a post, then use the Ask AI panel | `Assist` generates from guided topic fields. `Build` accepts a custom prompt. | [raw/blog-post-ai.md] |
| A complete branded email template | Email AI | `Email Marketing > Emails > Templates > Build with AI` | Uses Brand Board styling, supports conversational edits and versions, and creates an editable template rather than exact source-code replication. | [raw/email-ai.md] |
| An event-driven agent with triggers, routers, knowledge search, API calls, or generated runtime content | Agent Studio | `AI Agents > Agent Studio` | Node-based agent runtime, not an interactive website builder. | [raw/agent-studio-overview-distinction.md] |

## 3. AI Studio access and governance

AI Studio remained a Labs feature in the current September overview. Labs features can change in function, design, availability, or release timing, so instructions must begin by confirming the target account's current UI. Agency Owners and Admins can grant sub-account access, while eligible sub-account users can enable visible features from their own Labs page. [raw/ai-studio-overview.md], [raw/labs-overview.md]

The direct sub-account path is: open the target sub-account, enable AI Studio in Labs if needed, then click `AI Studio` in the left navigation. AI Studio has `View AI Studio` read-only permission and `View & Manage AI Studio` full permission. [raw/ai-studio-overview.md]

Agency bulk control lives under `Agency Dashboard > AI Suite > AI setup`. After selecting sub-accounts, `Manage AI access` can leave settings unchanged, enable only for sub-account admins, enable for all sub-account admins and users, or disable access. [raw/ai-studio-bulk-enable.md]

Labs visibility and enablement are different controls. A feature can be visible but off. Eligible plans support agency defaults and per-sub-account overrides. Changes to Labs feature flags are recorded in Audit Logs. [raw/labs-overview.md]

## 4. Starting and briefing an AI Studio project

AI Studio accepts a natural-language prompt, template, public URL, screenshot, image, or other supporting file. Current documented template families include landing pages, dashboards, ecommerce storefronts, and portfolios. The home area supports recent projects, owned projects, starred projects, templates, folders, rename, move, and delete actions. [raw/ai-studio-overview.md]

When a prompt is broad, AI Studio can ask guided questions about color, typography, layout, conversion goal, business type, audience, and offer. A user can answer, skip one question, or skip all. A strong brief should still supply the target audience, primary conversion action, required pages or sections, offer, brand direction, real assets, required form or calendar behavior, and explicit exclusions. [raw/ai-studio-overview.md], [raw/highlevel-blog-ai-studio-landing-page.md]

AI Studio can generate single-page and multi-page front ends, layouts, copy, visuals, navigation, forms, booking sections, and interactive experiences. Current HighLevel examples document a one-page lead site, an animation-heavy fashion page with an added dependency, and a seven-page site with editable CMS collections. These examples establish capability, not a fixed cost or a promise that any arbitrary backend can be built. [raw/ai-studio-overview.md], [raw/ai-studio-pricing.md]

Reference URLs and images are creative direction. The newest Support Portal guidance says they should not be treated as exact one-to-one copies. [raw/ai-studio-overview.md], [raw/ai-studio-pricing.md]

## 5. Three AI Studio editing modes

| Mode | Best use | Save and usage behavior | Evidence |
|---|---|---|---|
| Conversational prompt | Structural, content, visual, or functional changes described in plain language | Each AI-generated change creates a recoverable version and uses AI processing. | [raw/ai-studio-overview.md], [raw/ai-studio-pricing.md] |
| Visual Edits | Precise text, button, image, icon, color, spacing, border, shadow, and layout changes from the live preview | Direct controls do not invoke the model or consume AI tokens. Targeted prompts do. Unsaved changes are discarded when leaving the mode. | [raw/ai-studio-visual-edits.md] |
| Code Editor | Direct TypeScript, JSX, CSS, JSON, route, component, or text-file changes | `Save` refreshes preview and creates a version. It does not update the public site until the project is published. | [raw/ai-studio-code-editor.md] |

Visual Edits supports inline text editing, contextual controls, image URLs and alt text, layout fit, theme and Tailwind colors, margin and padding, and selection of one or multiple elements for a focused prompt. Lucide icons can be swapped from the integrated icon library. [raw/ai-studio-visual-edits.md]

The CodeMirror-based Code Editor includes a file tree, current-file Find and Replace, global search, live preview, build error details, AI-assisted `Try to fix`, automatic route detection, version creation on save, and an unsaved-change warning. A successful preview is necessary but does not replace live publishing and functional testing. [raw/ai-studio-code-editor.md]

Version History can open, preview, bookmark, and restore earlier states. Prompt-generated changes and Code Editor saves create versions. Edits made after publication stay in draft until another publish. [raw/ai-studio-overview.md], [raw/ai-studio-code-editor.md], [raw/highlevel-blog-ai-studio-draft-mode.md]

## 6. Forms, calendars, and workflow automation

A visible generated form is initially a front-end layout. It does not send data to the HighLevel CRM until the user asks AI Studio to connect it or uses the `Connect` action and completes CRM tracking. After connection, submissions can create contacts and appear under `Contacts` and `Sites > Forms > Submissions > External Forms`. [raw/ai-studio-forms-calendars.md], [raw/ai-studio-overview.md]

The minimum form verification loop is: connect CRM tracking, publish the project, submit a real test entry through the live page, confirm the contact and submission, and then inspect workflow execution. A preview-only submission is not sufficient proof of the production data path. [raw/ai-studio-form-trigger.md], [raw/ai-studio-forms-calendars.md]

The dedicated `AI Studio Form Submitted` trigger can filter on AI Studio project, form, page path, and domain. Before its filter values appear, AI Studio must be enabled, the project must contain a connected form, the project must be published, and at least one test submission must exist. [raw/ai-studio-form-trigger.md]

Older connected forms can continue using External Tracking. To move an existing form to the dedicated trigger, prompt `Re-trigger form integration`, reconnect CRM tracking, republish, submit a new test entry, refresh the workflow builder, and configure the new trigger. Reconnection is not required if the user intends to keep External Tracking. [raw/ai-studio-form-trigger.md], [raw/ai-studio-forms-calendars.md]

AI Studio can generate a custom booking interface, but it connects to a calendar that already exists in the sub-account. The selected calendar remains the source of availability, bookings, confirmations, reminders, and calendar automations. The live booking flow must be previewed and tested after connection. [raw/ai-studio-forms-calendars.md]

## 7. Preview, publish, domains, and SEO

AI Studio preview supports desktop, tablet, and mobile modes, multi-page route selection, opening a page in a new tab, and refreshing the preview after changes. Test every route and conversion path rather than treating a clean first page as release proof. [raw/ai-studio-overview.md]

Publishing begins with an AI Studio preview domain. The publish flow can set the URL, icon, name, description, and social image. A custom domain cannot be connected until the project has first been published to a preview domain. Connected apex and `www` domains can be configured together, and non-primary connected URLs redirect with HTTP 301 to the primary URL. [raw/ai-studio-overview.md]

AI Studio projects stay inside AI Studio and publish from that workspace. They cannot be moved or copied into the standard Funnels or Websites builders under Sites. [raw/ai-studio-overview.md]

Most AI Studio projects are single-page applications. Advanced SEO Support can serve rendered HTML to supported search, social, and AI crawlers. It requires a published project, a connected custom domain, and that custom domain set as primary. Enabling it is not enough by itself; the project must be republished. [raw/ai-studio-advanced-seo.md]

Advanced SEO includes bot-facing pre-rendering, social preview support, and a sitemap workflow. The pre-render cache refreshes on publication or a connected-domain change, and after site updates when the project is republished. It supports up to 150 routes per site. The UI supplies prompts for social metadata and sitemap support, which must be pasted into AI Studio, reviewed, and published. [raw/ai-studio-advanced-seo.md]

Advanced SEO does not automatically inject schema markup. If schema is added to project code through a prompt or direct edit, the rendered HTML can expose it to supported crawlers. [raw/ai-studio-advanced-seo.md]

## 8. Reuse and distribution

AI Studio can clone a project within the same sub-account or to another sub-account in the same agency. The clone can target a folder and can include chat and version history or start as a clean copy. Snapshots can package multiple AI Studio projects for reuse across sub-accounts and agencies. [raw/ai-studio-overview.md]

Cloning across AI Studio accounts does not change the separate limitation that AI Studio projects cannot be converted into standard Funnels or Websites assets. [raw/ai-studio-overview.md]

## 9. Pricing and usage snapshot

The pricing facts below are a dated 2026-09-03 snapshot. HighLevel states that pricing and model availability can change and instructs users to verify the current in-app pricing before quoting a customer. [raw/ai-product-pricing.md]

| Product | Current archived treatment | Evidence |
|---|---|---|
| AI Studio | Pay-Per-Use at token cost. AI Employee Growth includes usage. AI Employee Unlimited includes three times the Growth allowance. Usage limits operate in five-hour windows. | [raw/ai-product-pricing.md] |
| Funnel & Website AI | Free with 1,000 prompts per day per location across the listed plan types. | [raw/ai-product-pricing.md] |
| Content AI | Growth and Unlimited list unlimited use subject to fair use. Pay-Per-Use lists $0.063 per image and $0.0945 per 1,000 words. | [raw/ai-product-pricing.md] |
| Email AI | Included on the listed plans, subject to fair use. | [raw/ai-product-pricing.md] |
| Agent Studio | Pay-Per-Use on every listed plan. | [raw/ai-product-pricing.md] |
| WordPress AI-Powered Page Builder | Twelve AI page-generation credits per site per month. | [raw/wordpress-ai-page-builder.md] |

AI Studio session cost is workload-based, not a flat per-page or per-prompt charge. Reasoning, page count, generated media, URL or image analysis, component connections, refinements, version creation, and publishing work can affect usage. The archived examples are $0.60 for a yoga lead page, $1.30 for an image-heavy fashion page, and $1.10 for a seven-page travel site. They are examples, not quotes. [raw/ai-studio-pricing.md]

No spending limit is configured by default. `Keep AI running, just notify` is the default soft behavior when a limit exists, while `Block AI at the limit` stops new billable generation. Limits can exist at agency, sub-account, and user levels. Archived maximums are $1,000 per month per sub-account and $500 per month per user, and usage reporting can lag by up to five minutes. [raw/ai-usage-limits.md]

Threshold alerts occur at 70, 80, 90, and 100 percent of an active limit. Included plan usage does not count against a billable spending limit, while Pay-Per-Use and overage activity does. [raw/ai-usage-limits.md]

## 10. Adjacent website builders

Funnel & Website AI remains inside the standard page builder. `Assist` collects structured details such as page name, niche, goal, audience, and offer. `Build` accepts a direct prompt. Users can refine the result through Ask AI and normal builder controls, use a public URL or image as inspiration, review SEO fields, and publish the standard asset. [raw/funnel-website-ai.md]

The WordPress AI-Powered Page Builder creates a draft landing page after collecting page name, slug, business name, niche, goal, content feel, and a free-text brief. Users can improve the prompt, edit and refine copy, change tone and palettes, regenerate one image, continue in Elementor, preview, publish, and unpublish. Draft, preview, publish, and unpublish require LeadConnector plugin 4.0.3 or later. [raw/wordpress-ai-page-builder.md]

The three builder outputs are not interchangeable. AI Studio publishes from AI Studio, Funnel & Website AI creates a standard Sites asset, and WordPress AI creates a WordPress page for continued Elementor editing. [raw/ai-studio-overview.md], [raw/funnel-website-ai.md], [raw/wordpress-ai-page-builder.md]

## 11. Adjacent content creation surfaces

Content AI is the current official name for guided content generation. The broad HighLevel overview lists social posts, emails, website headlines, blogs, and other content from user-defined parameters. The current Social Planner workflow says Content AI creates the first draft, Quick AI Actions handle preset edits, and Edit with Ask AI handles custom conversational refinement. [raw/ai-tools-overview.md], [raw/social-planner-ask-ai.md]

Ask AI is a separate cross-product copilot and workspace. It can create branded content and images and can act in supported HighLevel modules, but its current limitations include read-only Workflows and Campaigns and no direct connection to the full standard Website Builder. [raw/ask-ai-overview.md]

Blog Post AI is a Labs feature inside the Blog Editor. `Assist` uses topic, word count, target audience, keywords, language, and tone. `Build` uses a custom prompt. The user can refine sections and images, review generated SEO metadata, then save as a draft, schedule, or publish. The standard Blog Editor also still documents a Content AI button, so current evidence supports coexistence rather than replacement. [raw/blog-post-ai.md], [raw/standard-create-blog-posts.md]

Email AI is a separate Labs feature inside Email Marketing. It can start from a prompt or reference, apply Brand Board styling, support conversational revisions and versions, and save an editable template. Reference-based generation does not reproduce complex code, tracking pixels, or scripts exactly. Sample images must be replaced with licensed assets, and links plus compliance content must be checked before use. [raw/email-ai.md]

Brand Voice can be generated from a representative URL or a 50 to 100 word description, then reviewed and edited. Multiple voices can be maintained for products, audiences, campaigns, or clients. [raw/brand-voice.md]

## 12. Source conflicts and preferred readings

| Conflict or drift | Evidence | Preferred reading |
|---|---|---|
| The April launch post says AI Studio is free and describes URL input as cloning or recreating a site. | [raw/highlevel-blog-ai-studio-launch.md] | Current September pricing applies. Current Support Portal guidance treats URL and image input as inspiration, not exact reproduction. [raw/ai-product-pricing.md], [raw/ai-studio-overview.md] |
| The June forms guide uses External Tracking, while the July guide introduces a dedicated AI Studio trigger. | [raw/ai-studio-forms-calendars.md], [raw/ai-studio-form-trigger.md] | Use `AI Studio Form Submitted` for new dedicated automation. Keep External Tracking as a supported compatibility path for existing forms. |
| Current docs show both the standard Blog Editor Content AI control and the newer Blog Post AI workflow. | [raw/standard-create-blog-posts.md], [raw/blog-post-ai.md] | Do not claim that either product replaced the other. Inspect the target sub-account UI and route by the visible workflow. |
| `AI Content Studio` appears in user language, while current product docs name Content AI and AI Studio separately. | [raw/ai-tools-overview.md], [raw/ai-studio-overview.md], [raw/ai-product-pricing.md] | Treat the phrase as ambiguous and ask what asset the user wants. |
| Launch-era product breadth can sound like arbitrary full-stack development. | [raw/highlevel-blog-ai-studio-launch.md], [raw/ai-studio-code-editor.md], [raw/ai-studio-overview.md] | Claim only the documented code-backed front-end, CRM form, calendar, CMS-collection, domain, and publishing capabilities. |

## 13. Documented gaps

The current archive does not establish a native GitHub sync, source export or download, off-platform deployment, arbitrary server-side runtime, general database provisioning, secret store, or full standard Sites analytics parity for AI Studio. Treat each as unverified and search newer official documentation before advising that it exists or does not exist. [raw/ai-studio-code-editor.md], [raw/ai-studio-overview.md]

The current archive does not establish that AI-generated copy, media, SEO metadata, schema, accessibility, consent language, legal claims, or third-party assets are automatically production-safe. The operational procedure must require human review, licensed assets, link checks, device checks, real form and booking submissions, and a publish-state check. [raw/email-ai.md], [raw/blog-post-ai.md], [raw/ai-studio-forms-calendars.md], [raw/ai-studio-advanced-seo.md]

## 14. Source ledger

| Raw file | Visible date | Role in this distillation |
|---|---|---|
| [raw/ai-studio-overview.md] | 2026-09-01 | Canonical AI Studio lifecycle, permissions, publishing, cloning, and limits |
| [raw/ai-studio-code-editor.md] | 2026-09-02 | Direct code editing, search, build errors, versions, and publish separation |
| [raw/ai-studio-advanced-seo.md] | 2026-09-02 | SPA pre-rendering, social previews, sitemap, prerequisites, route limit |
| [raw/ai-studio-forms-calendars.md] | 2026-06-26 | Form and calendar connection behavior and External Tracking path |
| [raw/ai-studio-form-trigger.md] | 2026-07-29 | Dedicated form trigger, filters, migration, and `AI Studio (Vibe)` alias |
| [raw/ai-studio-visual-edits.md] | 2026-06-29 | Visual editing controls, save behavior, and token distinction |
| [raw/ai-studio-pricing.md] | 2026-08-21 | Workload model and three worked usage examples |
| [raw/ai-studio-bulk-enable.md] | 2026-07-24 | Agency bulk access control |
| [raw/ai-studio-success-course.md] | 2026-08-07 | Official learning path and course access |
| [raw/highlevel-blog-ai-studio-launch.md] | 2026-04-02 | Launch history and stronger launch-era claims |
| [raw/highlevel-blog-ai-studio-draft-mode.md] | 2026-05-28 | Draft and live-state separation |
| [raw/highlevel-blog-ai-studio-landing-page.md] | 2026-05-29 | Official `vibe code` phrase and project-brief inputs |
| [raw/highlevel-blog-ai-studio-vibe-coding.md] | 2026-05-11 | Official `vibe coding` phrase and lead-capture example |
| [raw/funnel-website-ai.md] | 2026-05-04 | Standard builder product and Assist or Build workflow |
| [raw/wordpress-ai-page-builder.md] | 2026-08-28 | WordPress and Elementor path, credits, and draft publishing |
| [raw/ai-tools-overview.md] | 2026-06-18 | Current Content AI definition and product overview |
| [raw/ask-ai-overview.md] | 2026-09-01 | Ask AI capabilities, paths, permissions, and limitations |
| [raw/blog-post-ai.md] | 2026-05-11 | Blog Post AI modes and publishing flow |
| [raw/standard-create-blog-posts.md] | 2026-06-26 | Standard Blog Editor and Content AI coexistence |
| [raw/social-planner-ask-ai.md] | 2026-07-20 | Content AI, Quick Actions, and Edit with Ask AI distinction |
| [raw/email-ai.md] | 2026-06-30 | Email AI workflow, Labs state, and production checks |
| [raw/brand-voice.md] | 2026-08-11 | Brand Voice generation and reuse |
| [raw/agent-studio-overview-distinction.md] | 2026-07-08 | Explicit AI Studio versus Agent Studio boundary |
| [raw/ai-product-pricing.md] | 2026-09-02 | Current product-specific pricing authority |
| [raw/ai-usage-limits.md] | 2026-09-02 | Spending controls, hierarchy, alerts, and reset behavior |
| [raw/ai-employee-access.md] | 2026-08-20 | AI Employee access, rebilling, and reselling administration |
| [raw/labs-overview.md] | 2026-08-18 | Labs roles, visibility, enablement, volatility, and audit logs |
