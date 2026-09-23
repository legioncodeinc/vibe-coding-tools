# Screen Brief: {{Screen Name}}

> Section of the UX/UI masterplan. Anchors to [`../00-design-brief.md` §{{N}}](../00-design-brief.md).
> Feeds PRD **{{feature-code}}** (if applicable).

## Layout skeleton

Mobile:

```
┌─────────────────────────────────────┐
│ {{top element}}                     │
├─────────────────────────────────────┤
│ {{primary content}}                 │
│                                     │
├─────────────────────────────────────┤
│ {{bottom element}}                  │
└─────────────────────────────────────┘
```

Desktop: {{"identical to mobile" OR a separate ASCII skeleton}}.

## Components used

- [`../03-components/{{component-1}}.md`](../03-components/{{component-1}}.md): {{role on this screen}}.
- [`../03-components/{{component-2}}.md`](../03-components/{{component-2}}.md): {{role}}.
- [`../03-components/{{component-3}}.md`](../03-components/{{component-3}}.md): {{role}}.

## Responsive behavior

- Mobile (< 768px): {{layout + any collapsed nav behavior}}.
- Desktop (>= 768px): {{changes vs mobile}}.
- Wide (>= 1440px): {{cap, centering, or additional columns}}.

## States

- **Empty / zero-state:** {{what shows when no data}}.
- **Loading:** {{skeleton or spinner spec}}.
- **Error:** {{fallback surface}}.
- **Populated:** {{the happy path, already in the skeleton}}.

## Edge cases

- {{long names, many items, zero items, extreme wide screens}}.

## Accessibility

- Landmarks: {{`<nav>`, `<main>`, `<aside>` mapping}}.
- Focus order: {{what Tab hits first, last, modal trap behavior}}.
- Skip links: {{needed? to where?}}.

## Replaces (in current code)

{{list file(s) this supersedes, or "N/A, greenfield"}}

## Change history

- {{YYYY-MM-DD}}: Authored.
