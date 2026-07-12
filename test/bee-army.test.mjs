import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(repo, "scripts", "bee-army.mjs");

function run(home, ...args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: repo,
    encoding: "utf8",
    env: {
      ...process.env,
      BEE_ARMY_HOME: home,
      BEE_ARMY_UPSTREAM_URL: repo,
      BEE_ARMY_UPSTREAM_BRANCH: "main",
    },
  });
}

test("installs the full hive globally without project scaffolding", { timeout: 120_000 }, () => {
  const home = mkdtempSync(join(tmpdir(), "bee-army-home-"));
  const project = mkdtempSync(join(tmpdir(), "bee-army-project-"));
  try {
    const validation = JSON.parse(run(home, "validate"));
    assert.equal(validation.ok, true);
    assert.equal(validation.agents, 85);
    assert.equal(validation.skillDirectories, 91);
    assert.equal(validation.usableSkills, 90);

    run(home, "install", "--apply");
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

    const manifest = JSON.parse(readFileSync(join(home, ".local", "share", "that-git-life", "manifest.json"), "utf8"));
    assert.equal(manifest.agentCount, 85);
    assert.ok(manifest.files.every((entry) => entry.target.startsWith(home)));

    const originalBee = readFileSync(terminalBee, "utf8");
    writeFileSync(terminalBee, `${originalBee}\n# local edit\n`);
    assert.throws(() => run(home, "update", "--apply"), /Managed files changed outside the updater/);
    writeFileSync(terminalBee, originalBee);

    run(home, "rollback", "--apply");
    assert.equal(JSON.parse(run(home, "status")).installed, false);
    assert.equal(existsSync(terminalBee), false);
  } finally {
    rmSync(home, { recursive: true, force: true });
    rmSync(project, { recursive: true, force: true });
  }
});
