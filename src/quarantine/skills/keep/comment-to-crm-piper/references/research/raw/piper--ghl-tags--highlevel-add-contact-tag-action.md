# Add Contact Tag Workflow Action (HighLevel Support Portal)

- **Title:** Add Contact Tag Workflow Action in HighLevel
- **URL:** https://help.gohighlevel.com/support/solutions/articles/155000003111-workflow-action-add-contact-tag
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HighLevel / GoHighLevel vendor support portal)

## Extracted content

**Purpose of tags.** Tags group contacts for targeted communication and automation. They
drive segmentation, trigger workflows, feed personalization, and structure the database
across campaigns.

**Case sensitivity, stated explicitly in the vendor FAQ:**

> "Yes. 'Facebook' and 'facebook' would be treated as separate tags."

**Multiple tags per action:**

> "Yes. The Add Contact Tag action supports selecting as many tags as needed."

**Tag creation on the fly.** A tag can be created by typing a new name into the dropdown
and choosing "Add New Tag". It is created and applied immediately, and becomes available
for future workflows and manual tagging.

**Naming rules and limits.** Not published. No character limit, no reserved characters, no
maximum tag count per contact appears in this article.

## Claims this source supports

1. GoHighLevel tags are case sensitive. A skill that emits `Campaign-Aug-Launch` on one run
   and `campaign-aug-launch` on the next has silently created two segments. Tag casing must
   be pinned once and reused.
2. Tags are created implicitly on first use. There is no protective step where a typo is
   rejected, so a typo becomes a permanent orphan segment.
3. Multiple tags per contact are supported, so a campaign tag, a signal-type tag, and a
   source tag can coexist on one record.
