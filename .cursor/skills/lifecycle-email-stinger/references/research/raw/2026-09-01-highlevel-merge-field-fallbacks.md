# HighLevel merge fields and fallback values

- URL: https://help.gohighlevel.com/support/solutions/articles/48001078171-list-of-merge-fields
- Fetched: 2026-09-04
- Published or updated: 2026-09-01
- Date provenance: the page displays `Modified on: Tue, 1 Sep, 2026 at 5:39 AM`
- Source type: official-product-docs
- Window status: in-window

## Captured evidence

HighLevel documents merge fields for contacts, assigned users, appointments, calendars, campaign events, messages, and business identity. It warns that a missing saved value can render as a blank space and recommends a fallback value or conditional content for greetings.

The page recommends inserting the field available in the account's picker and testing the populated output in the context where the message will run.

## Transfer limits

- This source documents HighLevel's merge behavior, not a portable placeholder syntax for every platform.
- A fallback keeps syntax readable but cannot make an unsupported personal claim true. Omit an unverified sentence instead of filling it with guessed data.
- This stinger uses neutral braces such as `{first_name}` in drafts. Platform implementation must map and test them separately.

