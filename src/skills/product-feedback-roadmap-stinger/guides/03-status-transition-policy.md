# Guide 03: Status Transition Policy

The status model is the operational backbone of the feedback loop. A well-defined policy ensures every request has a predictable lifecycle, every status change triggers the right customer communication, and no request rots indefinitely in "under review."

## The canonical five-status model

```
Under Review → Planned → In Progress → Shipped
                ↘
                Not Planned
```

| Status | Meaning | Customer-visible? |
|--------|---------|-----------------|
| `Under Review` | Received and triaged; not yet decided | Yes |
| `Planned` | Committed to building; on the roadmap | Yes |
| `In Progress` | Currently being built | Yes |
| `Shipped` | Live in the product | Yes |
| `Not Planned` | Decided not to build; reason required | Yes |

> **Public status mapping:** Platforms like Userback support mapping many internal statuses to a simplified public label. For example, internal statuses "Design", "Dev", "QA" can all map to the public label "In Progress." Use this to keep internal workflow flexible without confusing customers with granular technical statuses.

## Entry and exit conditions

### Under Review

- **Entry:** Any new submission. Default status on creation.
- **SLA:** Decision (→ Planned, → Not Planned) within 30 days of submission. No request should stay in "Under Review" indefinitely.
- **Exit conditions:**
  - → `Planned` if the request is committed to the roadmap.
  - → `Not Planned` if the team has decided not to build it.
  - Remains in "Under Review" if still being evaluated (within the 30-day SLA).

### Planned

- **Entry:** Product leadership has committed to building this. A roadmap quarter or milestone is assigned (internal; not necessarily public).
- **Customer impact:** Voters are notified via status-change notification.
- **SLA:** Should move to "In Progress" within the committed quarter. If it slips, update the internal timeline; do NOT silently leave it as "Planned" for a second quarter without a comment.
- **Exit conditions:**
  - → `In Progress` when development begins.
  - → `Under Review` if de-prioritized (rare; add a comment explaining the change).

### In Progress

- **Entry:** Active development sprint or build cycle has begun.
- **Customer impact:** Voters are notified (optional; some teams skip this notification to reduce noise).
- **Exit conditions:**
  - → `Shipped` when the feature is live.

### Shipped

- **Entry:** Feature is live in production and available to the customers who requested it.
- **Customer impact:** This is the most important notification. Every voter should receive: a personalized email (or in-app notification) naming the feature and linking to the release notes or changelog.
- **Template:** See `templates/status-transition-policy.md` for the shipped notification template.
- **This status closes the loop.** A request marked Shipped with a notification to all voters is a complete feedback cycle.

### Not Planned

- **Entry:** Product leadership has decided not to build this request. A reason is required.
- **Why this status is non-negotiable:** Refusing to say "no" publicly causes backlogs to grow without bound and erodes trust when customers eventually discover their five-year-old request is still "under review." Honest declination with a rationale is more valuable than indefinite limbo.
- **Required fields on transition:** A public reason (1-3 sentences) explaining why the request is not being built. The reason can be strategic ("not in our core use case"), resource ("we cannot prioritize this in the next 12 months"), or market ("this is better served by an integration with X").
- **Customer impact:** Voters are notified with the reason included. Do not just flip the status; send the reason.
- **Template:** See `templates/status-transition-policy.md` for the Not Planned notification template.

## Customer notification templates

### Status → Planned

```
Subject: [Feature name] is on our roadmap!

Hi [First name],

Great news — [Feature name], which you requested, is now on our product roadmap.
We're planning to build this [in Q[X] / in the coming months / as part of our next major release].

We'll update you when it moves into development and again when it's live.

Thanks for helping shape [Product name],
[PM Name], [Company]
```

### Status → Shipped

```
Subject: [Feature name] is now live!

Hi [First name],

[Feature name] is now available in [Product name]. You can [one-sentence description of how to access/use it].

You requested this — and it's live because you (and [N] other customers) told us it mattered.

[Link to changelog / release notes]

Thanks for the feedback,
[PM Name], [Company]
```

### Status → Not Planned

```
Subject: Update on your [Feature name] request

Hi [First name],

Thank you for requesting [Feature name]. After careful consideration, we've decided not to build this
in the foreseeable future. Here's why: [1-3 sentence reason].

This wasn't an easy decision — [N] customers requested it. If our direction changes, we will revisit.

Your feedback shapes what we build, and we appreciate you taking the time.

[PM Name], [Company]
```

## 30-day SLA enforcement

Run a weekly audit query in your feedback platform: all requests in "Under Review" for > 30 days. This is the "decision backlog" — each item needs a Planned or Not Planned decision before the next sprint planning session.

A common pattern: triage the 30-day backlog as the first agenda item of weekly sprint planning. The PM or founder reviews each item, makes the decision, and triggers the appropriate notification.
