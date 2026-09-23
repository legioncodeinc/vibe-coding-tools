# Example: Embedded Signup Walkthrough — Loops + Next.js App Router

*This example demonstrates `guides/01-embedded-signup.md` Pattern A for a SaaS product.*

## Scenario

User says: "I'm building a SaaS app with Next.js 15. I want to add a newsletter signup on my landing page. I already use Resend for transactional emails but want a separate newsletter list."

## Angel's response pattern

**Classify the use case.** SaaS product, transactional email already handled (Resend), wants a newsletter list. This is a product-led email scenario (Use Case B). The user is NOT trying to monetize the newsletter itself.

**Recommendation: Loops** (not Beehiiv — no ad/monetization need; Loops unifies transactional + newsletter for SaaS)

**Step 1: Account setup**
1. Sign up at loops.so — free tier covers 1,000 contacts.
2. Go to Settings → Domain → Add your domain (e.g., `yourdomain.com`).
3. Add the DNS records Loops provides: 3x CNAME, 1x MX, 2x TXT. Wait 1-6 hours for propagation. Verify in Loops.
4. Copy your API key: Loops → Settings → API Key.

**Step 2: Environment variables**
```bash
# .env.local
LOOPS_API_KEY=your-api-key-here
```

**Step 3: Route handler**
```
src/app/api/subscribe/route.ts
```
Use the code from `guides/01-embedded-signup.md` Pattern A (Loops implementation). Key points:
- `export const runtime = "edge"` — runs at the edge for lowest latency
- Pass `source` parameter to track which page drove the signup
- Handle 409 (already subscribed) as a success — idempotent

**Step 4: Form component**
```
components/newsletter-form.tsx
```
Use the React form component from `guides/01-embedded-signup.md`. Drop it on the landing page:
```tsx
// In your landing page component
<NewsletterForm source="landing-page-hero" />
```

**Step 5: Production checklist**
- [ ] Domain verified in Loops before first send
- [ ] `LOOPS_API_KEY` added to Vercel/production environment variables
- [ ] Rate limiting added (see `guides/01-embedded-signup.md` rate limiting section)
- [ ] Test the signup form end-to-end in development (`NODE_ENV=development` will call Loops API)
- [ ] Check Loops dashboard to confirm contacts are appearing with correct `source` values

**References:** `guides/01-embedded-signup.md`, `guides/00-platform-selection.md` (Use Case B)
