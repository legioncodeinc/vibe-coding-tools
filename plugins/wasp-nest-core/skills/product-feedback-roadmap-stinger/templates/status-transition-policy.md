# Status Transition Policy

A template for documenting your product's feedback status policy. Adapt and drop into Notion, Confluence, or your team wiki.

---

# [Product Name] Feature Request Status Policy

**Owner:** [PM Name]  
**Last updated:** [Date]  
**Applies to:** All customer-submitted feature requests in [Platform: Canny / Featurebase / Userback / etc.]

---

## Status definitions

| Status | Meaning | Customer-visible? | SLA |
|--------|---------|-----------------|-----|
| `Under Review` | Received and being evaluated | Yes | Decision within 30 days |
| `Planned` | Committed to building | Yes | — |
| `In Progress` | Actively being built | Yes | — |
| `Shipped` | Live in the product | Yes | — |
| `Not Planned` | Decided not to build | Yes | — |

---

## Status transition rules

### Under Review → Planned

**Entry condition:** Product leadership has committed this request to the roadmap.  
**Required action:** Assign a target milestone (internal; need not be public-facing date).  
**Customer notification:** Yes. Template:

> "[Feature name] is now on our roadmap! We're targeting [quarter / milestone]. We'll update you when it goes into development."

---

### Under Review → Not Planned

**Entry condition:** Product leadership has decided not to build this request.  
**Required fields:** A public reason (1-3 sentences). Cannot be blank.  
**Customer notification:** Yes. Template:

> "After consideration, we've decided not to build [Feature name] at this time. Reason: [1-3 sentences]. We appreciate your input — if our direction changes, we'll revisit."

---

### Planned → In Progress

**Entry condition:** Active development sprint has begun.  
**Customer notification:** [Yes / No — team decision]. If yes, template:

> "[Feature name] is now in development! We'll let you know when it ships."

---

### In Progress → Shipped

**Entry condition:** Feature is live in production for the customers who requested it.  
**Customer notification:** Yes. This is the most important notification.  
**Required fields:** Changelog link or release notes URL.  
Template:

> "[Feature name] is now live! [One sentence on how to use/access it]. [Link to changelog]. You asked for this — thank you."

---

## 30-day SLA

Every request that has been in "Under Review" for more than 30 days requires a decision: move to `Planned` or `Not Planned`.

**Weekly audit:** Run the "Over 30 days in Under Review" filter in [Platform] every Monday. Triage during sprint planning.

---

## De-duplication rule

Before scoring any request, run the de-duplication check. Requests that are duplicates of an existing canonical request must be merged. See de-duplication guide.

**Merge rule:** The canonical record is the most clearly stated, most upvoted, or earliest version. All votes transfer to the canonical record on merge.

---

*Adapted from the product-feedback-roadmap-stinger playbook.*
