/**
 * scripts/coach-routing-audit.ts
 *
 * Operational audit — pulls recent AiTrace rows of traceType: "routing"
 * (or all chat_turn rows if routing isn't traced yet — the recurring gap pattern),
 * computes routing accuracy via evaluateRouting(), flags below 90%.
 *
 * Run:
 *   pnpm tsx .cursor/skills/mind-stinger/scripts/coach-routing-audit.ts \
 *     --tenantId=<id> --window=7d
 *   # window options: 24h | 7d | 30d
 *
 * Output: markdown table per coach type with:
 *   - call count
 *   - routing-correct rate (from AiTrace.routingCorrect)
 *   - top 3 misroutes (most common wrong→better pairs)
 *
 * Source-of-truth: library/knowledge-base/ai/observability-evaluation.md §3
 *                  guides/17-evaluation-discipline.md §1
 *
 * Routing accuracy target: > 90% (per guides/17-evaluation-discipline.md).
 */

interface AiTraceRow {
  agentTypeRouted: string;
  routingCorrect:  boolean | null;
  routingReason:   string | null;
  userQuery:       string;
  createdAt:       Date;
}

interface PerCoachStats {
  coach:        string;
  total:        number;
  graded:       number;          // rows with non-null routingCorrect
  correctCount: number;
  accuracy:     number;          // correctCount / graded
  misroutes:    Map<string, number>;  // "betterRoute" → count
}

async function pullTraces(tenantId: string, since: Date): Promise<AiTraceRow[]> {
  // Replace with actual prisma client; this is a skeleton.
  return await (globalThis as any).prisma.aiTrace.findMany({
    where: {
      tenantId,
      createdAt: { gte: since },
      // traceType: "routing",  // when routing-call tracing is added
    },
    select: {
      agentTypeRouted: true,
      routingCorrect:  true,
      routingReason:   true,
      userQuery:       true,
      createdAt:       true,
    },
  });
}

function aggregate(traces: AiTraceRow[]): PerCoachStats[] {
  const byCoach = new Map<string, PerCoachStats>();
  for (const t of traces) {
    const stats = byCoach.get(t.agentTypeRouted) ?? {
      coach:        t.agentTypeRouted,
      total:        0,
      graded:       0,
      correctCount: 0,
      accuracy:     NaN,
      misroutes:    new Map<string, number>(),
    };
    stats.total++;
    if (t.routingCorrect != null) {
      stats.graded++;
      if (t.routingCorrect) stats.correctCount++;
      else if (t.routingReason) {
        // routingReason is expected to be { better_route } in the misroute case
        const m = /better[_ ]?route["':\s]*([a-z_]+)/i.exec(t.routingReason);
        if (m) {
          const r = m[1];
          stats.misroutes.set(r, (stats.misroutes.get(r) ?? 0) + 1);
        }
      }
    }
    byCoach.set(t.agentTypeRouted, stats);
  }
  for (const s of byCoach.values()) {
    s.accuracy = s.graded > 0 ? s.correctCount / s.graded : NaN;
  }
  return [...byCoach.values()].sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0));
}

function renderReport(stats: PerCoachStats[], since: Date): string {
  const lines: string[] = [];
  lines.push(`# Coach Routing Audit\n`);
  lines.push(`Run: ${new Date().toISOString()}`);
  lines.push(`Window: since ${since.toISOString()}\n`);

  lines.push(`## Per-coach accuracy\n`);
  lines.push(`| Coach | Total | Graded | Correct | Accuracy | Below 90%? |`);
  lines.push(`|---|---|---|---|---|---|`);
  for (const s of stats) {
    const acc = isFinite(s.accuracy) ? (s.accuracy * 100).toFixed(1) + "%" : "n/a";
    const flag = isFinite(s.accuracy) && s.accuracy < 0.9 ? "🚨" : "";
    lines.push(`| ${s.coach} | ${s.total} | ${s.graded} | ${s.correctCount} | ${acc} | ${flag} |`);
  }

  lines.push(`\n## Top misroutes per coach\n`);
  for (const s of stats) {
    if (s.misroutes.size === 0) continue;
    const top3 = [...s.misroutes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    lines.push(`### ${s.coach}`);
    for (const [better, count] of top3) {
      lines.push(`- ${count}× should have routed to **${better}**`);
    }
    lines.push("");
  }

  const flagged = stats.filter(s => isFinite(s.accuracy) && s.accuracy < 0.9);
  lines.push(`## Conclusion\n`);
  if (flagged.length > 0) {
    lines.push(`🚨 ${flagged.length} coach type(s) below 90% routing accuracy: ${flagged.map(s => s.coach).join(", ")}.`);
    lines.push(`\nSee guides/17-evaluation-discipline.md §1 (target > 90%).`);
    lines.push(`Levers: (1) refine the routing classifier prompt in ai-coach-router.ts; (2) add disambiguation rules; (3) review coach descriptions in coach-architecture.md.`);
  } else {
    lines.push(`All coach types ≥ 90% routing accuracy. ✓`);
  }
  return lines.join("\n");
}

(async () => {
  const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, "").split("=")));
  if (!args.tenantId) { console.error("--tenantId required"); process.exit(2); }
  const window = args.window ?? "7d";
  const ms = window === "24h" ? 24 * 3600 * 1000 : window === "30d" ? 30 * 24 * 3600 * 1000 : 7 * 24 * 3600 * 1000;
  const since = new Date(Date.now() - ms);

  const traces = await pullTraces(args.tenantId, since);
  const stats  = aggregate(traces);
  console.log(renderReport(stats, since));

  const flagged = stats.filter(s => isFinite(s.accuracy) && s.accuracy < 0.9);
  process.exit(flagged.length);
})();

// Note: routing-call tracing is one of the recurring gap patterns. Until
// runOrchestrator() wraps routeToCoach() in traceAICall(), this script must
// fall back to chat_turn traces (where agentTypeRouted is populated by the
// downstream call). See guides/15-agent-orchestration.md §2.
