#!/usr/bin/env python3
"""Validate YAML frontmatter on every SKILL.md and every agent .md in this
plugin.

Checks, per the Agent Skills spec fields this plugin's queen-wasp-stinger
forge pipeline requires and the Cowork upload constraint documented
throughout this repo's SKILL.md files:

- Every skills/*/SKILL.md and skills/*/*/SKILL.md has frontmatter that
  parses as valid YAML, delimited by a leading and trailing "---" line.
- Skill frontmatter carries the six spec fields this repo standardizes on:
  name, description, license, compatibility, metadata. (allowed-tools is
  optional and not required here since none of these skills restrict it.)
- A skill's "description" field is at or under Cowork's 200-character
  upload cap.
- A skill's "name" field matches its own folder name (Cursor's requirement:
  a skill's name must equal its folder name).
- Every agents/*.md has frontmatter that parses as valid YAML.

Exit 0 with a summary when everything passes. Exit 1 and list every failure
otherwise.
"""
import os
import sys

import yaml

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESCRIPTION_CAP = 200
REQUIRED_SKILL_FIELDS = ("name", "description", "license", "compatibility", "metadata")


def read_frontmatter(path: str):
    with open(path, "r", encoding="utf-8") as fh:
        content = fh.read()
    if not content.startswith("---"):
        return None, "file does not start with a '---' frontmatter delimiter"
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, "could not find a closing '---' frontmatter delimiter"
    try:
        data = yaml.safe_load(parts[1])
    except yaml.YAMLError as exc:
        return None, f"YAML parse error: {exc}"
    if not isinstance(data, dict):
        return None, "frontmatter did not parse to a mapping"
    return data, None


def check_skill(skill_md_path: str, errors: list):
    folder_name = os.path.basename(os.path.dirname(skill_md_path))
    rel = os.path.relpath(skill_md_path, REPO_ROOT)
    data, err = read_frontmatter(skill_md_path)
    if err:
        errors.append(f"{rel}: {err}")
        return
    for field in REQUIRED_SKILL_FIELDS:
        if field not in data:
            errors.append(f"{rel}: missing required frontmatter field '{field}'")
    name = data.get("name")
    if name and name != folder_name:
        errors.append(f"{rel}: frontmatter name '{name}' does not match folder name '{folder_name}'")
    description = data.get("description")
    if isinstance(description, str) and len(description) > DESCRIPTION_CAP:
        errors.append(
            f"{rel}: description is {len(description)} chars, over the Cowork {DESCRIPTION_CAP}-char cap"
        )


def check_agent(agent_md_path: str, errors: list):
    rel = os.path.relpath(agent_md_path, REPO_ROOT)
    _, err = read_frontmatter(agent_md_path)
    if err:
        errors.append(f"{rel}: {err}")


def main() -> int:
    errors = []
    skills_dir = os.path.join(REPO_ROOT, "skills")
    agents_dir = os.path.join(REPO_ROOT, "agents")

    skill_count = 0
    if os.path.isdir(skills_dir):
        for name in sorted(os.listdir(skills_dir)):
            skill_md = os.path.join(skills_dir, name, "SKILL.md")
            if os.path.isfile(skill_md):
                skill_count += 1
                check_skill(skill_md, errors)

    agent_count = 0
    if os.path.isdir(agents_dir):
        for name in sorted(os.listdir(agents_dir)):
            if name.endswith(".md"):
                agent_count += 1
                check_agent(os.path.join(agents_dir, name), errors)

    if errors:
        print(f"Frontmatter check FAILED ({skill_count} skills, {agent_count} agents scanned):\n")
        for e in errors:
            print(f"  {e}")
        return 1

    print(f"Frontmatter check OK: {skill_count} skills and {agent_count} agents, all valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
