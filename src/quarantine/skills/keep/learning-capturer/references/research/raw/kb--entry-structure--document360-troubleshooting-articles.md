# Troubleshooting articles (Document360 documentation)

- **URL:** https://docs.document360.com/docs/troubleshooting-articles
- **Fetched:** 2026-08-17
- **Source type:** official-docs (product documentation for a knowledge base platform)
- **Why archived:** This is the single most directly transferable source in the archive.
  It specifies the section order of a troubleshooting entry and, critically, it states the
  rule for phrasing the symptom so the entry is findable later. That rule is the whole
  retrieval story for a personal debugging knowledge base.

## Recommended structure

1. **Title**, naming the symptom
2. **Symptom description**, 1 to 2 sentences
3. **Cause**, where known
4. **Resolution**, numbered steps or sections split by cause
5. **If the issue persists**, escalation guidance
6. **Related articles**

## Which sections are mandatory

- Title and symptom description are essential.
- Cause is included "where known" and **omitted if unknown**. The template explicitly
  tolerates a missing cause rather than forcing a guess.
- Resolution with clear steps is mandatory.
- Escalation guidance for unresolved issues is expected.
- Related articles should be linked.

## The searchability rule

Quoted: "Use the reader's language. Titles and symptom descriptions should use the exact
error message text, the exact UI phrase, or the exact phrasing readers use in support
tickets."

Symptom descriptions should use "concrete, observable terms": what the reader sees, the
specific error message, or the missing result that sent them looking.

## Title rules

Titles should "name the symptom or error the reader is experiencing" and match how users
describe the problem. Worked examples given:

- "Users cannot log in after SSO configuration"
- "Articles not appearing in search results"
- "Import fails with 'Invalid file format' error"

For a family of related issues, use a category-level title such as "Troubleshooting login
issues."

## Additional writing guidance

- Order resolutions by likelihood. Most common fix first.
- Flag irreversible or risky steps with a warning callout.
- End each resolution with an explicit expected outcome.
- Keep a calm, blame-free tone.
