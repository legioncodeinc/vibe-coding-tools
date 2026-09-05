"""Adversarial regression tests for the fail-closed preflight gate."""

from __future__ import annotations

import binascii
import hashlib
import json
import os
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import zlib
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import preflight  # noqa: E402


def _png(seed: int) -> bytes:
    def chunk(kind: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + kind
            + payload
            + struct.pack(">I", binascii.crc32(kind + payload) & 0xFFFFFFFF)
        )

    rgb = bytes((seed % 256, (seed * 17) % 256, (seed * 31) % 256))
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(
        b"IDAT", zlib.compress(b"\x00" + rgb)
    ) + chunk(b"IEND", b"")


class PreflightTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        self.addCleanup(self.tempdir.cleanup)
        self.models_dir = Path(self.tempdir.name) / "models"
        self.models_dir.mkdir()
        self._make_template(self.models_dir)

    def _write(self, path: Path, content: str | bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding="utf-8")

    def _make_template(self, models_dir: Path) -> None:
        template = models_dir / preflight.TEMPLATE_DIR
        template.mkdir()
        for name in preflight.TEMPLATE_FILES:
            self._write(template / name, "template scaffold\n")
        for name in preflight.TEMPLATE_DIRECTORIES:
            (template / name).mkdir()

    def _state(
        self,
        reference_state: str = "visual-only",
        sources: list[str] | None = None,
        acknowledged: bool | None = None,
    ) -> dict[str, object]:
        if acknowledged is None:
            acknowledged = reference_state == "visual-only"
        return {
            "schema_version": 1,
            "reference_state": reference_state,
            "visual_only_acknowledged": acknowledged,
            "case_a_sources": sources or [],
        }

    def _row(
        self,
        *,
        slug: str = "mario",
        frames: int = 12,
        selects: int = 5,
        state: str = "visual-only",
        allowed: str | None = None,
        status: str = "active",
    ) -> dict[str, object]:
        return {
            "slug": slug,
            "display": "Mario Aldayuz",
            "frames": frames,
            "selects": selects,
            "state": state,
            "allowed": allowed or ("B" if state == "visual-only" else "A, B"),
            "release": "no",
            "ingested": "2026-08-18",
            "last_run": "never",
            "status": status,
        }

    def _write_ledger(
        self,
        rows: list[dict[str, object]] | None = None,
        *,
        sentinel: bool = False,
        before: str = "",
        after: str = "",
    ) -> None:
        header = "| " + " | ".join(preflight.ROSTER_HEADER) + " |"
        separator = "|" + "|".join("---" for _ in preflight.ROSTER_HEADER) + "|"
        lines = ["# MODELS-LIST", "", before, "## Roster", "", header, separator]
        for row in rows or []:
            lines.append(
                "| {slug} | {display} | {frames} | {selects} | {state} | "
                "{allowed} | {release} | {ingested} | {last_run} | {status} |".format(**row)
            )
        if sentinel:
            lines.append("| _(none yet)_ | | | | | | | | | |")
        lines.extend(["", "---", "", "## Records", "", after])
        self._write(self.models_dir / preflight.LEDGER_NAME, "\n".join(lines) + "\n")

    def _write_checksums(self, references: Path, *, prefix: str = "") -> None:
        lines = []
        for path in sorted(references.rglob("*")):
            if path.is_file() and path.name != preflight.CHECKSUMS_NAME and path.suffix.lower() in preflight.IMAGE_EXTS:
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                relative = path.relative_to(references).as_posix()
                lines.append(f"{digest}  {prefix}{relative}")
        self._write(references / preflight.CHECKSUMS_NAME, "\n".join(lines) + "\n")

    def _make_model(
        self,
        *,
        slug: str = "mario",
        reference_count: int = 12,
        select_count: int = 5,
        state: dict[str, object] | str | bytes | None = None,
        ledger_row: dict[str, object] | None = None,
        write_ledger: bool = True,
        status: str = "active",
    ) -> Path:
        model = self.models_dir / f"{slug}-source"
        refs = model / preflight.REFERENCE_DIR
        selects = model / preflight.SELECTS_DIR
        refs.mkdir(parents=True)
        selects.mkdir()
        for index in range(reference_count):
            self._write(refs / f"reference-{index:02}.png", _png(index + 1))
        for index in range(select_count):
            source = refs / f"reference-{index % max(reference_count, 1):02}.png"
            payload = source.read_bytes() if source.exists() else _png(index + 100)
            self._write(selects / f"select-{index:02}.png", payload)
        self._write_checksums(refs)
        self._write(model / preflight.BRIEF_NAME, "# MODEL BRIEF: Mario\n\nCompleted.\n")
        self._write(
            model / preflight.RELEASE_NAME,
            "# RELEASE RECORD: Mario\n\n"
            "**Signed release exists:** no\n\n"
            "**Whether the supplied reference files are authorised for this "
            "workflow:** yes\n",
        )
        effective_state: dict[str, object]
        if state is None:
            effective_state = self._state()
            state = effective_state
        elif isinstance(state, dict):
            effective_state = state
        else:
            effective_state = self._state()
        state_path = model / preflight.STATE_NAME
        if isinstance(state, bytes):
            self._write(state_path, state)
        elif isinstance(state, str):
            self._write(state_path, state)
        else:
            self._write(state_path, json.dumps(state, indent=2))
        if write_ledger:
            reference_state = str(effective_state.get("reference_state", "visual-only"))
            row = ledger_row or self._row(
                slug=slug,
                frames=reference_count,
                selects=min(select_count, reference_count),
                state=reference_state if reference_state in ("visual-only", "capture-backed") else "visual-only",
                status=status,
            )
            self._write_ledger([row])
        return model

    def _model_result(self, result: dict[str, object]) -> dict[str, object]:
        models = result["models"]
        self.assertIsInstance(models, list)
        self.assertEqual(len(models), 1)
        return models[0]

    def test_no_models_requires_valid_template_and_ledger(self) -> None:
        self._write_ledger(sentinel=True)
        result = preflight.run(str(self.models_dir))
        self.assertEqual((result["status"], result["code"]), ("NO_MODELS", 2))

    def test_empty_or_missing_scaffold_is_bad_layout(self) -> None:
        cases = ("empty", "empty-template", "missing-template", "missing-ledger")
        for label in cases:
            with self.subTest(label=label):
                root = Path(self.tempdir.name) / label / "models"
                root.mkdir(parents=True)
                if label == "missing-ledger":
                    self._make_template(root)
                elif label == "empty-template":
                    (root / preflight.TEMPLATE_DIR).mkdir()
                if label in ("missing-template", "empty-template"):
                    old = self.models_dir
                    self.models_dir = root
                    try:
                        self._write_ledger(sentinel=True)
                    finally:
                        self.models_dir = old
                result = preflight.run(str(root))
                self.assertEqual((result["status"], result["code"]), ("BAD_LAYOUT", 4))

    def test_visual_only_is_ready_generic_and_case_b_without_metadata(self) -> None:
        self._make_model()
        generic = preflight.run(str(self.models_dir))
        case_b = preflight.run(str(self.models_dir), "mario", "B")
        self.assertEqual(generic["status"], "READY")
        self.assertEqual(self._model_result(generic)["allowed_cases"], ["B"])
        self.assertEqual(case_b["status"], "READY")
        self.assertTrue(self._model_result(case_b)["request_allowed"])

    def test_invalid_run_combinations_fail_before_layout(self) -> None:
        missing = str(Path(self.tempdir.name) / "absent")
        cases = [
            ("", None, None, None),
            (missing, "", None, None),
            (missing, None, "B", None),
            (missing, "mario", "C", None),
            (missing, "mario", None, "source.png"),
            (missing, "mario", "B", "source.png"),
            (missing, "mario", "A", None),
        ]
        for args in cases:
            with self.subTest(args=args):
                result = preflight.run(*args)
                self.assertEqual(result["status"], "INVALID_ARGUMENTS")
                self.assertEqual(result["code"], preflight.INVALID_ARGUMENTS_CODE)

    def test_visual_only_case_a_is_blocked(self) -> None:
        model = self._make_model()
        source = model / preflight.REFERENCE_DIR / "reference-00.png"
        result = preflight.run(str(self.models_dir), "mario", "A", str(source))
        self.assertEqual((result["status"], result["code"]), ("CASE_BLOCKED", 5))

    def test_capture_backed_case_a_returns_fresh_source_fingerprint(self) -> None:
        source_rel = f"{preflight.REFERENCE_DIR}/reference-00.png"
        model = self._make_model(state=self._state("capture-backed", [source_rel]))
        source = model / Path(source_rel)
        result = preflight.run(str(self.models_dir), "mario", "A", str(source))
        self.assertEqual((result["status"], result["code"]), ("READY", 0))
        self.assertEqual(result["requested_source_sha256"], hashlib.sha256(source.read_bytes()).hexdigest())
        self.assertIn("device", result["requested_source_file_identity"])
        self.assertIn("inode", result["requested_source_file_identity"])
        self.assertIn("toctou_limitation", result["requested_source_verification"])

    def test_capture_backed_case_a_blocks_unlisted_identity(self) -> None:
        source_rel = f"{preflight.REFERENCE_DIR}/reference-00.png"
        model = self._make_model(state=self._state("capture-backed", [source_rel]))
        unlisted = model / preflight.REFERENCE_DIR / "reference-01.png"
        result = preflight.run(str(self.models_dir), "mario", "A", str(unlisted))
        self.assertEqual((result["status"], result["code"]), ("CASE_BLOCKED", 5))

    def test_retired_model_is_blocked_when_explicit_and_unusable_generic(self) -> None:
        self._make_model(status="retired")
        generic = preflight.run(str(self.models_dir))
        explicit = preflight.run(str(self.models_dir), "mario")
        case_b = preflight.run(str(self.models_dir), "mario", "B")
        self.assertEqual((generic["status"], generic["code"]), ("INCOMPLETE", 3))
        self.assertEqual((explicit["status"], explicit["code"]), ("CASE_BLOCKED", 5))
        self.assertEqual((case_b["status"], case_b["code"]), ("CASE_BLOCKED", 5))

    def test_rows_in_comments_fences_or_records_do_not_authorize(self) -> None:
        row = self._row()
        fake = (
            "<!-- | mario | Mario | 12 | 5 | visual-only | B | no | "
            "2026-08-18 | never | active | -->\n"
            "```md\n| mario | Mario | 12 | 5 | visual-only | B | no | "
            "2026-08-18 | never | active |\n```"
        )
        self._make_model(write_ledger=False)
        self._write_ledger([], before=fake, after=(
            "| mario | Mario | 12 | 5 | visual-only | B | no | "
            "2026-08-18 | never | active |"
        ))
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")
        self.assertFalse(self._model_result(result)["ledger_row_present"])
        self.assertEqual(row["slug"], "mario")

    def test_duplicate_or_conflicting_roster_rows_are_bad_layout(self) -> None:
        self._make_model(write_ledger=False)
        self._write_ledger([self._row(), self._row(status="retired")])
        result = preflight.run(str(self.models_dir))
        self.assertEqual((result["status"], result["code"]), ("BAD_LAYOUT", 4))

    def test_roster_counts_state_and_allowed_cases_must_match(self) -> None:
        rows = [
            self._row(frames=13),
            self._row(state="capture-backed", allowed="A, B"),
            self._row(allowed="A, B"),
        ]
        for index, row in enumerate(rows):
            with self.subTest(index=index):
                root = Path(self.tempdir.name) / f"roster-{index}" / "models"
                root.mkdir(parents=True)
                self._make_template(root)
                old = self.models_dir
                self.models_dir = root
                try:
                    self._make_model(ledger_row=row)
                    result = preflight.run(str(root))
                finally:
                    self.models_dir = old
                self.assertNotEqual(result["status"], "READY")

    def test_invalid_status_and_second_roster_are_bad_layout(self) -> None:
        self._make_model(write_ledger=False)
        bad = self._row(status="paused")
        self._write_ledger([bad], after="## Roster\n")
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "BAD_LAYOUT")

    def test_malformed_candidate_and_orphan_roster_are_bad_layout(self) -> None:
        (self.models_dir / "Mario source").mkdir()
        self._write_ledger(sentinel=True)
        malformed = preflight.run(str(self.models_dir))
        self.assertEqual(malformed["status"], "BAD_LAYOUT")
        (self.models_dir / "Mario source").rmdir()
        self._write_ledger([self._row()])
        orphan = preflight.run(str(self.models_dir))
        self.assertEqual(orphan["status"], "BAD_LAYOUT")

    def test_invalid_unicode_is_reported_without_traceback(self) -> None:
        model = self._make_model()
        (model / preflight.RELEASE_NAME).write_bytes(b"\xff\xfe")
        release = preflight.run(str(self.models_dir))
        self.assertEqual(release["status"], "INCOMPLETE")
        (self.models_dir / preflight.LEDGER_NAME).write_bytes(b"\xff\xfe")
        ledger = preflight.run(str(self.models_dir))
        self.assertEqual(ledger["status"], "BAD_LAYOUT")

    def test_duplicate_json_keys_and_nonstandard_constants_are_rejected(self) -> None:
        payloads = (
            '{"schema_version":1,"schema_version":1,"reference_state":"visual-only",'
            '"visual_only_acknowledged":true,"case_a_sources":[]}',
            '{"schema_version":1,"reference_state":"visual-only",'
            '"visual_only_acknowledged":true,"case_a_sources":[],"x":NaN}',
        )
        for index, payload in enumerate(payloads):
            with self.subTest(index=index):
                root = Path(self.tempdir.name) / f"json-{index}" / "models"
                root.mkdir(parents=True)
                self._make_template(root)
                old = self.models_dir
                self.models_dir = root
                try:
                    self._make_model(state=payload)
                    result = preflight.run(str(root))
                finally:
                    self.models_dir = old
                self.assertEqual(result["status"], "INCOMPLETE")

    def test_release_authorisation_must_be_one_visible_yes(self) -> None:
        model = self._make_model()
        release = model / preflight.RELEASE_NAME
        hidden_only = (
            "# RELEASE RECORD: Mario\n"
            "<!-- **Whether the supplied reference files are authorised for this workflow:** yes -->\n"
            "```\n**Whether the supplied reference files are authorised for this workflow:** yes\n```\n"
        )
        self._write(release, hidden_only)
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")
        self._write(
            release,
            "# RELEASE RECORD: Mario\n"
            "**Whether the supplied reference files are authorised for this workflow:** yes\n"
            "**Whether the supplied reference files are authorised for this workflow:** yes\n",
        )
        duplicate = preflight.run(str(self.models_dir))
        self.assertEqual(duplicate["status"], "INCOMPLETE")

    def test_long_fence_and_uppercase_authorisation_cannot_authorize(self) -> None:
        model = self._make_model()
        release = model / preflight.RELEASE_NAME
        self._write(
            release,
            "# RELEASE RECORD: Mario\n````md\n```\n"
            "**Whether the supplied reference files are authorised for this workflow:** yes\n"
            "````\n",
        )
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")
        self._write(
            release,
            "# RELEASE RECORD: Mario\n```md\n    ```\n"
            "**Whether the supplied reference files are authorised for this workflow:** yes\n"
            "```\n",
        )
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")
        self._write(
            release,
            "# RELEASE RECORD: Mario\n"
            "**Whether the supplied reference files are authorised for this workflow:** YES\n",
        )
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")

    def test_external_release_and_state_links_fail_when_supported(self) -> None:
        model = self._make_model()
        outside = Path(self.tempdir.name) / "outside-records"
        outside.mkdir()
        external_release = outside / preflight.RELEASE_NAME
        external_state = outside / preflight.STATE_NAME
        self._write(
            external_release,
            "# RELEASE RECORD: Mario\n"
            "**Whether the supplied reference files are authorised for this workflow:** yes\n",
        )
        self._write(external_state, json.dumps(self._state()))
        try:
            (model / preflight.RELEASE_NAME).unlink()
            os.symlink(external_release, model / preflight.RELEASE_NAME)
            release_result = preflight.run(str(self.models_dir))
            (model / preflight.RELEASE_NAME).unlink()
            self._write(
                model / preflight.RELEASE_NAME,
                "# RELEASE RECORD: Mario\n"
                "**Whether the supplied reference files are authorised for this workflow:** yes\n",
            )
            (model / preflight.STATE_NAME).unlink()
            os.symlink(external_state, model / preflight.STATE_NAME)
            state_result = preflight.run(str(self.models_dir))
        except (OSError, NotImplementedError) as exc:
            self.skipTest(f"file symlinks unavailable: {exc}")
        self.assertEqual(release_result["status"], "INCOMPLETE")
        self.assertEqual(state_result["status"], "INCOMPLETE")

    def test_missing_tampered_and_unmanifested_references_fail(self) -> None:
        for label in ("missing", "tampered", "unmanifested"):
            with self.subTest(label=label):
                root = Path(self.tempdir.name) / f"checksum-{label}" / "models"
                root.mkdir(parents=True)
                self._make_template(root)
                old = self.models_dir
                self.models_dir = root
                try:
                    model = self._make_model()
                    refs = model / preflight.REFERENCE_DIR
                    if label == "missing":
                        (refs / preflight.CHECKSUMS_NAME).unlink()
                    elif label == "tampered":
                        self._write(refs / "reference-00.png", _png(200))
                    else:
                        self._write(refs / "extra.png", _png(201))
                    result = preflight.run(str(root))
                finally:
                    self.models_dir = old
                self.assertEqual(result["status"], "INCOMPLETE")

    def test_checksum_manifest_rejects_traversal_and_duplicate_entries(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        manifest = refs / preflight.CHECKSUMS_NAME
        original = manifest.read_text(encoding="utf-8")
        digest = hashlib.sha256((refs / "reference-00.png").read_bytes()).hexdigest()
        self._write(manifest, original + f"{digest}  ../outside.png\n")
        traversal = preflight.run(str(self.models_dir))
        self.assertEqual(traversal["status"], "INCOMPLETE")
        first = original.splitlines()[0]
        self._write(manifest, original + first + "\n")
        duplicate = preflight.run(str(self.models_dir))
        self.assertEqual(duplicate["status"], "INCOMPLETE")

    def test_empty_truncated_and_renamed_payloads_fail(self) -> None:
        payloads = (b"", b"\x89PNG\r\n\x1a\n", b"plain text renamed as png")
        for index, payload in enumerate(payloads):
            with self.subTest(index=index):
                root = Path(self.tempdir.name) / f"payload-{index}" / "models"
                root.mkdir(parents=True)
                self._make_template(root)
                old = self.models_dir
                self.models_dir = root
                try:
                    model = self._make_model()
                    refs = model / preflight.REFERENCE_DIR
                    self._write(refs / "reference-00.png", payload)
                    self._write_checksums(refs)
                    result = preflight.run(str(root))
                finally:
                    self.models_dir = old
                self.assertEqual(result["status"], "INCOMPLETE")

    def test_png_decoded_length_filter_and_adam7_are_validated(self) -> None:
        def custom_png(raw: bytes, interlace: int) -> bytes:
            def chunk(kind: bytes, payload: bytes) -> bytes:
                return struct.pack(">I", len(payload)) + kind + payload + struct.pack(
                    ">I", binascii.crc32(kind + payload) & 0xFFFFFFFF
                )
            ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, interlace)
            return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(
                b"IDAT", zlib.compress(raw)
            ) + chunk(b"IEND", b"")

        self.assertIsNotNone(preflight._png_problem(custom_png(b"\x00", 1)))
        self.assertIsNotNone(preflight._png_problem(custom_png(b"\x05\x00\x00\x00", 0)))

        def indexed_without_palette() -> bytes:
            def chunk(kind: bytes, payload: bytes) -> bytes:
                return struct.pack(">I", len(payload)) + kind + payload + struct.pack(
                    ">I", binascii.crc32(kind + payload) & 0xFFFFFFFF
                )
            ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 3, 0, 0, 0)
            return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(
                b"IDAT", zlib.compress(b"\x00\x00")
            ) + chunk(b"IEND", b"")

        self.assertIsNotNone(preflight._png_problem(indexed_without_palette()))

    def test_roster_dates_are_strict_and_markdown_equivalent_duplicates_count(self) -> None:
        self._make_model(write_ledger=False)
        row = self._row()
        row["ingested"] = "20260818"
        self._write_ledger([row])
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "BAD_LAYOUT")
        self._write_ledger([self._row()], after="## Roster ##\n")
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "BAD_LAYOUT")

    def test_duplicate_content_does_not_inflate_reference_or_select_counts(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        duplicate = (refs / "reference-00.png").read_bytes()
        for path in refs.glob("reference-*.png"):
            self._write(path, duplicate)
        self._write_checksums(refs)
        result = preflight.run(str(self.models_dir))
        model_result = self._model_result(result)
        self.assertEqual(model_result["frames"], 1)
        self.assertEqual(result["status"], "INCOMPLETE")

    def test_selects_must_be_verified_reference_copies(self) -> None:
        model = self._make_model()
        self._write(model / preflight.SELECTS_DIR / "select-00.png", _png(240))
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")
        self.assertTrue(any("select is not a copy" in p for p in self._model_result(result)["problems"]))

    def test_outputs_and_selects_do_not_inflate_reference_count(self) -> None:
        model = self._make_model(reference_count=11, ledger_row=self._row(frames=11))
        for index in range(30):
            self._write(model / "03-outputs" / f"output-{index:02}.png", _png(index + 100))
        result = preflight.run(str(self.models_dir))
        self.assertEqual(self._model_result(result)["frames"], 11)
        self.assertEqual(result["status"], "INCOMPLETE")

    def test_missing_or_unfilled_documents_and_state_fail(self) -> None:
        model = self._make_model()
        (model / preflight.BRIEF_NAME).unlink()
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")
        self._write(model / preflight.BRIEF_NAME, "# MODEL BRIEF: <Model Name>\n| Name | |\n")
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")
        self._write(model / preflight.BRIEF_NAME, "# MODEL BRIEF: Mario\nComplete\n")
        (model / preflight.STATE_NAME).unlink()
        self.assertEqual(preflight.run(str(self.models_dir))["status"], "INCOMPLETE")

    def test_allowlist_rejects_actual_outside_traversal_file(self) -> None:
        model = self._make_model()
        outside = model.parent / "outside.png"
        self._write(outside, _png(251))
        self._write(
            model / preflight.STATE_NAME,
            json.dumps(self._state("capture-backed", ["../outside.png"])),
        )
        self._write_ledger([self._row(state="capture-backed")])
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")

    def test_reference_directory_symlink_escape_is_pruned_when_supported(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        outside = Path(self.tempdir.name) / "outside-images"
        outside.mkdir()
        self._write(outside / "external.png", _png(252))
        link = refs / "linked-outside"
        try:
            os.symlink(outside, link, target_is_directory=True)
        except (OSError, NotImplementedError) as exc:
            self.skipTest(f"directory symlinks unavailable: {exc}")
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")
        self.assertEqual(self._model_result(result)["frames"], 12)

    def test_duplicate_physical_model_alias_is_bad_layout_when_supported(self) -> None:
        self._make_model(write_ledger=False)
        alias = self.models_dir / "alias-source"
        try:
            os.symlink(self.models_dir / "mario-source", alias, target_is_directory=True)
        except (OSError, NotImplementedError) as exc:
            self.skipTest(f"directory symlinks unavailable: {exc}")
        self._write_ledger([self._row(), self._row(slug="alias")])
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "BAD_LAYOUT")

    def test_hardlink_aliases_are_not_distinct_frames_when_supported(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        alias = refs / "hardlink.png"
        try:
            os.link(refs / "reference-00.png", alias)
        except OSError as exc:
            self.skipTest(f"hardlinks unavailable: {exc}")
        self._write_checksums(refs)
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "INCOMPLETE")

    def test_conservative_dng_signature_is_accepted(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        original = refs / "reference-11.png"
        original.unlink()
        self._write(refs / "reference-11.dng", b"II*\x00\x08\x00\x00\x00" + b"\x00" * 12)
        select = model / preflight.SELECTS_DIR / "select-04.png"
        self._write(select, (refs / "reference-04.png").read_bytes())
        self._write_checksums(refs)
        result = preflight.run(str(self.models_dir))
        self.assertEqual(result["status"], "READY")

    def test_case_distinct_files_are_not_conflated_when_filesystem_supports_it(self) -> None:
        model = self._make_model()
        refs = model / preflight.REFERENCE_DIR
        upper = refs / "Case.png"
        lower = refs / "case.png"
        self._write(upper, _png(220))
        self._write(lower, _png(221))
        if preflight._same_file(str(upper), str(lower)):
            self.skipTest("filesystem is case-insensitive")
        self._write_checksums(refs)
        self._write(
            model / preflight.STATE_NAME,
            json.dumps(self._state("capture-backed", [f"{preflight.REFERENCE_DIR}/Case.png"])),
        )
        self._write_ledger([self._row(frames=14, state="capture-backed")])
        result = preflight.run(str(self.models_dir), "mario", "A", str(lower))
        self.assertEqual(result["status"], "CASE_BLOCKED")

    def test_cli_malformed_json_is_truthful_and_does_not_exit_two(self) -> None:
        script = str(SCRIPTS_DIR / "preflight.py")
        completed = subprocess.run(
            [sys.executable, script, "--json", "--models-dir", "", "--case", "B"],
            capture_output=True,
            text=True,
            check=False,
        )
        payload = json.loads(completed.stdout)
        self.assertEqual(completed.returncode, preflight.INVALID_ARGUMENTS_CODE)
        self.assertEqual(payload["status"], "INVALID_ARGUMENTS")
        self.assertNotEqual(payload["code"], 2)

    def test_cli_no_models_still_uses_documented_code_two(self) -> None:
        self._write_ledger(sentinel=True)
        script = str(SCRIPTS_DIR / "preflight.py")
        completed = subprocess.run(
            [sys.executable, script, "--json", "--models-dir", str(self.models_dir)],
            capture_output=True,
            text=True,
            check=False,
        )
        payload = json.loads(completed.stdout)
        self.assertEqual(completed.returncode, 2)
        self.assertEqual(payload["status"], "NO_MODELS")


if __name__ == "__main__":
    unittest.main()
