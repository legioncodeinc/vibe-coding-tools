# Example: Vercel Cron Happy Path

*Demonstrates: guides/00-cron-expression-syntax.md, guides/01-platform-limits.md, guides/05-observability-monitoring.md*

---

## Scenario

A Next.js (App Router) application on Vercel Pro needs a daily job that cleans up expired sessions at 2 AM UTC. Requirements:
- Runs once per day at 2 AM UTC
- Uses CRON_SECRET for security
- Pings Healthchecks.io on start, success, and failure
- Handler is idempotent

---

## 1. `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-sessions",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Plain English: fires every day at 02:00 UTC.

---

## 2. API Route (`app/api/cron/cleanup-sessions/route.ts`)

```typescript
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { lt } from "drizzle-orm";

const HEALTHCHECK_URL = process.env.HEALTHCHECK_CLEANUP_URL;

export async function GET(request: Request) {
  // 1. Validate CRON_SECRET
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Signal job start to Healthchecks.io
  if (HEALTHCHECK_URL) {
    await fetch(`${HEALTHCHECK_URL}/start`).catch(() => {});
  }

  try {
    // 3. Idempotency: use today's date as the run identifier
    const today = new Date().toISOString().slice(0, 10); // "2026-05-20"
    const lockKey = `cleanup-sessions-${today}`;

    const existing = await db.query.jobRuns.findFirst({
      where: (r, { eq }) => eq(r.jobRunId, lockKey),
    });
    if (existing?.status === "completed") {
      console.log(`Cleanup for ${today} already ran. Skipping.`);
      if (HEALTHCHECK_URL) await fetch(HEALTHCHECK_URL).catch(() => {});
      return new Response("Already ran", { status: 200 });
    }

    // 4. Register run
    await db.insert(jobRuns).values({ jobRunId: lockKey, status: "running" })
      .onConflictDoNothing();

    // 5. Do the work
    const result = await db.delete(sessions)
      .where(lt(sessions.expiresAt, new Date()))
      .returning({ count: sessions.id });

    console.log(`Deleted ${result.length} expired sessions`);

    // 6. Mark complete
    await db.update(jobRuns)
      .set({ status: "completed", completedAt: new Date() })
      .where((r, { eq }) => eq(r.jobRunId, lockKey));

    // 7. Signal success
    if (HEALTHCHECK_URL) await fetch(HEALTHCHECK_URL).catch(() => {});
    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Cleanup job failed:", err);
    // Signal failure
    if (HEALTHCHECK_URL) await fetch(`${HEALTHCHECK_URL}/fail`).catch(() => {});
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

---

## 3. Environment variables

```env
CRON_SECRET=your-random-secret-here-min-32-chars
HEALTHCHECK_CLEANUP_URL=https://hc-ping.com/your-check-uuid
```

Set both in Vercel's environment variables dashboard.

---

## Key patterns demonstrated

- CRON_SECRET validation (security, `guides/01-platform-limits.md`)
- Healthchecks.io start/success/fail signals (`guides/05-observability-monitoring.md`)
- Idempotency key using today's date (`guides/02-distributed-cron-correctness.md`)
- Plain-English expression comment (`guides/00-cron-expression-syntax.md`)
