# SR-096: A CRM import skips records or maps fields incorrectly

## Use when

Use this response when an import skips records, completes with errors or warnings, omits unsupported items, or maps source fields to the wrong destination fields.

## Required evidence

- The source and target accounts and the import ID and time
- Source object types and expected versus completed counts
- Preserved error and warning exports
- A small set of representative affected record IDs
- Relevant source labels and internal names
- Intended destination field keys and current mapping
- Attachment expectations and the duplicate-handling setting
- Prior import effects and the desired recovery outcome

## Customer-facing email

**Subject:** {ticket_id}: Reviewing skipped records or field mapping in your import

Hi {customer_first_name},

Thanks for reporting that the import skipped records or mapped fields differently than expected. We will preserve the current results, classify the errors and warnings, and validate a small representative set before any production rerun.

Please reply with the source and target accounts, import ID and time, source object types, expected and completed counts, the error and warning exports, and a small set of representative affected record IDs. For mapping issues, include the relevant source labels and internal names, intended destination field keys, attachment expectations, and duplicate-handling setting.

Please redact private field values and do not send a full customer dataset or unrestricted export. Do not rerun the full import yet.

{agency} Support will separate record failures, mapping collisions, unsupported items, and warnings. When possible, we will validate the corrected mapping with a small representative set in a clean destination. A production rerun will wait until mapping, duplicate policy, prior effects, and a recovery plan are recorded.

{agent_name}
{agency} Support

## Agent notes

- Preserve the source records, import history, errors, and warnings.
- Request only representative record IDs and redacted field definitions, not the full dataset.
- Separate unsupported attachments from supported-field mapping failures.
- Test a small representative set in a clean destination when possible.
- Do not rerun production until mapping, duplicate handling, prior effects, and recovery are documented.

