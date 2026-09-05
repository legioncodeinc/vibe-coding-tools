# Guide 06: Data Export Discipline

GDPR compliance, conversation history export, platform export paths, and the day-1 data export setup checklist. Read `guides/00-principles.md` Principle 3 (data-export setup on day one) before this guide.

---

## Why data export is a day-one concern

Teams that defer data export setup face these consequences:
1. **Platform lock-in.** After 12 months of conversation history, switching platforms requires exporting, transforming, and re-importing thousands of conversations. Every platform uses a different format.
2. **GDPR Article 20 requests.** A customer can request a machine-readable copy of all their personal data you hold, including support conversations. If you have no export path, fulfilling the request requires a manual platform support ticket — which can take days.
3. **Drift migration (urgent, 2026).** Drift customers must export conversation data before the sunset completes. No published hard deadline, but data export windows typically close with platform shutdowns.

---

## GDPR Article 20: Data Portability

Article 20 grants data subjects the right to receive their personal data "in a structured, commonly used and machine-readable format." For support conversations this means:

- **Scope:** All conversation history, contact records, and notes where the customer is identified.
- **Format:** JSON or CSV (both are "machine-readable"; prefer JSON for structure).
- **Timeline:** 30 days from request date (GDPR Article 12(3)).
- **Self-service preferred:** If your platform offers self-service export, document the path. Manual support tickets burn response budget.

---

## Platform-specific export capabilities

### Intercom

| Export type | Method | Format |
|---|---|---|
| Conversation history | UI: Settings → Data → Export | CSV (limited) |
| Full conversation data | API: `GET /export/content/data` | JSON |
| Contact/company data | UI: Contacts → Export | CSV |
| S3 continuous export | Data Export feature (Advanced plan) | JSON (S3) |
| GDPR data deletion | API: `DELETE /contacts/{id}` | N/A |

**Best practice:** Set up the S3 continuous export on day one. This gives you a running archive in your own bucket, independent of Intercom's retention limits, and makes GDPR requests trivial (query the archive).

### Crisp

Crisp supports conversation export via:
- **UI:** Crisp Dashboard → Settings → Export Data (zip file with JSON conversations).
- **API:** `GET /website/{website_id}/conversations` (REST, paginated).

Contact data is exportable as CSV from the Contacts view. Check Crisp's GDPR settings (Dashboard → Settings → GDPR) for a "Delete user data" flow.

### Plain

Plain's GraphQL API provides full access to all conversation data:
```graphql
query {
  threads(
    filters: { customerIdentifier: { emailAddress: "user@company.com" } }
    first: 100
  ) {
    edges { node { id createdAt messages { edges { node { text } } } } }
  }
}
```

Data deletion uses the `deleteCustomer` mutation. Plain's API-first architecture makes GDPR requests straightforward: build a one-off script that queries all threads for a given email and exports them as JSON.

### Pylon

Pylon exports via Slack (conversations live in Slack Connect channels) and via Pylon's export API. Confirm with Pylon support for the exact export endpoints — as of May 2026, per-customer data export steps were not fully documented in public docs.

### Help Scout

Help Scout exports via:
- **Reports → Export** for conversation summaries (CSV).
- **API:** `GET /v2/conversations` for full conversation history (JSON).
- **GDPR:** Help Scout's "Customers" area allows deleting a customer record and all associated conversations.

---

## Day-1 data export setup checklist

Run this before or immediately after going live on any support platform.

- [ ] **Confirm export format.** Test a conversation export manually. Confirm the output format (CSV or JSON) and whether it includes full message bodies.
- [ ] **Set up continuous export (if available).** Intercom's S3 export, or a scheduled API-based export script.
- [ ] **Document the GDPR request path.** Write a one-paragraph internal SOP: "When we receive a GDPR Article 20 request, here's how to export that customer's data within 30 days."
- [ ] **Test GDPR deletion.** Create a test contact, initiate deletion, verify the contact and conversations are removed.
- [ ] **Set a retention policy.** Decide how long to keep conversation history. Most SaaS: 3 years active, archive after. Some platforms auto-delete; confirm.
- [ ] **Notify legal/compliance.** Forward the "what data does our support tool hold" summary to whoever owns your privacy policy.

---

## Analytics pipeline (optional but recommended)

For teams that want to track support metrics in their own analytics stack (Mixpanel, PostHog, Amplitude):

1. **Use platform webhooks** to stream `conversation.created`, `conversation.resolved`, and `message.sent` events.
2. **Transform and forward** to your analytics tool (via Segment or a lightweight Next.js API Route).
3. **Key metrics to track:** First Response Time (FRT), Time to Resolution (TTR), AI deflection rate, CSAT score.

Avoid relying solely on the platform's built-in reports — they cannot be queried alongside your product analytics and often lack the segmentation needed for cohort analysis.
