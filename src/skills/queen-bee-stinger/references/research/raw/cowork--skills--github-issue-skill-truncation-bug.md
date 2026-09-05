# [Bug] Cowork "Save skill" install pipeline silently truncates SKILL.md files (GitHub issue)
- URL: https://github.com/anthropics/claude-code/issues/47016
- Fetched: 2026-08-14
- Source type: community
- Component: skills

State: closed (auto-closed as duplicate of #40231)
Author: alexbtrase
Created: 2026-04-12T15:05:19Z
Repository: anthropics/claude-code
Labels: duplicate, area:cowork, area:skills, platform:windows

## What's Wrong

The "Save skill" install button in Cowork silently truncates SKILL.md files during installation. The `.skill` package (zip) contains the complete file, but the version written to the read-only skills FUSE mount is shorter. No error is shown to the user.

**Environment:**
- Platform: Windows 11 (Microsoft Store version of Claude)
- Skills mount: read-only FUSE (ro,nosuid,nodev,relatime)

**Evidence (reproduced 3+ times):**

shared-trase-reference:
- Source file in /tmp: 192 lines, complete
- Inside .skill zip after packaging: 192 lines, complete
- After "Save skill" install: 178 lines, last line ends mid-word ("Alex's direc")

skill-creator-master:
- Source file: 500 lines, ends with "Good luck!"
- Inside .skill zip: 500 lines, complete
- After install: 482 lines, last line contains garbled character

**Key observations:**
- Truncation does NOT correlate with file size (33KB/485-line file installed fine, 16KB/192-line file truncated every time)
- Truncation is deterministic — repeated installs of the same package produce the same truncated result
- The FUSE mount also caches aggressively — manual repair via Windows filesystem doesn't immediately reflect in sessions
- Multiple other installed skills show truncation signs, suggesting this affects many installs
- Skills directory is read-only FUSE mount, so truncated files cannot be repaired from inside Cowork

## What Should Happen

The installed SKILL.md should be byte-for-byte identical to the SKILL.md inside the .skill zip package. If the install fails or produces a different file, an error should be surfaced to the user.

## Reproduction commands (run from inside a Cowork session)

```shell
$ wc -l /sessions/*/mnt/.claude/skills/shared-trase-reference/SKILL.md
178

$ tail -1 /sessions/*/mnt/.claude/skills/shared-trase-reference/SKILL.md
...traces to a primary source (email, transcript, Notion page, Slack message, or Alex's direc

$ # Verify the .skill zip is intact:
$ unzip -o pkg-shared-trase-reference.skill -d /tmp/verify/
$ wc -l /tmp/verify/pkg-shared-trase-reference/SKILL.md
192
```

## Steps to Reproduce

1. Create a SKILL.md file with 192 lines (~16KB)
2. Package it as a .skill zip using package_skill.py
3. Verify the zip is intact: unzip and check `wc -l` shows 192 lines
4. Click "Save skill" in the Cowork UI to install
5. From inside a session, run: `wc -l /sessions/*/mnt/.claude/skills/[skill-name]/SKILL.md`
6. Observe: line count is 178, not 192. Last line ends mid-word.
7. Re-verify the .skill zip: still shows 192 lines. Truncation happened during the install pipeline write.

## Environment details

Claude Code version: 2.1.92 (issue is in Cowork's install pipeline, not the CLI)
Platform: Windows
Terminal/Shell: PowerShell

## Workaround

Manually copy the correct SKILL.md to the Windows filesystem skills directory via PowerShell, then restart sessions to clear the FUSE cache.

Skills path on Windows: `C:\Users\[user]\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\[workspace-id]\[account-id]\skills\[skill-name]\SKILL.md`

This is a significant workflow disruption for power users with many custom skills — truncated skills silently degrade every session's output quality with no indication anything is wrong.

## Related issue referenced

- Referenced by issue #51435: "[BUG] Cowork: skill upload truncates files >99 KB and leaves null-byte tail on re-upload"
- Auto-closed as duplicate of #40231

## Why this is archived (technical substance note)

This issue is valuable primary evidence for the skills component because it independently confirms, from real user debugging: (1) the `.skill` file is a zip archive containing a `SKILL.md`; (2) Cowork sessions read installed skills from a mounted path under `/sessions/*/mnt/.claude/skills/<skill-name>/SKILL.md` inside the sandboxed session VM; (3) on Windows, the desktop app also stores a local copy of installed skills under `%LocalAppData%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\[workspace-id]\[account-id]\skills\[skill-name]\SKILL.md`; (4) the skills mount inside a Cowork session is read-only (FUSE, `ro,nosuid,nodev,relatime`) from the agent's perspective.
