# Publish, connect domains, configure SEO, and reuse projects

Use this guide after the project content, interactions, and connections are stable.

## 1. Complete pre-publish review

Run [../references/publish-qa-checklist.md]. Review every route on desktop, tablet, and mobile. Confirm build success, links, approved assets, content accuracy, accessibility basics, forms, calendars, and workflows. AI Studio exposes device previews and route selection, but those controls are not proof until the checks are performed. [../references/research/raw/ai-studio-overview.md]

## 2. Publish to the preview domain first

1. Select `Publish` in the upper-right area.
2. Review or change the preview URL.
3. Continue the publish flow.
4. Set the icon, project name, description, and social image.
5. Apply the changes and publish.
6. Open the public preview URL and re-test the release-critical paths.

AI Studio requires this preview-domain publication before a custom domain can be connected. [../references/research/raw/ai-studio-overview.md]

## 3. Connect and verify a custom domain

1. Open `Publish > Add Custom Domain`.
2. Enter the intended domain.
3. For an apex or `www` name, decide whether to connect both forms.
4. Review any DNS conflict reported for a HighLevel-managed domain.
5. Otherwise add the displayed DNS records and select `Verify DNS`.
6. Open the live site after verification.
7. Set the intended URL as primary.
8. Confirm other connected URLs redirect to the primary URL with HTTP 301.

The domain entered during an apex plus `www` setup is treated as primary unless an existing primary remains. Verify the actual result rather than assuming it. [../references/research/raw/ai-studio-overview.md]

## 4. Enable Advanced SEO Support

Prerequisites:

- The project is published.
- A custom domain is connected.
- The custom domain is primary.

Then:

1. Open `More > SEO & AI search`.
2. Enable Advanced SEO Support.
3. Republish the project.
4. Use `Copy prompt` for social preview improvements when needed, paste the prompt into AI Studio, review the changes, and republish.
5. Use `Copy prompt` for sitemap generation when needed, paste it into AI Studio, review the changes, and republish.
6. Test social previews and submit the sitemap to the appropriate search console.

Advanced SEO gives supported crawlers pre-rendered HTML and supports up to 150 routes per site. The pre-render cache refreshes on publication or a connected-domain change, and after site updates when the project is republished. [../references/research/raw/ai-studio-advanced-seo.md]

Advanced SEO does not add schema markup automatically. If schema is required, add and review it in project code, republish, and verify rendered output. [../references/research/raw/ai-studio-advanced-seo.md]

## 5. Keep draft and live state separate

After publication, later edits remain drafts until another publish. A Code Editor save changes preview and creates a version but does not update the public site. Record the final publish time and re-open the live URL after the last change. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-code-editor.md]

## 6. Clone or distribute a project

Use project cloning for one copy:

1. Open the project's three-dot menu and select `Clone`.
2. Set the new project name, target sub-account, and target folder.
3. Choose whether to include chat and version history.
4. Clone and validate the new project's connections and domains.

Use Snapshots to package multiple AI Studio projects or establish repeatable agency templates. AI Studio supports cloning within the same sub-account and to another sub-account in the same agency. [../references/research/raw/ai-studio-overview.md]

Cloning and Snapshots do not turn an AI Studio project into a standard Funnel or Website asset. [../references/research/raw/ai-studio-overview.md]
