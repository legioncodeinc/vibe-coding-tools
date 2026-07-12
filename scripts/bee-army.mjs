#!/usr/bin/env node

import {
  closeSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, openSync,
  readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { basename, dirname, join, relative, sep } from "node:path";
import { parseFrontmatter } from "./frontmatter.mjs";

const HOME = process.env.BEE_ARMY_HOME || homedir();
const CODEX_HOME = process.env.CODEX_HOME || join(HOME, ".codex");
const CLAUDE_HOME = process.env.CLAUDE_HOME || join(HOME, ".claude");
const CURSOR_HOME = process.env.CURSOR_HOME || join(HOME, ".cursor");
const SHARED_SKILLS = process.env.AGENTS_HOME || join(HOME, ".agents", "skills");
const STATE_ROOT = process.env.BEE_ARMY_STATE_ROOT || join(HOME, ".local", "share", "that-git-life");
const SOURCE_ROOT = join(STATE_ROOT, "upstream");
const MANIFEST_PATH = join(STATE_ROOT, "manifest.json");
const BACKUPS_ROOT = join(STATE_ROOT, "backups");
const LOCK_PATH = join(STATE_ROOT, "update.lock");
const PENDING_PATH = join(STATE_ROOT, "pending-update.json");
const UPSTREAM_URL = process.env.BEE_ARMY_UPSTREAM_URL || "https://github.com/legioncodeinc/that-git-life.git";
const UPSTREAM_BRANCH = process.env.BEE_ARMY_UPSTREAM_BRANCH || "main";
const GIT_TIMEOUT_MS = positiveInteger(process.env.BEE_ARMY_GIT_TIMEOUT_MS, 180_000);
const LOCK_STALE_MS = positiveInteger(process.env.BEE_ARMY_LOCK_STALE_MS, 900_000);
const BACKUP_RETENTION = positiveInteger(process.env.BEE_ARMY_BACKUP_RETENTION, 3);
const TEXT_EXTENSIONS = new Set([".md", ".mdc", ".txt", ".json", ".yaml", ".yml", ".toml", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".sh", ".py", ".css", ".html"]);

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
function fail(message) { throw new Error(message); }
function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: GIT_TIMEOUT_MS, ...options }).trim();
}
function ensureSource() {
  mkdirSync(STATE_ROOT, { recursive: true });
  if (!existsSync(join(SOURCE_ROOT, ".git"))) run("git", ["clone", "--branch", UPSTREAM_BRANCH, UPSTREAM_URL, SOURCE_ROOT]);
}
function fetchUpstream() {
  ensureSource();
  run("git", ["-C", SOURCE_ROOT, "fetch", "origin", UPSTREAM_BRANCH, "--prune"]);
  return run("git", ["-C", SOURCE_ROOT, "rev-parse", `origin/${UPSTREAM_BRANCH}`]);
}
function checkoutCommit(commit) {
  if (run("git", ["-C", SOURCE_ROOT, "status", "--porcelain"])) fail(`Managed upstream checkout is dirty: ${SOURCE_ROOT}`);
  run("git", ["-C", SOURCE_ROOT, "switch", "--detach", commit]);
}
function loadManifest() { return existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) : null; }
function writeJsonAtomic(path, value) {
  const temporary = `${path}.bee-army-new`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n");
  renameSync(temporary, path);
}
function sha256File(path) { return createHash("sha256").update(readFileSync(path)).digest("hex"); }
function sha256Text(text) { return createHash("sha256").update(text).digest("hex"); }
function walkFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  visit(root);
  return files.sort();
}
function extension(path) {
  const name = basename(path);
  const index = name.lastIndexOf(".");
  return index === -1 ? "" : name.slice(index);
}
function isText(path) { return TEXT_EXTENSIONS.has(extension(path)) || basename(path) === "SKILL.md"; }
function pairedStinger(agentName, body, skillRoot) {
  const explicit = body.match(/(?:\.cursor\/|\.claude\/|\.\.\/|\/Users\/[^\s`)]*\/(?:\.cursor|\.claude)\/)skills\/([^/`\s)]+)/)?.[1];
  const inferred = agentName.replace(/-worker-bee$/, "-stinger");
  const name = explicit || inferred;
  if (!name || !existsSync(join(skillRoot, name, "SKILL.md"))) fail(`Bee ${agentName} does not resolve to an existing paired Stinger (tried ${name || "none"})`);
  return name;
}
function replaceHarnessPaths(text, harness) {
  const skillRoot = harness === "claude" ? join(CLAUDE_HOME, "skills") : harness === "codex" ? SHARED_SKILLS : ".cursor/skills";
  const agentRoot = harness === "claude" ? join(CLAUDE_HOME, "agents") : harness === "codex" ? join(CODEX_HOME, "agents") : ".cursor/agents";
  let output = text
    .replace(/\/Users\/[^/\s`)]*\/\.cursor\/skills/g, skillRoot)
    .replace(/\/Users\/[^/\s`)]*\/\.claude\/skills/g, skillRoot)
    .replaceAll(".cursor/skills", skillRoot).replaceAll(".claude/skills", skillRoot)
    .replace(/\/Users\/[^/\s`)]*\/\.cursor\/agents/g, agentRoot)
    .replace(/\/Users\/[^/\s`)]*\/\.claude\/agents/g, agentRoot)
    .replaceAll(".cursor/agents", agentRoot).replaceAll(".claude/agents", agentRoot)
    .replaceAll("ai-tools/skills/", `${skillRoot}/`);
  if (harness === "codex") {
    output = output
      .replaceAll("../skills/", `${skillRoot}/`)
      .replaceAll("Use the Task tool at the main agent level.", "Use Codex native subagents from the main agent level.")
      .replaceAll("Cursor cannot reliably nest-spawn.", "Keep all spawning at the root and do not nest subagents.")
      .replaceAll("Cursor-specific", "canonical").replaceAll("Cursor skill", "Codex skill")
      .replaceAll("Cursor orchestrator", "Codex orchestrator").replaceAll("invoke the Bee", "spawn the Bee").replaceAll("Invoke the Bee", "Spawn the Bee")
      .replace(/> You are `<bee-name>`\. Before doing anything else, read your paired Stinger at `[^`]+` in full and follow it as your operating manual\. Then:/,
        `> You are \`<bee-name>\`. Before doing anything else, read your native Bee definition at \`${agentRoot}/<bee-name>.toml\` in full. Then read your paired Stinger at \`${skillRoot}/<stinger-name>/SKILL.md\` in full and follow both as your operating manual. Then:`)
      .replace(/\]\(\.\.\/\.\.\/\.\.\/agents\/([^)]+)\.md\)/g, `](${agentRoot}/$1.toml)`);
  }
  return output;
}
function addOutput(outputs, stageRoot, harness, target, content, source) {
  const stagePath = join(stageRoot, "files", sha256Text(target).slice(0, 20));
  mkdirSync(dirname(stagePath), { recursive: true });
  writeFileSync(stagePath, content);
  outputs.push({ harness, target, stagePath, source, hash: sha256File(stagePath) });
}
function addCopiedTree(outputs, stageRoot, harness, sourceRoot, targetRoot, transformText = false) {
  for (const sourcePath of walkFiles(sourceRoot)) {
    const target = join(targetRoot, relative(sourceRoot, sourcePath));
    if (transformText && isText(sourcePath)) addOutput(outputs, stageRoot, harness, target, replaceHarnessPaths(readFileSync(sourcePath, "utf8"), harness), relative(SOURCE_ROOT, sourcePath));
    else {
      const stagePath = join(stageRoot, "files", sha256Text(target).slice(0, 20));
      mkdirSync(dirname(stagePath), { recursive: true });
      copyFileSync(sourcePath, stagePath);
      outputs.push({ harness, target, stagePath, source: relative(SOURCE_ROOT, sourcePath), hash: sha256File(stagePath) });
    }
  }
}
function launcherSkill(commandPath, skillName) {
  const parsed = parseFrontmatter(readFileSync(commandPath, "utf8"), commandPath, { requireName: false });
  const body = replaceHarnessPaths(parsed.body, "codex").replaceAll("/the-beekeeper", "$the-beekeeper").replaceAll("/the-smoker", "$the-smoker");
  return `---\nname: ${skillName}\ndescription: ${JSON.stringify(parsed.fields.description)}\n---\n\n# ${skillName}\n\n${body.trim()}\n`;
}
function updateInstructions(harness) {
  const invocation = harness === "codex" ? "$bee-army-update" : "/bee-army-update";
  const frontmatter = harness === "codex"
    ? `name: bee-army-update\ndescription: Manage the global That Git Life Bee Army shared by Codex, Claude Code, and Cursor.`
    : `description: Check, preview, update, diagnose, or roll back the global That Git Life Bee Army shared by Codex, Claude, and Cursor.`;
  return `---\n${frontmatter}\n---\n\n# ${invocation}\n\nUse the deterministic global \`bee-army\` command. Run \`check\` and \`preview\` before \`update --apply\`. Use \`validate\` to stage translations without installing, \`doctor\` after installation, and \`rollback --apply\` only with explicit authorization. The command updates all three global harnesses together and must never create project-local scaffolding.\n`;
}
function generateStage(commit) {
  const stageRoot = mkdtempSync(join(STATE_ROOT, "stage-"));
  const outputs = [];
  const cursorRoot = join(SOURCE_ROOT, ".cursor");
  const sourceSkills = join(cursorRoot, "skills");
  const sourceAgents = join(cursorRoot, "agents");
  const sourceCommands = join(cursorRoot, "commands");
  const agentFiles = readdirSync(sourceAgents).filter((name) => name.endsWith(".md")).sort();
  const skillDirs = readdirSync(sourceSkills, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const usableSkills = skillDirs.filter((name) => existsSync(join(sourceSkills, name, "SKILL.md")));
  if (!agentFiles.length || !usableSkills.length) fail("Upstream contains no usable Bee Army assets");
  const beeNames = new Set();
  for (const file of agentFiles) {
    const sourcePath = join(sourceAgents, file);
    const parsed = parseFrontmatter(readFileSync(sourcePath, "utf8"), sourcePath);
    if (beeNames.has(parsed.fields.name)) fail(`Duplicate Bee name: ${parsed.fields.name}`);
    beeNames.add(parsed.fields.name);
    pairedStinger(parsed.fields.name, parsed.body, sourceSkills);
  }

  addCopiedTree(outputs, stageRoot, "cursor", sourceAgents, join(CURSOR_HOME, "agents"));
  addCopiedTree(outputs, stageRoot, "cursor", sourceSkills, join(CURSOR_HOME, "skills"));
  addCopiedTree(outputs, stageRoot, "cursor", sourceCommands, join(CURSOR_HOME, "commands"));
  addOutput(outputs, stageRoot, "cursor", join(CURSOR_HOME, "commands", "bee-army-update.md"), updateInstructions("cursor"), "generated:bee-army-update");
  if (existsSync(join(cursorRoot, "rules"))) addCopiedTree(outputs, stageRoot, "cursor", join(cursorRoot, "rules"), join(CURSOR_HOME, "rules"));
  if (existsSync(join(cursorRoot, "model-comparison-matrix.md"))) addOutput(outputs, stageRoot, "cursor", join(CURSOR_HOME, "model-comparison-matrix.md"), readFileSync(join(cursorRoot, "model-comparison-matrix.md")), ".cursor/model-comparison-matrix.md");

  addCopiedTree(outputs, stageRoot, "claude", sourceSkills, join(CLAUDE_HOME, "skills"));
  addCopiedTree(outputs, stageRoot, "claude", sourceAgents, join(CLAUDE_HOME, "agents"), true);
  addCopiedTree(outputs, stageRoot, "claude", sourceCommands, join(CLAUDE_HOME, "commands"), true);
  addOutput(outputs, stageRoot, "claude", join(CLAUDE_HOME, "commands", "bee-army-update.md"), updateInstructions("claude"), "generated:bee-army-update");
  if (existsSync(join(cursorRoot, "model-comparison-matrix.md"))) addOutput(outputs, stageRoot, "claude", join(CLAUDE_HOME, "model-comparison-matrix.md"), readFileSync(join(cursorRoot, "model-comparison-matrix.md")), ".cursor/model-comparison-matrix.md");

  addCopiedTree(outputs, stageRoot, "codex", sourceSkills, SHARED_SKILLS, true);
  for (const file of agentFiles) {
    const sourcePath = join(sourceAgents, file);
    const parsed = parseFrontmatter(readFileSync(sourcePath, "utf8"), sourcePath);
    const stinger = pairedStinger(parsed.fields.name, parsed.body, sourceSkills);
    const instructions = [`You are ${parsed.fields.name}.`, `Before doing anything else, read your paired Stinger at ${join(SHARED_SKILLS, stinger, "SKILL.md")} in full and follow it as your operating manual.`, "Stay within the scope assigned by the parent Beekeeper. Return a concise result and verification evidence to the parent thread.", "", replaceHarnessPaths(parsed.body, "codex").trim(), ""].join("\n");
    const toml = [`name = ${JSON.stringify(parsed.fields.name)}`, `description = ${JSON.stringify(parsed.fields.description)}`, `developer_instructions = ${JSON.stringify(instructions)}`, ""].join("\n");
    addOutput(outputs, stageRoot, "codex", join(CODEX_HOME, "agents", `${parsed.fields.name}.toml`), toml, relative(SOURCE_ROOT, sourcePath));
  }
  for (const skillName of ["the-beekeeper", "the-smoker"]) addOutput(outputs, stageRoot, "codex", join(SHARED_SKILLS, skillName, "SKILL.md"), launcherSkill(join(sourceCommands, `${skillName}.md`), skillName), `.cursor/commands/${skillName}.md`);
  addOutput(outputs, stageRoot, "codex", join(CODEX_HOME, "skills", "bee-army-update", "SKILL.md"), updateInstructions("codex"), "generated:bee-army-update");
  validateStage(outputs, agentFiles.length);
  return { stageRoot, outputs, commit, agentCount: agentFiles.length, skillCount: skillDirs.length, usableSkillCount: usableSkills.length };
}
function validateStage(outputs, agentCount) {
  const targets = new Set();
  for (const output of outputs) {
    if (targets.has(output.target)) fail(`Duplicate generated target: ${output.target}`);
    targets.add(output.target);
  }
  const codexAgentRoot = `${join(CODEX_HOME, "agents")}${sep}`;
  const codexAgents = outputs.filter((item) => item.harness === "codex" && item.target.startsWith(codexAgentRoot) && item.target.endsWith(".toml"));
  if (codexAgents.length !== agentCount) fail(`Expected ${agentCount} Codex agents, generated ${codexAgents.length}`);
  for (const agent of codexAgents) {
    const content = readFileSync(agent.stagePath, "utf8");
    for (const field of ["name =", "description =", "developer_instructions ="]) if (!content.includes(field)) fail(`Generated agent missing ${field}: ${agent.target}`);
    if (content.includes(".cursor/skills") || content.includes(".claude/skills")) fail(`Generated agent retains foreign skill path: ${agent.target}`);
  }
  for (const launcher of ["the-beekeeper", "the-smoker"]) {
    const item = outputs.find((entry) => entry.target === join(SHARED_SKILLS, launcher, "SKILL.md"));
    if (!item || !readFileSync(item.stagePath, "utf8").match(/spawn|dispatch/i)) fail(`Missing or invalid Codex launcher: ${launcher}`);
  }
  const suit = outputs.find((entry) => entry.target === join(SHARED_SKILLS, "beekeeper-suit", "SKILL.md"));
  if (!suit || !readFileSync(suit.stagePath, "utf8").includes("read your native Bee definition")) fail("Codex Beekeeper arming contract does not load the native Bee definition");
}
function assertManagedFilesUnchanged(manifest) {
  if (!manifest) return;
  const changed = manifest.files.filter((entry) => !existsSync(entry.target) || sha256File(entry.target) !== entry.hash).map((entry) => entry.target);
  if (changed.length) fail(`Managed files changed outside the updater. Refusing to overwrite:\n${changed.slice(0, 20).join("\n")}${changed.length > 20 ? `\n...and ${changed.length - 20} more` : ""}`);
}
function safeBackupName(path) { return relative(HOME, path).split(sep).join("__"); }
function backupRootFor(backupId) {
  if (!backupId || basename(backupId) !== backupId) fail(`Invalid backup ID: ${backupId || "missing"}`);
  return join(BACKUPS_ROOT, backupId);
}
function loadPending() {
  if (!existsSync(PENDING_PATH)) return null;
  try { return JSON.parse(readFileSync(PENDING_PATH, "utf8")); }
  catch { fail(`Pending update record is invalid: ${PENDING_PATH}`); }
}
function clearPending(backupId) {
  const pending = loadPending();
  if (!pending || pending.backupId === backupId) rmSync(PENDING_PATH, { force: true });
}
function recoverPendingBackup() {
  const pending = loadPending();
  if (!pending) return null;
  if (loadManifest()?.backupId === pending.backupId) {
    clearPending(pending.backupId);
    return null;
  }
  const backupRoot = backupRootFor(pending.backupId);
  restoreBackup(backupRoot);
  return pending.backupId;
}
function pruneBackups() {
  if (!existsSync(BACKUPS_ROOT)) return;
  const protectedIds = new Set([loadManifest()?.backupId, loadPending()?.backupId].filter(Boolean));
  const backups = readdirSync(BACKUPS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(BACKUPS_ROOT, entry.name, "backup.json")))
    .map((entry) => entry.name)
    .sort()
    .reverse();
  const keep = new Set([...backups.slice(0, BACKUP_RETENTION), ...protectedIds]);
  for (const backupId of backups) if (!keep.has(backupId)) rmSync(join(BACKUPS_ROOT, backupId), { recursive: true, force: true });
}
function applyStage(stage, previousManifest) {
  assertManagedFilesUnchanged(previousManifest);
  mkdirSync(BACKUPS_ROOT, { recursive: true });
  const backupId = new Date().toISOString().replace(/[:.]/g, "-");
  const backupRoot = backupRootFor(backupId);
  mkdirSync(backupRoot, { recursive: true });
  const priorTargets = new Map((previousManifest?.files || []).map((entry) => [entry.target, entry]));
  const nextTargets = new Set(stage.outputs.map((entry) => entry.target));
  const records = [];
  for (const target of new Set([...priorTargets.keys(), ...nextTargets])) {
    const existed = existsSync(target);
    const backupPath = existed ? join(backupRoot, "files", safeBackupName(target)) : null;
    if (existed) { mkdirSync(dirname(backupPath), { recursive: true }); copyFileSync(target, backupPath); }
    records.push({ target, existed, backupPath });
  }
  writeJsonAtomic(join(backupRoot, "backup.json"), { createdAt: new Date().toISOString(), previousManifest, records });
  writeJsonAtomic(PENDING_PATH, { backupId, createdAt: new Date().toISOString() });
  try {
    for (const target of priorTargets.keys()) if (!nextTargets.has(target) && existsSync(target)) rmSync(target, { force: true });
    for (const output of stage.outputs) {
      mkdirSync(dirname(output.target), { recursive: true });
      const temporary = `${output.target}.bee-army-new`;
      copyFileSync(output.stagePath, temporary);
      renameSync(temporary, output.target);
    }
    const manifest = { schemaVersion: 1, upstream: UPSTREAM_URL, branch: UPSTREAM_BRANCH, commit: stage.commit, installedAt: new Date().toISOString(), agentCount: stage.agentCount, skillCount: stage.skillCount, usableSkillCount: stage.usableSkillCount, backupId, files: stage.outputs.map(({ harness, target, source, hash }) => ({ harness, target, source, hash })) };
    writeJsonAtomic(MANIFEST_PATH, manifest);
    clearPending(backupId);
    pruneBackups();
    return manifest;
  } catch (error) { restoreBackup(backupRoot); throw error; }
}
function restoreBackup(backupRoot) {
  const recordPath = join(backupRoot, "backup.json");
  if (!existsSync(recordPath)) fail(`Backup record not found: ${recordPath}`);
  const backup = JSON.parse(readFileSync(recordPath, "utf8"));
  for (const record of backup.records) {
    if (record.existed) { mkdirSync(dirname(record.target), { recursive: true }); copyFileSync(record.backupPath, record.target); }
    else if (existsSync(record.target)) rmSync(record.target, { force: true });
  }
  if (backup.previousManifest) writeJsonAtomic(MANIFEST_PATH, backup.previousManifest);
  else rmSync(MANIFEST_PATH, { force: true });
  clearPending(basename(backupRoot));
}
function doctor(manifest = loadManifest()) {
  if (!manifest) fail("Bee Army is not installed by this manager");
  const problems = [];
  const counts = { claude: 0, cursor: 0, codex: 0 };
  for (const entry of manifest.files) {
    counts[entry.harness] = (counts[entry.harness] || 0) + 1;
    if (!existsSync(entry.target)) problems.push(`missing ${entry.target}`);
    else if (sha256File(entry.target) !== entry.hash) problems.push(`modified ${entry.target}`);
  }
  const codexAgents = manifest.files.filter((entry) => entry.harness === "codex" && entry.target.startsWith(`${join(CODEX_HOME, "agents")}${sep}`) && entry.target.endsWith(".toml")).length;
  if (codexAgents !== manifest.agentCount) problems.push(`expected ${manifest.agentCount} Codex agents, found ${codexAgents}`);
  if (problems.length) fail(`Bee Army doctor failed:\n${problems.slice(0, 30).join("\n")}`);
  console.log(JSON.stringify({ ok: true, commit: manifest.commit, agents: manifest.agentCount, skillDirectories: manifest.skillCount, usableSkills: manifest.usableSkillCount, managedFiles: manifest.files.length, filesByHarness: counts }, null, 2));
}
function status() {
  const manifest = loadManifest();
  console.log(JSON.stringify(manifest ? { installed: true, commit: manifest.commit, installedAt: manifest.installedAt, agents: manifest.agentCount, skillDirectories: manifest.skillCount, usableSkills: manifest.usableSkillCount, managedFiles: manifest.files.length, backupId: manifest.backupId } : { installed: false, upstream: UPSTREAM_URL }, null, 2));
}
function check() {
  const manifest = loadManifest();
  const latest = fetchUpstream();
  console.log(JSON.stringify({ installed: manifest?.commit || null, latest, updateAvailable: manifest?.commit !== latest }, null, 2));
}
function preview() {
  const manifest = loadManifest();
  const latest = fetchUpstream();
  if (!manifest) return void console.log(`Bee Army is not installed. Latest upstream commit: ${latest}`);
  if (manifest.commit === latest) return void console.log(`Already current at ${latest}`);
  let diff;
  try { diff = run("git", ["-C", SOURCE_ROOT, "diff", "--name-status", manifest.commit, latest, "--", ".cursor"]); }
  catch { diff = "Unable to calculate the file diff; the installed commit may no longer be present locally."; }
  console.log(`Installed: ${manifest.commit}\nLatest:    ${latest}\n\n${diff || "No .cursor asset changes"}`);
}
function update(apply) {
  if (!apply) fail("Refusing to apply without --apply. Run preview first.");
  const latest = fetchUpstream();
  checkoutCommit(latest);
  const stage = generateStage(latest);
  try { doctor(applyStage(stage, loadManifest())); }
  finally { rmSync(stage.stageRoot, { recursive: true, force: true }); }
}
function validateUpdate() {
  const latest = fetchUpstream();
  checkoutCommit(latest);
  const stage = generateStage(latest);
  try {
    const counts = { claude: 0, cursor: 0, codex: 0 };
    for (const entry of stage.outputs) counts[entry.harness] += 1;
    console.log(JSON.stringify({ ok: true, commit: latest, agents: stage.agentCount, skillDirectories: stage.skillCount, usableSkills: stage.usableSkillCount, generatedFiles: stage.outputs.length, filesByHarness: counts }, null, 2));
  } finally { rmSync(stage.stageRoot, { recursive: true, force: true }); }
}
function rollback(apply) {
  if (!apply) fail("Refusing to roll back without --apply");
  const manifest = loadManifest();
  const backupId = loadPending()?.backupId || manifest?.backupId;
  if (!backupId) fail("No rollback backup is recorded");
  restoreBackup(backupRootFor(backupId));
  console.log(JSON.stringify({ ok: true, restoredBackup: backupId, currentCommit: loadManifest()?.commit || null }, null, 2));
}
function processIsActive(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error?.code === "EPERM"; }
}
function removeStaleLock() {
  let metadata = null;
  try { metadata = JSON.parse(readFileSync(LOCK_PATH, "utf8")); } catch {}
  const age = Date.now() - statSync(LOCK_PATH).mtimeMs;
  if (metadata && processIsActive(metadata.pid)) return false;
  if (!metadata && age < LOCK_STALE_MS) return false;
  rmSync(LOCK_PATH, { force: true });
  return true;
}
function withLock(fn, { recover = true } = {}) {
  mkdirSync(STATE_ROOT, { recursive: true });
  let fd;
  const token = randomUUID();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      fd = openSync(LOCK_PATH, "wx");
      writeFileSync(fd, JSON.stringify({ pid: process.pid, token, createdAt: new Date().toISOString() }) + "\n");
      break;
    } catch (error) {
      if (error?.code !== "EEXIST" || attempt > 0 || !removeStaleLock()) fail(`Another Bee Army operation appears active: ${LOCK_PATH}`);
    }
  }
  try {
    if (recover) recoverPendingBackup();
    return fn();
  } finally {
    closeSync(fd);
    try {
      const current = JSON.parse(readFileSync(LOCK_PATH, "utf8"));
      if (current.token === token) rmSync(LOCK_PATH, { force: true });
    } catch {}
  }
}
function main() {
  const [command = "status", ...args] = process.argv.slice(2);
  const apply = args.includes("--apply");
  if (command === "status") status();
  else if (command === "check") withLock(check);
  else if (command === "preview") withLock(preview);
  else if (command === "validate") withLock(validateUpdate);
  else if (command === "doctor") doctor();
  else if (command === "update" || command === "install") withLock(() => update(apply));
  else if (command === "rollback") withLock(() => rollback(apply), { recover: false });
  else fail(`Unknown command: ${command}`);
}
try { main(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
