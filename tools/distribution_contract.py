"""Canonical v3 census shared by source and standalone public validators.

This module deliberately has no private build or source-checkout imports.
"""

EXPECTED_PLUGINS = frozenset({
    "wasp-nest-core", "website-audit-tools", "code-audit-tools", "documentation-tools",
    "web-development-tools", "backend-and-desktop-tools", "data-and-ai-tools",
    "platform-and-release-tools", "growth-and-customer-tools", "business-and-product-tools",
    "media-and-creative-tools", "browser-and-app-testing-tools", "highlevel",
    "littlebird-toolkit", "content-intelligence", "app-primer-zero",
    "developer-learning-tools", "software-economics-tools", "infrastructure-decision-tools",
    "repository-modernization-tools", "product-studio", "interstellar-coding",
})
CANONICAL_TOTALS = {"skill": 232, "agent": 192, "command": 85}
CORE_TOTALS = {"skill": 18, "agent": 14, "command": 9}
IMMUTABLE_CORE = {"get-started-stinger", "library-stinger", "knowledge-stinger",
                  "quality-stinger", "security-stinger", "github-repo-health-stinger"}

# Core alone carries the shared lifecycle hooks; an optional plugin must not repeat them.
# A plugin named here is the exception the owner approved: it may ship exactly one binding,
# hooks/hooks.json, whose commands run only the listed handler files from its own hooks/ folder.
# Approved 2026-11-25 for the Interstellar Coding crew's role hook. Every other optional plugin
# is still refused, and a listed plugin is refused the moment it carries anything else.
PACK_HOOK_OWNERS = {"interstellar-coding": frozenset({"crew-hook.mjs"})}
CORE_HOOK_HANDLERS = frozenset({
    "dash-guard.mjs", "component-validate.mjs", "onboarding-session.mjs", "session-start-cadence.mjs",
    "lifecycle-beacon.mjs", "tars-compaction.mjs", "register-codex-agents.py", "resolve-component.py",
})
