# 19: Notifications & Toasts

Source: `research/2026-04-25-notifications-and-toasts.md`. Notifications are three different problems wearing the same name. Pick by *channel*, not by library popularity.

## The three notification surfaces

1. **Toast**: ephemeral, in-page, "just happened" feedback. Lives ~3-5s. Library: Sonner.
2. **In-app inbox**: persistent, per-user, cross-channel notification center (the bell icon). Library/infra: Novu, Knock.
3. **OS push**: Web Push, iOS APNs, Android FCM. Wakes users outside the app. Infra: OneSignal, FCM, APNs (often through Novu/Knock).

Most apps need #1 (toasts) immediately, #2 (inbox) in the second year, and #3 (push) only when retention strategy demands it. Don't conflate them.

---

## TL;DR pick

| Surface | Pick | Why |
|---|---|---|
| Toast (in-page ephemeral) | **Sonner** | Best-in-class React toast lib |
| Toast (legacy alternative) | **react-hot-toast** | Still maintained, smaller surface |
| In-app inbox + multi-channel routing (OSS) | **Novu** | OSS, self-hostable, most flexible |
| In-app inbox + workflows (hosted SaaS) | **Knock** | Workflow-driven, polished APIs |
| Web/mobile push at scale | **OneSignal** | Largest install base, free tier |
| Native push transport | **FCM** (Android/Web) + **APNs** (iOS) | The platform primitives |

The canonical default for in-app feedback: **Sonner**. The canonical default for cross-channel notifications: **Novu** (self-hosted OSS) or **Knock** (managed). Web Push usually flows through Novu/Knock or directly to FCM/APNs.

---

## When to choose each

### Sonner (the toast default)
- Built by the same author as `cmdk` and `vaul`. Used in shadcn/ui's toaster.
- Stack-able, swipe-to-dismiss, promise integration, rich content (custom JSX).
- Tiny bundle, tree-shakeable. Pairs with shadcn `toaster.tsx` out of the box.
- Promise toasts (`toast.promise(...)`) are the cleanest pattern for action feedback.

### react-hot-toast (the alternative)
- Pre-shadcn-era favorite. Still maintained.
- Slightly smaller API. Pick it if a project already uses it; new projects should pick Sonner.

### Novu (OSS multi-channel notification infra)
- Workflow-as-code: in-app + email + SMS + push, with one event payload.
- Self-host or managed cloud. Best fit when you want to own the infra and the schemas.
- Provides a React `<Inbox />` component that wires the bell icon to your backend.

### Knock (workflow-driven SaaS)
- Workflow editor in a UI; each notification becomes a node graph (channels, conditions, batching, digests).
- Best when product/marketing edits notifications without code deploys.
- More expensive than Novu but less ops overhead.

### OneSignal (push at scale)
- Free tier covers most B2C apps; paid tiers add segmentation and analytics.
- Wraps FCM + APNs + Web Push under one SDK and dashboard.
- Use when you need a push product fast and don't already have Novu/Knock for routing.

### FCM / APNs (the primitives)
- Use directly when you have a small number of push events and want zero vendor lock-in.
- Volume comes with operational cost (token registration, retry, deliverability). At any meaningful scale, route through Novu/Knock/OneSignal.

---

## Decision axes

1. **What's the surface?** Toast → Sonner. Inbox → Novu/Knock. Push → OneSignal/FCM/APNs.
2. **OSS vs managed?** Novu OSS. Knock and OneSignal SaaS. FCM/APNs are platform.
3. **Does product/marketing edit notifications?** Yes → Knock (visual workflow editor). No → Novu (code-defined).
4. **Multi-channel orchestration (email + push + in-app + SMS)?** Always Novu or Knock. Don't author per-channel logic in your product code.

---

## Starter (Sonner toaster)

```tsx
// app/layout.tsx (or root)
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
```

```tsx
// in any client component
'use client';
import { toast } from 'sonner';
import { saveDraft } from './actions';

export function SaveButton() {
  return (
    <button
      onClick={() =>
        toast.promise(saveDraft(), {
          loading: 'Saving…',
          success: 'Draft saved',
          error: (err) => `Couldn't save: ${err.message}`,
        })
      }
    >
      Save
    </button>
  );
}
```

The `toast.promise` pattern is the canonical "show feedback for an in-flight action": never roll a custom one when this exists.

## Starter (Novu in-app inbox)

```tsx
'use client';
import { Inbox } from '@novu/react';

export function NotificationBell({ subscriberId }: { subscriberId: string }) {
  return (
    <Inbox
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID!}
      subscriberId={subscriberId}
    />
  );
}
```

The `<Inbox />` renders the bell, the dropdown, marks-as-read, and the empty state. Trigger notifications from your backend via Novu's HTTP API or SDK; Novu fans out to in-app + email + push per the workflow you defined.

---

## Toast accessibility floor

- Toasts must be wrapped in an `aria-live` region (Sonner handles this: `polite` for success, `assertive` for errors).
- Auto-dismiss must be defeatable; either pause-on-hover/focus or expose a close button. Sonner has both.
- Don't put critical state-changing actions in a toast. Confirmations belong in a dialog (Radix Dialog), not a swipe-away.
- Reduced motion: Sonner respects `prefers-reduced-motion` by default: don't override the swipe animation.

---

## Choice tree

1. **You want feedback for the action that just happened in-page** → Sonner.
2. **You want a bell icon that lists past notifications, persisted server-side** → Novu (OSS) or Knock (SaaS).
3. **You want product/marketing to edit notifications without deploys** → Knock.
4. **You want Web Push / mobile push out today** → OneSignal (or Novu if you already have it).
5. **You're at the level where one vendor is constraining you** → use FCM / APNs directly through your own service.

---

## Common findings

> **[Should-refactor]** `src/components/Toast.tsx:1`: homemade toast component with no `aria-live` region. Replace with Sonner. See this guide §toast-accessibility-floor.

> **[Must-fix]** `src/features/notifications/handler.ts:1`: sends email, in-app, and push in three separate code paths. Migrate to a Novu/Knock workflow so channel logic lives outside product code. Cite the duplication.

> **[Should-refactor]** `package.json:50`: `react-toastify` (legacy aesthetic, slow updates). Migrate to Sonner.

---

## Handoffs

- **Worker / queue / fan-out infrastructure** for cross-channel delivery → `devops-worker-bee`. The notification *worker* (cron, webhook receiver, retry logic) is theirs. The *React surface* (Inbox component, toast call sites) is ours.
- **Email template authoring (MJML, React Email)** → out of scope; flag for `library-worker-bee` PRD if the design team needs templates.
- **Push token storage and rotation, auth posture** → `security-worker-bee`.
- **Notification copy / tone / cadence policy** → `ux-ui-svelte-worker-bee` for copy, product for cadence.
