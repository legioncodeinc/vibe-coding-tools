# Honeybee plugin-category proposal

This is a marketplace grouping proposal. It groups by the outcome a person wants, not by a framework or database choice. It creates no skills, bundles, registrations, or marketplace state.

## honeybee core

The mandatory foundation. A marketplace installer should install or enable this once before enabling any other hive. A package-level install check can verify the core manifest and fail an add-on install with a clear instruction to install core first. A marketplace-level mandatory dependency should also be used if the target marketplace supports it.

Include `beekeeper`, `smoke-it`, `queen-bee-stinger`, `beekeeper-suit`, `get-started-stinger`, the `library-*`, `knowledge-*`, and `security-*` pairs, plus the supporting core commands, hooks, and rules.

## websites, build-a-website-hive

For someone building a marketing site, content site, or public web presence. Include website delivery, design, content, SEO, performance, image, typography, documentation, and CMS-adjacent assets. Cross-over assets include `website`, `seo-aeo`, `design-system`, `impeccable`, `image-optimization`, `typography-font`, `font-loading`, `markdown-mdx-content-pipeline`, `svelte`, `tailwind`, and `shadcn-svelte`.

## web-apps, saas-builder-hive

For someone building a product with users, data, payments, deployment, and integrations. Include app architecture, authentication, billing, databases, delivery, observability, accessibility, and migrations. Cross-over assets include `svelte`, `react`, `preact`, `typescript-node`, `python`, `db`, `neon-drizzle`, `auth`, `workos`, `payments`, `vercel`, `devops`, `posthog`, `sentry`, `modal-toast-dialog`, `dark-mode-theming`, `icon-system`, `tanstack`, `bifrost`, `deeplake-dataset`, and `react-to-svelte`.

## my-computer

Reserved for future personal-computer workflows. Keep this namespace intentionally thin until its details are defined. Likely cross-over candidates are `terminal-bash`, `cursor-ide`, `ai-coding-tools`, `ai-tools-platform`, `harness-integration`, and future local-device assets. No new assets are created or promoted by this proposal.

## danger-zone, red-team-blue-team

For security-sensitive, adversarial, recovery, and high-risk repository work. Include the core `security-*` pair as a cross-over dependency, plus `dependency-audit`, `git`, `github-repo-health`, and any future paired assets from the `red-team-blue-team` source. The audit found no direct matching common-folder asset in that repository, so this group is a package boundary proposal, not an import claim.

## marketing, marketing-tools-hive

For acquiring, converting, retaining, and understanding customers. Include `lifecycle-email`, `competitive-research`, `seo-aeo`, `changelog-release-notes`, `product-tour-onboarding-ui`, `affiliate-referral-program`, `alt-ads-platforms`, `blogging-content-strategy`, `cold-outreach`, `crm-integration`, `customer-support-tooling`, `discovery-research`, `newsletter-platform`, `product-feedback-roadmap`, `review-funnels-g2`, and `social-media-marketing-organic` where their paired assets are active.

The unpaired Littlebird assets remain quarantined. They are not marketplace candidates until a worker-bee pairing decision is made.

## 101-tutorials

For people learning the Honeybee workflow from first principles. Start with `get-started-stinger`, the `beekeeper` command, beginner-safe library and knowledge guidance, and curated examples from the website and web-apps hives. This category should be an onboarding route, not a second copy of the implementation hives.

## Cross-over policy

An asset may appear in more than one hive. The core package is the sole mandatory dependency. Add-ons should declare their core dependency and list cross-over assets by reference, not duplicate their files.
