# Notifications & Toasts: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/19-notifications-and-toasts.md`

## Sources

From `cursor-subagent-research-combined.md` (Notifications & Toasts, ~line 1069):

- [Novu](https://novu.co/)
- [Knock](https://knock.app/)
- [OneSignal](https://onesignal.com/)
- [Sonner](https://sonner.emilkowal.ski/)
- [react-hot-toast](https://react-hot-toast.com/)
- [FCM (Firebase Cloud Messaging)](https://firebase.google.com/docs/cloud-messaging)

## Adjacent references

- APNs (Apple Push Notification service): https://developer.apple.com/documentation/usernotifications
- Novu `<Inbox />` React component: https://docs.novu.co/inbox/react
- Knock workflows (visual editor): https://docs.knock.app/concepts/workflows
- shadcn/ui toaster (built on Sonner): https://ui.shadcn.com/docs/components/sonner
- WAI-ARIA `aria-live` on transient messages: https://www.w3.org/WAI/ARIA/apg/practices/notifications/

## Cross-references

- `guides/13-ecosystem-catalog.md` does not cover notifications: this guide is additive.
- Worker / cron / queue infrastructure that fans out cross-channel notifications is handed off to `devops-worker-bee`.
- Push token storage / rotation / auth posture handed off to `security-worker-bee`.

## Notes

Central framing the guide adds beyond the source doc: notifications are **three different surfaces** (toast / inbox / OS push) that get conflated. Library choice changes by surface:
- Toast: Sonner (default), react-hot-toast (legacy).
- Inbox: Novu (OSS) or Knock (SaaS).
- OS push: OneSignal (managed) or FCM/APNs (direct).

`toast.promise` is highlighted as the canonical "feedback for in-flight action" pattern.

No new web_search_exa expansions performed.
