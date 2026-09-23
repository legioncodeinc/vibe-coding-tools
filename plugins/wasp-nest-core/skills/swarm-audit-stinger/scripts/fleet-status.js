#!/usr/bin/env node
// fleet-status.js: one-call status, stall detection, and coverage check for a Workflow run.
//
// Usage: node fleet-status.js <transcript-dir> [--stall-minutes 10] [--json] [--expect <dir>:<glob>]...
//   <transcript-dir>  the directory the Workflow tool reported at launch (journal.jsonl plus agent-*.jsonl)
//   --stall-minutes   minutes without transcript growth after which a running agent is STALLED (default 10)
//   --expect          repeatable; a directory and a simple glob (e.g. C:/scratch/lenses:*.md) whose files must exist.
//                     On Windows pass C:/ style paths here; Git Bash does not convert /c/ paths that contain a colon.
//   --json            machine-readable output
//
// Role thresholds (kill-at minutes) come from the single measured run and should be re-measured; see
// references/observer-protocol.md. Exit code 0 always; the observer decides what to do.
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dir = args[0];
if (!dir || !fs.existsSync(dir)) { console.error('usage: node fleet-status.js <transcript-dir> [--stall-minutes N] [--json] [--expect dir:glob]'); process.exit(0); }
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const stallMinutes = Number(opt('--stall-minutes', '10'));
const asJson = args.includes('--json');
const expects = []; args.forEach((a, i) => { if (a === '--expect' && args[i + 1]) expects.push(args[i + 1]); });

const THRESHOLDS = { investigate: 50, refute: 25, judge: 15, interpret: 25, critic: 40, gap: 40, revise: 40, editor: 40, other: 40 };

function roleOf(head) {
  if (/Your lens: /.test(head)) return 'investigate';
  if (/targeted gap investigator/.test(head)) return 'gap';
  if (/adversarial verifier/.test(head)) return 'refute';
  if (/judge for a disputed/.test(head)) return 'judge';
  if (/batch interpreter/.test(head)) return 'interpret';
  if (/completeness critic/.test(head)) return 'critic';
  if (/revising an audit report/.test(head)) return 'revise';
  if (/You are the editor/.test(head)) return 'editor';
  return 'other';
}

const journalPath = path.join(dir, 'journal.jsonl');
const journal = fs.existsSync(journalPath) ? fs.readFileSync(journalPath, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean) : [];
const started = journal.filter(j => j.type === 'started');
const results = new Set(journal.filter(j => j.type === 'result').map(j => j.agentId));
const failed = new Set(journal.filter(j => j.type === 'failed').map(j => j.agentId));
const now = Date.now();

const agents = fs.readdirSync(dir).filter(f => /^agent-.*\.jsonl$/.test(f)).map(f => {
  const id = f.replace(/^agent-|\.jsonl$/g, '');
  const full = path.join(dir, f);
  const stat = fs.statSync(full);
  const lines = fs.readFileSync(full, 'utf8').split('\n').filter(Boolean);
  let first = null, last = null, tools = 0, errs = 0, lastTool = '';
  for (const l of lines) {
    let j; try { j = JSON.parse(l); } catch (e) { continue; }
    if (j.timestamp) { if (!first) first = j.timestamp; last = j.timestamp; }
    const s = JSON.stringify(j);
    const m = s.match(/"type":"tool_use"/g); if (m) tools += m.length;
    if (/"is_error":true/.test(s)) errs++;
    const n = s.match(/"name":"([A-Za-z_]+)"/); if (m && n) lastTool = n[1];
  }
  let meta = {}; try { meta = JSON.parse(fs.readFileSync(full.replace('.jsonl', '.meta.json'), 'utf8')); } catch (e) {}
  const role = roleOf(lines.slice(0, 3).join(' '));
  const startMs = first ? Date.parse(first) : stat.birthtimeMs;
  const endMs = results.has(id) || failed.has(id) ? Date.parse(last || first) : now;
  const ageMin = Math.round((endMs - startMs) / 60000);
  const sinceWriteMin = Math.round((now - stat.mtimeMs) / 60000);
  const state = failed.has(id) ? 'FAILED' : results.has(id) ? 'DONE' : 'RUNNING';
  let flag = '';
  if (state === 'RUNNING') {
    if (sinceWriteMin >= stallMinutes) flag = 'STALLED(no growth ' + sinceWriteMin + 'm)';
    else if (ageMin >= (THRESHOLDS[role] || 40)) flag = 'STALLED(age ' + ageMin + 'm > ' + (THRESHOLDS[role] || 40) + 'm)';
  }
  return { id, role, model: meta.model || '?', state, ageMin, sinceWriteMin, tools, errs, lastTool, flag, sizeKB: Math.round(stat.size / 1024) };
});

const byRole = {};
for (const a of agents) { (byRole[a.role] = byRole[a.role] || []).push(a); }
const roleStats = Object.entries(byRole).map(([role, list]) => {
  const done = list.filter(a => a.state === 'DONE').map(a => a.ageMin).sort((x, y) => x - y);
  const median = done.length ? done[Math.floor(done.length / 2)] : null;
  return { role, total: list.length, done: done.length, running: list.filter(a => a.state === 'RUNNING').length, failed: list.filter(a => a.state === 'FAILED').length, medianMin: median, maxMin: done.length ? done[done.length - 1] : null, stalled: list.filter(a => a.flag).length };
});

const missing = [];
for (const e of expects) {
  const idx = e.lastIndexOf(':'); if (idx < 0) continue;
  const d = e.slice(0, idx), glob = e.slice(idx + 1);
  const re = new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  const present = fs.existsSync(d) ? fs.readdirSync(d).filter(f => re.test(f)) : [];
  missing.push({ dir: d, glob, present: present.length });
}

const firstStart = agents.map(a => a).length ? Math.min(...agents.map(a => Date.parse(fs.readFileSync(path.join(dir, 'agent-' + a.id + '.jsonl'), 'utf8').split('\n').find(Boolean) ? JSON.parse(fs.readFileSync(path.join(dir, 'agent-' + a.id + '.jsonl'), 'utf8').split('\n').find(Boolean)).timestamp || 0 : 0) || now)) : now;
const elapsedMin = Math.round((now - firstStart) / 60000);
const summary = { transcriptDir: dir, started: started.length, results: results.size, failed: failed.size, running: agents.filter(a => a.state === 'RUNNING').length, stalled: agents.filter(a => a.flag).length, elapsedMin, roleStats, stalledAgents: agents.filter(a => a.flag), failedAgents: agents.filter(a => a.state === 'FAILED'), expected: missing };

if (asJson) { console.log(JSON.stringify(summary, null, 1)); process.exit(0); }
console.log('fleet: started=' + summary.started + ' done=' + summary.results + ' failed=' + summary.failed + ' running=' + summary.running + ' stalled=' + summary.stalled + ' elapsed=' + elapsedMin + 'm');
console.log('role'.padEnd(12) + 'total'.padStart(6) + 'done'.padStart(6) + 'run'.padStart(5) + 'fail'.padStart(5) + 'stall'.padStart(6) + '  median/max min');
for (const r of roleStats) console.log(r.role.padEnd(12) + String(r.total).padStart(6) + String(r.done).padStart(6) + String(r.running).padStart(5) + String(r.failed).padStart(5) + String(r.stalled).padStart(6) + '  ' + (r.medianMin == null ? '-' : r.medianMin) + '/' + (r.maxMin == null ? '-' : r.maxMin));
if (summary.failedAgents.length) { console.log('\nFAILED (re-dispatch required):'); summary.failedAgents.forEach(a => console.log('  ' + a.id + ' ' + a.role + ' ' + a.model + ' tools=' + a.tools + ' errs=' + a.errs)); }
if (summary.stalledAgents.length) { console.log('\nSTALLED (stop, re-brief, resume):'); summary.stalledAgents.forEach(a => console.log('  ' + a.id + ' ' + a.role + ' ' + a.model + ' age=' + a.ageMin + 'm lastWrite=' + a.sinceWriteMin + 'm ago lastTool=' + a.lastTool + ' ' + a.flag)); }
if (missing.length) { console.log('\nEXPECTED OUTPUTS:'); missing.forEach(m => console.log('  ' + m.dir + ' ' + m.glob + ' present=' + m.present)); }
