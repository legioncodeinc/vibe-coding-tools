/**
 * scripts/retrieval-precision-snapshot.ts
 *
 * Operational audit — pulls AiTrace.retrievalScore distribution over a window,
 * summarizes by tenant + coach, flags anything below 0.4 sustained.
 *
 * Run:
 *   pnpm tsx .cursor/skills/mind-stinger/scripts/retrieval-precision-snapshot.ts \
 *     --tenantId=<id> --window=7d
 *   # window options: 24h | 7d | 30d
 *
 * Output: markdown report with distribution histogram and per-coach breakdown.
 *
 * Source-of-truth: library/knowledge-base/ai/observability-evaluation.md §3
 *                  guides/17-evaluation-discipline.md §1
 *
 * Targets:
 *   > 0.7        healthy
 *   0.4 – 0.7    watch list
 *   < 0.4 sustained over 100 traces  → ALERT (flag retrieval config)
 */

interface AiTraceRow {
  agentTypeRouted: string;
  retrievalScore:  number | null;
  retrievalLatencyMs: number | null;
  knowledgeChunks: any;
  createdAt:       Date;
}

async function pullTraces(tenantId: string, since: Date): Promise<AiTraceRow[]> {
  return await (globalThis as any).prisma.aiTrace.findMany({
    where: {
      tenantId,
      createdAt:      { gte: since },
      retrievalScore: { not: null },
    },
    select: {
      agentTypeRouted:    true,
      retrievalScore:     true,
      retrievalLatencyMs: true,
      knowledgeChunks:    true,
      createdAt:          true,
    },
  });
}

function distribution(scores: number[]): { bucket: string; count: number }[] {
  const buckets = [
    { bucket: "0.9-1.0", lo: 0.9 },
    { bucket: "0.7-0.9", lo: 0.7 },
    { bucket: "0.4-0.7", lo: 0.4 },
    { bucket: "0.0-0.4", lo: 0.0 },
  ];
  const out = buckets.map(b => ({ bucket: b.bucket, count: 0 }));
  for (const s of scores) {
    for (let i = 0; i < buckets.length; i++) {
      if (s >= buckets[i].lo) { out[i].count++; break; }
    }
  }
  return out;
}

function p(values: number[], pct: number): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * pct);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function meanScore(scores: number[]): number {
  return scores.length === 0 ? NaN : scores.reduce((a, b) => a + b, 0) / scores.length;
}

function renderReport(traces: AiTraceRow[], since: Date): string {
  const lines: string[] = [];
  const allScores = traces.map(t => t.retrievalScore!).filter(s => s != null);

  lines.push(`# Retrieval Precision Snapshot\n`);
  lines.push(`Run: ${new Date().toISOString()}`);
  lines.push(`Window: since ${since.toISOString()}`);
  lines.push(`Total traces with retrievalScore: ${traces.length}\n`);

  lines.push(`## Overall distribution\n`);
  lines.push(`| Bucket | Count |`);
  lines.push(`|---|---|`);
  for (const d of distribution(allScores)) lines.push(`| ${d.bucket} | ${d.count} |`);

  lines.push(`\n## Aggregate stats\n`);
  lines.push(`- Mean: ${meanScore(allScores).toFixed(3)}`);
  lines.push(`- P50:  ${p(allScores, 0.5).toFixed(3)}`);
  lines.push(`- P25:  ${p(allScores, 0.25).toFixed(3)}`);
  lines.push(`- P05:  ${p(allScores, 0.05).toFixed(3)}\n`);

  // Per-coach breakdown
  const byCoach = new Map<string, number[]>();
  for (const t of traces) {
    const arr = byCoach.get(t.agentTypeRouted) ?? [];
    if (t.retrievalScore != null) arr.push(t.retrievalScore);
    byCoach.set(t.agentTypeRouted, arr);
  }
  lines.push(`## Per-coach mean\n`);
  lines.push(`| Coach | N | Mean | P25 | < 0.4? |`);
  lines.push(`|---|---|---|---|---|`);
  for (const [coach, scores] of [...byCoach.entries()].sort((a, b) => meanScore(a[1]) - meanScore(b[1]))) {
    const m = meanScore(scores);
    const p25 = p(scores, 0.25);
    const flag = isFinite(m) && m < 0.4 && scores.length >= 50 ? "🚨" : "";
    lines.push(`| ${coach} | ${scores.length} | ${m.toFixed(3)} | ${p25.toFixed(3)} | ${flag} |`);
  }

  // Conclusion
  const overallMean = meanScore(allScores);
  lines.push(`\n## Conclusion\n`);
  if (allScores.length >= 100 && overallMean < 0.4) {
    lines.push(`🚨 Sustained < 0.4 mean over ${allScores.length} traces. ALERT — retrieval configuration needs adjustment.`);
    lines.push(`\nLevers: (1) verify Cohere rerank-v3.5 is in the path; (2) check chunk size / overlap (currently 500 / 20%); (3) verify knowledge documents are actually indexed; (4) consider tuning HNSW ef_construct.`);
    lines.push(`See guides/08-rag-strategy.md and guides/10-cohere-embedding-and-rerank.md.`);
  } else if (overallMean < 0.7) {
    lines.push(`Watch list — mean ${overallMean.toFixed(3)} below 0.7 target.`);
    lines.push(`Track over the next week; if trend doesn't improve, investigate.`);
  } else {
    lines.push(`Healthy. Mean ${overallMean.toFixed(3)} ≥ 0.7 target. ✓`);
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
  console.log(renderReport(traces, since));

  const overallMean = meanScore(traces.map(t => t.retrievalScore!).filter(s => s != null));
  process.exit(traces.length >= 100 && overallMean < 0.4 ? 1 : 0);
})();
