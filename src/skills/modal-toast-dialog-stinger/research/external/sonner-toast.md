# Sonner Toast: External Source Note

**Source:** https://sonner.emilkowal.ski/
**Source type:** external/primary
**Authority:** authoritative
**Relevance:** high
**Topic:** Sonner toast API and production patterns, 2026

## Key findings

### What Sonner is
Sonner is an opinionated toast component for React. It exposes a `toast()` imperative API and a `<Toaster>` declarative host component. It does NOT use React context or Redux; the `toast()` function dispatches to the `<Toaster>` via a micro-pub-sub.

### Setup
```tsx
// _app.tsx or layout.tsx (place once, near the root)
import { Toaster } from 'sonner'
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  )
}
```

### Imperative API
```tsx
import { toast } from 'sonner'
toast('Event has been created')
toast.success('Changes saved')
toast.error('Something went wrong')
toast.loading('Saving...')
toast.promise(savePromise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
})
toast.dismiss(toastId)
```

### rich-colors mode
- `<Toaster richColors />` applies semantic colors (green success, red error, amber warning).
- Compatible with shadcn/ui themes but may need CSS variable overrides for custom palettes.
- In 2026 this is the recommended default for shadcn projects.

### Portal behavior
- `<Toaster>` creates its own portal in `document.body`.
- Does NOT conflict with Radix Dialog portal because both target `document.body`; stacking is managed by z-index (`<Toaster>` defaults to `z-index: 9999`).
- Adjust `<Toaster>` z-index if a full-screen overlay (e.g., a lightbox) sits above the default.

### ARIA / accessibility
- Each toast renders with `role="status"` (non-destructive) or `role="alert"` (error toasts).
- Screen readers announce toasts via live regions.
- Dismiss button has `aria-label="Close toast"`.
- Toast duration default: 4 seconds; adjust via `duration` prop.

### shadcn/ui integration
shadcn/ui ships a `Sonner` wrapper component that sets default styles matching the shadcn theme. Install via `npx shadcn@latest add sonner`.
