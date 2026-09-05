# Example: SaaS Platform Qualification for a 2,000-MAU Startup

A worked walkthrough of the qualification checklist (`guides/01-platform-selection.md`) applied to a real-world scenario.

---

## Context

A 4-person B2B SaaS startup (CRM tool, $29-$99/month plans) has 2,000 MAUs, is growing at 15% month-over-month, and wants to add:
1. A 3-step onboarding tour for new users.
2. An activation checklist with 4 items.
3. Segment-specific tours (one for "free trial" users, one for "paid" users).

They use React + Tailwind + Emotion for styling (CSS-in-JS → `data-tour` anchors required).

---

## Qualification checklist answers

1. **MAU count:** 2,000 today → ~8,000 in 12 months (15% MoM growth).
2. **Budget ceiling:** $300-$500/month.
3. **Engineering involvement:** 2 engineers available; would prefer no-code UI for the growth PM to manage tour content without engineering involvement.
4. **CSS-in-JS:** Yes (Emotion). `data-tour` attributes are mandatory.

---

## Decision matrix application

| Tool | Monthly cost at 2K MAU | Checklist included? | No-code UI? | Segment targeting? | Verdict |
|---|---|---|---|---|---|
| Userpilot | $299/month (analytics included) | Yes | Yes | Yes | **Qualified** |
| Userflow | $240/month Startup | Yes | Yes (visual builder) | Yes | **Qualified** |
| Appcues Essentials | $249/month | No, requires $879 Growth | Yes | Limited on Essentials | **Not qualified** (checklist locked to $879 tier) |
| Pendo | Enterprise pricing | Yes | Yes | Yes | **Not qualified** (over budget) |
| Driver.js + Shepherd.js | Free | No (custom build required) | No | Custom code required | **Conditionally qualified** (if team can accept engineering overhead) |

---

## Analysis

**Appcues is eliminated immediately**: the checklist requirement (item 2) is locked to the $879 Growth tier. The Essentials plan at $249 does not include checklists.

**Pendo** requires enterprise pricing; over the $500 ceiling.

**Driver.js / Shepherd.js** would require the growth PM to depend on an engineer for every tour update. The "no-code UI for PM autonomy" requirement eliminates this path unless the team explicitly accepts that tradeoff.

**Userpilot vs. Userflow:** Both qualified on the core requirements.

| Factor | Userpilot | Userflow |
|---|---|---|
| Price at 2K MAU | $299 (all-in with analytics) | $240 (no analytics) |
| Price at 8K MAU (in 12 months) | Same $299 (flat pricing, not MAU-based per plan) | Same $240 (Startup tier cap TBC at 8K MAU, verify) |
| G2 rating | 4.6/5 | 4.8/5 |
| Analytics included | Yes: avoids adding Mixpanel/Amplitude separately | No: team needs separate analytics |
| Team seats | Unlimited | 3 on Startup plan |
| Segment targeting | Yes | Yes |
| Checklist | Yes | Yes |

**Winner: Userpilot**: at $299 including analytics, it is cheaper than Userflow ($240) + a basic analytics tool ($50+). The team saves on tool sprawl. Userpilot's flat pricing also means the $299 cost holds through 8K MAU growth, while Userflow's Startup tier caps at 3 seats (may require an upgrade at team headcount growth).

---

## Recommended output

```
Platform: Userpilot (Starter, $299/month billed annually)
Integration: Add data-tour attributes to all targeted elements before building any tour.
  See guides/06-maintenance-and-drift.md for the data-tour registry template.
Tours to build:
  1. Free-trial onboarding (3 steps): trigger on first dashboard visit for trial users.
  2. Paid activation (3 steps): trigger after free→paid upgrade event.
  3. Activation checklist (4 items): persistent panel on dashboard.
Segment logic: Use Userpilot's built-in segment builder (user.plan attribute).
Analytics: Use Userpilot's built-in product analytics (saves Mixpanel/Amplitude budget).
```
