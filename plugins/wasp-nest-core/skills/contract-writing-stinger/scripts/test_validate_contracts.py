#!/usr/bin/env python3
"""Small fixture checks for the read-only CTR validator."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from validate_contracts import check_contract


ACCEPTED = """# CTR-004: Export status

> **Status:** Accepted
> **Revision:** 1
> **Accepted by:** Mario, 2026-09-22 task decision
> **Last reviewed:** 2026-09-22
> **Supersedes:** None
> **Superseded by:** None

## Boundary and scope

Export status API.

## Parties and owners

Backend provider and UI consumer.

## Sources and constraints

User decision.

## Agreed behavior

Status is pending or ready.

## Examples and edge cases

Valid pending; unknown ID returns 404.

## Compatibility and rollout

First revision.

## Verification obligations

Backend response check and UI parsing check.

## PRD dependencies

- [PRD-007](../../../requirements/backlog/prd-007-export/prd-007-export-index.md)

## Open decisions

- None.

## Change history

Revision 1 accepted.
"""


class ContractValidationTests(unittest.TestCase):
    def test_accepted_record_and_pinned_prd(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            contract = root / "library/knowledge/private/contracts/CTR-004-export-status.md"
            prd = root / "library/requirements/backlog/prd-007-export/prd-007-export-index.md"
            contract.parent.mkdir(parents=True)
            prd.parent.mkdir(parents=True)
            contract.write_text(ACCEPTED, encoding="utf-8")
            prd.write_text("## Contract dependencies\n\n- CTR-004 revision 1\n", encoding="utf-8")
            self.assertEqual(check_contract(contract, root), [])

    def test_missing_revision_pin_is_reported(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            contract = root / "library/knowledge/private/contracts/CTR-004-export-status.md"
            prd = root / "library/requirements/backlog/prd-007-export/prd-007-export-index.md"
            contract.parent.mkdir(parents=True)
            prd.parent.mkdir(parents=True)
            contract.write_text(ACCEPTED, encoding="utf-8")
            prd.write_text("## Contract dependencies\n\n- Pending\n", encoding="utf-8")
            self.assertTrue(any("must pin CTR-004 revision 1" in item for item in check_contract(contract, root)))

    def test_draft_cannot_pass_as_accepted(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            contract = root / "library/knowledge/private/contracts/CTR-004-export-status.md"
            contract.parent.mkdir(parents=True)
            contract.write_text(ACCEPTED.replace("Mario, 2026-09-22 task decision", "Pending"), encoding="utf-8")
            self.assertTrue(any("operator acceptance evidence" in item for item in check_contract(contract, root)))

    def test_supersession_requires_reverse_link(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            old = root / "library/knowledge/private/contracts/CTR-004-export-status.md"
            new = root / "library/knowledge/private/contracts/CTR-005-export-status.md"
            prd = root / "library/requirements/backlog/prd-007-export/prd-007-export-index.md"
            old.parent.mkdir(parents=True)
            prd.parent.mkdir(parents=True)
            old.write_text(ACCEPTED.replace("Status:** Accepted", "Status:** Superseded").replace("Superseded by:** None", "Superseded by:** CTR-005 revision 1"), encoding="utf-8")
            new.write_text(ACCEPTED.replace("CTR-004", "CTR-005").replace("Supersedes:** None", "Supersedes:** CTR-004 revision 1").replace("## PRD dependencies\n\n- [PRD-007](../../../requirements/backlog/prd-007-export/prd-007-export-index.md)", "## PRD dependencies\n\n- None yet."), encoding="utf-8")
            prd.write_text("## Contract dependencies\n\n- CTR-004 revision 1\n", encoding="utf-8")
            self.assertEqual(check_contract(old, root), [])
            self.assertEqual(check_contract(new, root), [])
            new.write_text(new.read_text(encoding="utf-8").replace("Supersedes:** CTR-004 revision 1", "Supersedes:** None"), encoding="utf-8")
            self.assertTrue(any("successor must link back" in item for item in check_contract(old, root)))


if __name__ == "__main__":
    unittest.main()
