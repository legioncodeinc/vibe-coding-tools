import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "../scripts/frontmatter.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(repo, "scripts", "bee-army.mjs");
const upstreamBranch = "main"; // The CLI and official upstream both define main as the supported default.
const {
  CODEX_HOME: _codexHome,
  CLAUDE_HOME: _claudeHome,
  CURSOR_HOME: _cursorHome,
  AGENTS_HOME: _agentsHome,
  BEE_ARMY_STATE_ROOT: _stateRoot,
  ...isolatedEnv
} = process.env;

function run(home, ...args) {
  return runIn(home, repo, ...args);
}

function runIn(home, cwd, ...args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...isolatedEnv,
      BEE_ARMY_HOME: home,
      BEE_ARMY_UPSTREAM_URL: repo,
      BEE_ARMY_UPSTREAM_BRANCH: upstreamBranch,
      BEE_ARMY_BACKUP_RETENTION: "3",
    },
  });
}

test("folds multiline frontmatter descriptions", () => {
  const parsed = parseFrontmatter("---\nname: example-worker-bee\ndescription: >\n  First line\n  second line\n---\nBody\n", "example.md");
  assert.equal(parsed.fields.description, "First line second line");
  assert.equal(parsed.body, "Body\n");
});

test("installs the full hive globally without project scaffolding", { timeout: 120_000 }, () => {
  const home = mkdtempSync(join(tmpdir(), "bee-army-home-"));
  const project = mkdtempSync(join(tmpdir(), "bee-army-project-"));
  try {
    const validation = JSON.parse(run(home, "validate"));
    assert.equal(validation.ok, true);
    assert.equal(validation.agents, 85);
    assert.equal(validation.skillDirectories, 91);
    assert.equal(validation.usableSkills, 90);

    runIn(home, project, "install", "--apply");
    const diagnosis = JSON.parse(run(home, "doctor"));
    assert.equal(diagnosis.ok, true);
    assert.equal(diagnosis.agents, 85);
    const terminalBee = join(home, ".codex", "agents", "terminal-bash-worker-bee.toml");
    assert.ok(existsSync(terminalBee));
    assert.ok(existsSync(join(home, ".agents", "skills", "terminal-bash-stinger", "SKILL.md")));
    assert.ok(existsSync(join(home, ".agents", "skills", "the-beekeeper", "SKILL.md")));
    assert.ok(existsSync(join(home, ".codex", "skills", "bee-army-update", "SKILL.md")));
    assert.ok(existsSync(join(home, ".claude", "commands", "bee-army-update.md")));
    assert.ok(existsSync(join(home, ".cursor", "commands", "bee-army-update.md")));
    assert.equal(existsSync(join(project, ".codex")), false);
    assert.equal(existsSync(join(project, ".agents")), false);
    assert.equal(existsSync(join(project, "AGENTS.md")), false);

    const stateRoot = join(home, ".local", "share", "that-git-life");
    const manifestPath = join(stateRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    assert.equal(manifest.agentCount, 85);
    assert.ok(manifest.files.every((entry) => entry.target.startsWith(home)));

    const lockPath = join(stateRoot, "update.lock");
    writeFileSync(lockPath, JSON.stringify({ pid: process.pid, token: "active", createdAt: new Date().toISOString() }));
    assert.throws(() => run(home, "check"), /Another Bee Army operation appears active/);
    rmSync(lockPath);
    writeFileSync(lockPath, JSON.stringify({ pid: 99999999, token: "stale", createdAt: new Date(0).toISOString() }));
    run(home, "check");
    assert.equal(existsSync(lockPath), false);

    const crashBackupId = "9999-12-31T23-59-59-999Z";
    const crashBackupRoot = join(stateRoot, "backups", crashBackupId);
    const crashBackupFile = join(crashBackupRoot, "files", "terminal-bash-worker-bee.toml");
    mkdirSync(join(crashBackupRoot, "files"), { recursive: true });
    copyFileSync(terminalBee, crashBackupFile);
    writeFileSync(join(crashBackupRoot, "backup.json"), JSON.stringify({ previousManifest: manifest, records: [{ target: terminalBee, existed: true, backupPath: crashBackupFile }] }));
    writeFileSync(join(stateRoot, "pending-update.json"), JSON.stringify({ backupId: crashBackupId, createdAt: new Date().toISOString() }));
    writeFileSync(terminalBee, "partial interrupted update");
    run(home, "update", "--apply");
    assert.equal(existsSync(join(stateRoot, "pending-update.json")), false);
    assert.match(readFileSync(terminalBee, "utf8"), /terminal-bash-worker-bee/);
    assert.ok(readdirSync(join(stateRoot, "backups")).length <= 3);

    const originalBee = readFileSync(terminalBee, "utf8");
    writeFileSync(terminalBee, `${originalBee}\n# local edit\n`);
    assert.throws(() => run(home, "update", "--apply"), /Managed files changed outside the updater/);
    writeFileSync(terminalBee, originalBee);

    run(home, "rollback", "--apply");
    assert.equal(JSON.parse(run(home, "status")).installed, true);
    run(home, "rollback", "--apply");
    assert.equal(JSON.parse(run(home, "status")).installed, false);
    assert.equal(existsSync(terminalBee), false);
  } finally {
    rmSync(home, { recursive: true, force: true });
    rmSync(project, { recursive: true, force: true });
  }
});
