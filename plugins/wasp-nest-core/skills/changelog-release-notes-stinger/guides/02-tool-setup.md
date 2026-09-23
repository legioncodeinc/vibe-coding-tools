# Guide 02: Tool Setup

> Use after tool selection is confirmed. Provides the minimum integration steps for each platform.

*Derived from: `research/external/headway-app.md`, `research/external/featurebase.md`, `research/external/productlane.md`, `research/external/beamer.md`*

---

## Headway

1. Sign up at headwayapp.co.
2. Create a project. Copy your **Account ID** from the project settings.
3. Add to your app's `<head>` (or in a Next.js `_app.tsx` / `layout.tsx`):

```html
<script>
  window.HW_config = {
    selector: "#headway-badge",
    account: "YOUR_ACCOUNT_ID"
  }
</script>
<script async src="https://cdn.headwayapp.co/widget.js"></script>
```

4. Add a trigger element where the badge should appear:

```html
<span id="headway-badge">What's New</span>
```

5. Verify the badge renders and shows the unread count on a test entry.
6. (Paid) Set a custom domain in project settings → Custom Domain.

**Time to working widget:** ~20 minutes.

---

## FeatureBase

1. Sign up at featurebase.app.
2. Create an organization. Note your **organization slug** (e.g., `yourorg`).
3. Install the React SDK:

```bash
npm install @featurebase/react
```

4. Wrap your app root or the specific component:

```tsx
import { FeaturebaseProvider } from '@featurebase/react';

export default function App({ children }) {
  return (
    <FeaturebaseProvider organization="yourorg">
      {children}
    </FeaturebaseProvider>
  );
}
```

5. Add the widget trigger:

```tsx
import { FeaturebaseWidget } from '@featurebase/react';

<FeaturebaseWidget
  placement="right"
  theme="light"
  defaultBoard="changelog"
/>
```

6. (Optional) Pass user identity for read receipts:

```tsx
<FeaturebaseProvider
  organization="yourorg"
  user={{ email: currentUser.email, name: currentUser.name }}
>
```

**Time to working widget:** ~30 minutes.

---

## Productlane (Linear integration)

1. Go to productlane.com → Connect Linear workspace via OAuth.
2. Choose which Linear Teams map to your public portal.
3. Configure which Linear **states** (e.g., "Done") trigger a changelog draft.
4. Add the widget to your app:

```html
<script>
  window.productlaneConfig = { token: "YOUR_TOKEN" };
</script>
<script async src="https://widget.productlane.com/v1/widget.js"></script>
<div id="productlane-widget"></div>
```

5. When a Linear issue moves to the configured state, Productlane auto-drafts an entry. Edit and publish from the Productlane dashboard.

**Time to working widget:** ~45 minutes (Linear OAuth is the longest step).

---

## Beamer

1. Sign up at getbeamer.com. Create an app.
2. Copy your **App ID**.
3. Add the widget script:

```html
<script>
  var beamer_config = {
    product_id: "YOUR_APP_ID",
    selector: "#beamer-button",
    // Optional: identify the user for segmentation + read receipts
    user_id: "{{ current_user_id }}",
    user_email: "{{ current_user_email }}",
    filter: "{{ current_user_plan }}"  // for segmentation
  };
</script>
<script defer src="https://app.getbeamer.com/js/beamer-embed.js"></script>
```

4. Add the trigger element:

```html
<button id="beamer-button">What's New</button>
```

5. Verify segmentation works by creating two test entries with different `filter` values.

**Time to working widget:** ~30 minutes without segmentation, ~60 minutes with segmentation (requires user data wiring).

---

## Self-hosted markdown (Keep a Changelog)

1. Create `CHANGELOG.md` at the project root.
2. Start with the standard structure:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-05-20
### Added
- Initial release

[Unreleased]: https://github.com/org/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
```

3. (Optional) Add `release-please` or `conventional-changelog` to CI for automated CHANGELOG.md updates on version tags.
4. Distribution: enable GitHub Releases notifications or add a Slack webhook for release tag events.

**Time to working changelog:** ~15 minutes (no widget).
