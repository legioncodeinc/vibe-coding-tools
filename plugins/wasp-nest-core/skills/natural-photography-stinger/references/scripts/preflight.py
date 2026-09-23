#!/usr/bin/env python3
"""Fail-closed model and operation gate for natural-photography-stinger.

Exit codes:
  0   READY
  2   NO_MODELS
  3   INCOMPLETE
  4   BAD_LAYOUT
  5   CASE_BLOCKED
  64  INVALID_ARGUMENTS (CLI/API usage error; never a model-gate result)
"""

from __future__ import annotations

import argparse
import binascii
import datetime as dt
import hashlib
import json
import ntpath
import os
import re
import struct
import sys
import zlib
from typing import Any, Iterable

IMAGE_EXTS = {
    ".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp", ".heic", ".heif",
    ".cr2", ".cr3", ".nef", ".arw", ".raf", ".orf", ".rw2", ".dng",
}
RAW_EXTS = {".cr2", ".cr3", ".nef", ".arw", ".raf", ".orf", ".rw2", ".dng"}

TEMPLATE_DIR = "model-template"
SOURCE_SUFFIX = "-source"
BRIEF_NAME = "MODEL-BRIEF.md"
RELEASE_NAME = "RELEASE.md"
STATE_NAME = "MODEL-STATE.json"
LEDGER_NAME = "MODELS-LIST.md"
REFERENCE_DIR = "01-reference-frames"
SELECTS_DIR = "02-selects"
CHECKSUMS_NAME = "CHECKSUMS.txt"

MIN_FRAMES_HARD = 12
MIN_FRAMES_TARGET = 24
MIN_SELECTS = 5
MAX_SELECTS = 6
STATE_SCHEMA_VERSION = 1
INVALID_ARGUMENTS_CODE = 64
MAX_IMAGE_BYTES = 128 * 1024 * 1024
MAX_DECODED_BYTES = 256 * 1024 * 1024

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FOLDER_RE = re.compile(r"^([a-z0-9]+(?:-[a-z0-9]+)*)-source$")
ROSTER_HEADER = [
    "Slug",
    "Display name",
    "Frames",
    "Selects",
    "Reference state",
    "Allowed cases",
    "Release on file",
    "Ingested",
    "Last run",
    "Status",
]
TEMPLATE_FILES = (BRIEF_NAME, RELEASE_NAME, STATE_NAME, "README.md")
TEMPLATE_DIRECTORIES = (REFERENCE_DIR, SELECTS_DIR, "03-outputs", "04-lineage")


class DuplicateJSONKey(ValueError):
    pass


class CLIUsageError(ValueError):
    pass


class GateArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        raise CLIUsageError(message)


def default_models_dir() -> str:
    here = os.path.dirname(os.path.abspath(__file__))
    skill_root = os.path.dirname(os.path.dirname(here))
    return os.path.join(skill_root, "models")


def _base_result(models_dir: Any) -> dict[str, Any]:
    return {
        "models_dir": models_dir if isinstance(models_dir, str) else None,
        "status": None,
        "code": 0,
        "models": [],
        "ledger_present": False,
        "message": "",
    }


def _invalid_result(models_dir: Any, message: str) -> dict[str, Any]:
    result = _base_result(models_dir)
    result.update(
        status="INVALID_ARGUMENTS",
        code=INVALID_ARGUMENTS_CODE,
        message="Invalid preflight arguments: %s" % message,
    )
    return result


def _read_text(path: str) -> tuple[str | None, str | None]:
    try:
        with open(path, encoding="utf-8", errors="strict") as handle:
            return handle.read(), None
    except (OSError, UnicodeError) as exc:
        return None, str(exc)


def _strip_hidden_markdown(text: str) -> str:
    """Remove HTML comments and fenced code before reading control records."""
    without_comments = re.sub(r"<!--[\s\S]*?(?:-->|\Z)", "", text)
    visible: list[str] = []
    fence: tuple[str, int] | None = None
    for line in without_comments.splitlines(keepends=True):
        marker = re.match(r"^ {0,3}(`{3,}|~{3,})", line)
        if fence is None:
            if marker:
                fence = (marker.group(1)[0], len(marker.group(1)))
                continue
            visible.append(line)
        else:
            character, minimum = fence
            if re.fullmatch(
                r" {0,3}%s{%d,}[ \t]*(?:\r?\n)?"
                % (re.escape(character), minimum),
                line,
            ):
                fence = None
    return "".join(visible)


def _document_problem(path: str, name: str) -> str | None:
    if not os.path.isfile(path):
        return "missing %s" % name
    if not _is_contained(os.path.dirname(path), path):
        return "%s resolves outside the model folder" % name
    text, error = _read_text(path)
    if error is not None:
        return "could not read %s (%s)" % (name, error)
    assert text is not None
    visible = _strip_hidden_markdown(text)
    if not visible.strip():
        return "%s is empty" % name
    if re.search(r"<[^>\r\n]+>", visible):
        return "%s is still the unfilled template" % name
    if re.search(r"(?m)^\|\s*[^|]+\s*\|\s*\|\s*$", visible):
        return "%s is still the unfilled template" % name
    if re.search(r"(?m)^\*\*[^*\r\n]+:\*\*\s*$", visible):
        return "%s is still the unfilled template" % name
    if re.search(
        r"(?im)(?:\||:)\s*(?:yes\s*/\s*no)(?:\s*/\s*unknown)?\s*\|?\s*$",
        visible,
    ):
        return "%s is still the unfilled template" % name
    if name == BRIEF_NAME and "Copy this file into" in visible:
        return "%s is still the unfilled template" % name
    return None


def _release_authorisation_problem(path: str) -> str | None:
    if not os.path.isfile(path):
        return None
    if not _is_contained(os.path.dirname(path), path):
        return None
    text, error = _read_text(path)
    if error is not None or text is None:
        return None
    visible = _strip_hidden_markdown(text)
    matches = re.findall(
        r"(?m)^\*\*Whether the supplied reference files are authorised "
        r"for this workflow:\*\*\s*([^\r\n]+?)\s*$",
        visible,
    )
    if not matches:
        return "%s is missing reference-file workflow authorisation" % RELEASE_NAME
    if len(matches) != 1:
        return "%s must contain exactly one visible reference-file authorisation" % RELEASE_NAME
    if matches[0].strip() != "yes":
        return "%s reference-file workflow authorisation must be yes" % RELEASE_NAME
    return None


def _same_file(left: str, right: str) -> bool:
    try:
        return os.path.samefile(left, right)
    except (OSError, ValueError, UnicodeError):
        return False


def _is_contained(root: str, candidate: str) -> bool:
    """Use filesystem identity, not case folding, to test physical ancestry."""
    try:
        if not os.path.isdir(root):
            return False
        probe = os.path.abspath(candidate)
        while not os.path.exists(probe):
            parent = os.path.dirname(probe)
            if parent == probe:
                return False
            probe = parent
        probe = os.path.realpath(probe)
        if not os.path.isdir(probe):
            probe = os.path.dirname(probe)
        while True:
            if _same_file(root, probe):
                return True
            parent = os.path.dirname(probe)
            if parent == probe:
                return False
            probe = parent
    except (OSError, ValueError, UnicodeError):
        return False


def _is_linklike(path: str) -> bool:
    try:
        if os.path.islink(path):
            return True
        isjunction = getattr(os.path, "isjunction", None)
        if isjunction is not None and isjunction(path):
            return True
        attrs = getattr(os.stat(path, follow_symlinks=False), "st_file_attributes", 0)
        return bool(attrs & 0x400)  # FILE_ATTRIBUTE_REPARSE_POINT
    except (OSError, ValueError, UnicodeError):
        return False


def _normalise_relative_path(value: Any) -> str | None:
    if not isinstance(value, str) or not value.strip():
        return None
    candidate = value.replace("\\", "/")
    drive, _tail = ntpath.splitdrive(candidate)
    if drive or ":" in candidate or candidate.startswith("/") or candidate.startswith("//"):
        return None
    if ".." in candidate.split("/"):
        return None
    normalised = os.path.normpath(candidate).replace("\\", "/")
    if normalised in ("", ".") or normalised == ".." or normalised.startswith("../"):
        return None
    return normalised


def _json_object_without_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise DuplicateJSONKey("duplicate key %r" % key)
        result[key] = value
    return result


def _reject_json_constant(value: str) -> Any:
    raise ValueError("non-standard JSON constant %s" % value)


def _parse_markdown_row(line: str) -> list[str] | None:
    stripped = line.strip()
    if not stripped.startswith("|") or not stripped.endswith("|") or "\\|" in stripped:
        return None
    return [cell.strip() for cell in stripped[1:-1].split("|")]


def _parse_allowed_cases(value: str) -> list[str] | None:
    if value == "B":
        return ["B"]
    if re.fullmatch(r"A\s*,\s*B", value):
        return ["A", "B"]
    return None


def _valid_date(value: str) -> bool:
    if not re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value):
        return False
    try:
        dt.date.fromisoformat(value)
        return True
    except ValueError:
        return False


def _canonical_count(value: str) -> int | None:
    if not re.fullmatch(r"0|[1-9][0-9]{0,8}", value):
        return None
    return int(value)


def _parse_roster(ledger_text: str) -> dict[str, Any]:
    visible = _strip_hidden_markdown(ledger_text)
    lines = visible.splitlines()
    headings = [
        index
        for index, line in enumerate(lines)
        if re.fullmatch(r"##[ \t]+Roster(?:[ \t]+#+)?[ \t]*", line)
    ]
    parsed: dict[str, Any] = {"rows": {}, "sentinel": False, "errors": []}
    if len(headings) != 1:
        parsed["errors"].append("ledger must contain exactly one visible ## Roster section")
        return parsed

    start = headings[0] + 1
    end = len(lines)
    for index in range(start, len(lines)):
        if re.match(r"^#{1,2}[ \t]+", lines[index]):
            end = index
            break
    section = lines[start:end]
    first_table = next((i for i, line in enumerate(section) if line.strip().startswith("|")), None)
    if first_table is None:
        parsed["errors"].append("Roster section has no table")
        return parsed

    header = _parse_markdown_row(section[first_table])
    if header != ROSTER_HEADER:
        parsed["errors"].append("Roster table header is not canonical")
        return parsed
    if first_table + 1 >= len(section):
        parsed["errors"].append("Roster table is missing its separator row")
        return parsed
    separator = _parse_markdown_row(section[first_table + 1])
    if separator is None or len(separator) != len(ROSTER_HEADER) or not all(
        re.fullmatch(r":?-{3,}:?", cell) for cell in separator
    ):
        parsed["errors"].append("Roster table separator is not canonical")
        return parsed

    row_lines: list[str] = []
    cursor = first_table + 2
    while cursor < len(section) and section[cursor].strip().startswith("|"):
        row_lines.append(section[cursor])
        cursor += 1
    if any(line.strip().startswith("|") for line in section[cursor:]):
        parsed["errors"].append("Roster section contains multiple visible tables")

    for line in row_lines:
        cells = _parse_markdown_row(line)
        if cells is None or len(cells) != len(ROSTER_HEADER):
            parsed["errors"].append("Roster contains a malformed row")
            continue
        slug = cells[0]
        if slug == "_(none yet)_":
            if parsed["sentinel"] or any(cells[1:]):
                parsed["errors"].append("Roster none-yet row is malformed or duplicated")
            parsed["sentinel"] = True
            continue
        if not SLUG_RE.fullmatch(slug):
            parsed["errors"].append("Roster contains non-canonical slug %r" % slug)
            continue
        if slug in parsed["rows"]:
            parsed["errors"].append("Roster contains duplicate/conflicting rows for %s" % slug)
            continue
        display, frame_text, select_text = cells[1], cells[2], cells[3]
        state, allowed_text = cells[4], cells[5]
        release, ingested, last_run, status = cells[6:10]
        allowed = _parse_allowed_cases(allowed_text)
        row_errors: list[str] = []
        if not display:
            row_errors.append("display name is empty")
        frame_count = _canonical_count(frame_text)
        select_count = _canonical_count(select_text)
        if frame_count is None:
            row_errors.append("Frames is not a canonical integer")
        if select_count is None:
            row_errors.append("Selects is not a canonical integer")
        if state not in ("visual-only", "capture-backed"):
            row_errors.append("Reference state is invalid")
        if allowed is None:
            row_errors.append("Allowed cases is invalid")
        if not release:
            row_errors.append("Release on file is empty")
        if not _valid_date(ingested):
            row_errors.append("Ingested is not YYYY-MM-DD")
        if last_run != "never" and not _valid_date(last_run):
            row_errors.append("Last run is not never or YYYY-MM-DD")
        if status not in ("active", "retired"):
            row_errors.append("Status must be active or retired")
        expected_allowed = ["B"] if state == "visual-only" else ["A", "B"]
        if allowed is not None and state in ("visual-only", "capture-backed") and allowed != expected_allowed:
            row_errors.append("Reference state and Allowed cases conflict")
        if row_errors:
            parsed["errors"].append("Roster row %s: %s" % (slug, "; ".join(row_errors)))
            continue
        parsed["rows"][slug] = {
            "slug": slug,
            "display_name": display,
            "frames": frame_count,
            "selects": select_count,
            "reference_state": state,
            "allowed_cases": allowed,
            "release_on_file": release,
            "ingested": ingested,
            "last_run": last_run,
            "status": status,
        }
    if parsed["sentinel"] and parsed["rows"]:
        parsed["errors"].append("Roster none-yet row conflicts with model rows")
    return parsed


def _sha256(path: str) -> tuple[str | None, str | None]:
    digest = hashlib.sha256()
    try:
        with open(path, "rb") as handle:
            for block in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(block)
        return digest.hexdigest(), None
    except (OSError, UnicodeError) as exc:
        return None, str(exc)


def _png_problem(data: bytes) -> str | None:
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "invalid PNG signature"
    position = 8
    chunks: list[tuple[bytes, bytes]] = []
    try:
        while position < len(data):
            if position + 12 > len(data):
                return "truncated PNG chunk"
            length = struct.unpack(">I", data[position:position + 4])[0]
            kind = data[position + 4:position + 8]
            finish = position + 12 + length
            if finish > len(data):
                return "truncated PNG payload"
            payload = data[position + 8:position + 8 + length]
            stored_crc = struct.unpack(">I", data[position + 8 + length:finish])[0]
            if (binascii.crc32(kind + payload) & 0xFFFFFFFF) != stored_crc:
                return "PNG CRC mismatch"
            chunks.append((kind, payload))
            position = finish
            if kind == b"IEND":
                break
    except (struct.error, OverflowError):
        return "invalid PNG structure"
    if not chunks or chunks[0][0] != b"IHDR" or len(chunks[0][1]) != 13:
        return "PNG is missing a valid IHDR"
    kinds = [kind for kind, _payload in chunks]
    if any(len(kind) != 4 or not all(65 <= byte <= 90 or 97 <= byte <= 122 for byte in kind) for kind in kinds):
        return "PNG contains an invalid chunk type"
    if kinds.count(b"IHDR") != 1 or kinds.count(b"IEND") != 1:
        return "PNG must contain exactly one IHDR and IEND"
    if chunks[-1][1] != b"":
        return "PNG IEND payload must be empty"
    allowed_critical = {b"IHDR", b"PLTE", b"IDAT", b"IEND"}
    if any((kind[0] & 0x20) == 0 and kind not in allowed_critical for kind in kinds):
        return "PNG contains an unknown critical chunk"
    ihdr = chunks[0][1]
    width, height = struct.unpack(">II", ihdr[:8])
    if width == 0 or height == 0:
        return "PNG dimensions must be nonzero"
    bit_depth, color_type, compression, filter_method, interlace = ihdr[8:13]
    valid_depths = {
        0: {1, 2, 4, 8, 16},
        2: {8, 16},
        3: {1, 2, 4, 8},
        4: {8, 16},
        6: {8, 16},
    }
    if color_type not in valid_depths or bit_depth not in valid_depths[color_type]:
        return "PNG color type/bit depth is invalid"
    if compression != 0 or filter_method != 0 or interlace not in (0, 1):
        return "PNG compression/filter/interlace fields are invalid"
    palette_indices = [index for index, kind in enumerate(kinds) if kind == b"PLTE"]
    idat_indices = [index for index, kind in enumerate(kinds) if kind == b"IDAT"]
    if len(palette_indices) > 1:
        return "PNG contains duplicate PLTE chunks"
    if color_type == 3:
        if not palette_indices or not idat_indices or palette_indices[0] > idat_indices[0]:
            return "indexed PNG is missing PLTE before IDAT"
        palette = chunks[palette_indices[0]][1]
        if not palette or len(palette) % 3 or len(palette) > 768:
            return "PNG palette is malformed"
    elif color_type in (0, 4) and palette_indices:
        return "grayscale PNG must not contain PLTE"
    if idat_indices and idat_indices != list(range(idat_indices[0], idat_indices[-1] + 1)):
        return "PNG IDAT chunks must be consecutive"
    idat = b"".join(payload for kind, payload in chunks if kind == b"IDAT")
    if not idat or chunks[-1][0] != b"IEND" or position != len(data):
        return "PNG is missing IDAT/IEND or has trailing data"
    try:
        inflater = zlib.decompressobj()
        decoded = inflater.decompress(idat, MAX_DECODED_BYTES + 1)
        if len(decoded) > MAX_DECODED_BYTES or inflater.unconsumed_tail:
            return "PNG decoded payload exceeds the safety limit"
        decoded += inflater.flush()
        if len(decoded) > MAX_DECODED_BYTES:
            return "PNG decoded payload exceeds the safety limit"
        if not inflater.eof or inflater.unused_data:
            return "PNG image data stream is incomplete or has trailing data"
        if not decoded:
            return "PNG image data is empty"
        channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color_type]
        if interlace == 0:
            row_bytes = (width * channels * bit_depth + 7) // 8
            if len(decoded) != height * (row_bytes + 1):
                return "PNG decoded payload length does not match its dimensions"
            offsets = [row * (row_bytes + 1) for row in range(height)]
        else:
            offsets = []
            expected = 0
            for x_start, y_start, x_step, y_step in (
                (0, 0, 8, 8),
                (4, 0, 8, 8),
                (0, 4, 4, 8),
                (2, 0, 4, 4),
                (0, 2, 2, 4),
                (1, 0, 2, 2),
                (0, 1, 1, 2),
            ):
                pass_width = 0 if width <= x_start else (width - x_start + x_step - 1) // x_step
                pass_height = 0 if height <= y_start else (height - y_start + y_step - 1) // y_step
                if pass_width == 0 or pass_height == 0:
                    continue
                row_bytes = (pass_width * channels * bit_depth + 7) // 8
                offsets.extend(expected + row * (row_bytes + 1) for row in range(pass_height))
                expected += pass_height * (row_bytes + 1)
            if len(decoded) != expected:
                return "PNG Adam7 payload length does not match its dimensions"
        if any(decoded[offset] > 4 for offset in offsets):
            return "PNG scanline uses an invalid filter type"
    except (zlib.error, MemoryError):
        return "PNG image data is not decodable"
    return None


def _jpeg_problem(data: bytes) -> str | None:
    """Validate JPEG marker framing without pretending to decode DCT data."""
    if len(data) < 32 or not data.startswith(b"\xff\xd8") or not data.endswith(b"\xff\xd9"):
        return "JPEG payload is missing SOI/EOI framing"
    position = 2
    saw_sof = False
    saw_sos = False
    entropy_bytes = 0
    while position < len(data) - 2:
        if data[position] != 0xFF:
            return "JPEG marker stream is malformed"
        while position < len(data) and data[position] == 0xFF:
            position += 1
        if position >= len(data):
            return "JPEG marker stream is truncated"
        marker = data[position]
        position += 1
        if marker == 0xD9:
            break
        if marker == 0x00 or 0xD0 <= marker <= 0xD7 or marker == 0x01:
            return "JPEG contains an out-of-place standalone marker"
        if position + 2 > len(data):
            return "JPEG segment length is truncated"
        length = struct.unpack(">H", data[position:position + 2])[0]
        if length < 2 or position + length > len(data):
            return "JPEG segment length is invalid"
        payload = data[position + 2:position + length]
        position += length
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            if len(payload) < 6:
                return "JPEG SOF segment is truncated"
            precision = payload[0]
            height, width = struct.unpack(">HH", payload[1:5])
            components = payload[5]
            if precision not in (8, 12) or width == 0 or height == 0 or components not in (1, 2, 3, 4):
                return "JPEG SOF geometry is invalid"
            if len(payload) != 6 + 3 * components:
                return "JPEG SOF component table is malformed"
            saw_sof = True
        if marker == 0xDA:
            if not saw_sof or len(payload) < 4:
                return "JPEG SOS appears before a valid SOF"
            components = payload[0]
            if components < 1 or len(payload) != 4 + 2 * components:
                return "JPEG SOS component table is malformed"
            saw_sos = True
            while position < len(data) - 2:
                byte = data[position]
                if byte != 0xFF:
                    entropy_bytes += 1
                    position += 1
                    continue
                if position + 1 >= len(data):
                    return "JPEG entropy stream is truncated"
                following = data[position + 1]
                if following == 0x00:
                    entropy_bytes += 1
                    position += 2
                    continue
                if 0xD0 <= following <= 0xD7:
                    position += 2
                    continue
                break
    if not saw_sof or not saw_sos or entropy_bytes == 0:
        return "JPEG has no complete frame/scan payload"
    return None


def _image_payload_problem(path: str) -> str | None:
    extension = os.path.splitext(path)[1].lower()
    try:
        size = os.path.getsize(path)
        if size > MAX_IMAGE_BYTES:
            return "image exceeds the validation size limit"
        with open(path, "rb") as handle:
            data = handle.read()
    except (OSError, UnicodeError) as exc:
        return "could not read image (%s)" % exc
    if not data:
        return "image payload is empty"
    if extension == ".png":
        return _png_problem(data)
    if extension in (".jpg", ".jpeg"):
        return _jpeg_problem(data)
    if extension in (".tif", ".tiff"):
        if len(data) < 8 or data[:4] not in (b"II*\x00", b"MM\x00*"):
            return "invalid TIFF signature"
        endian = "<" if data[:2] == b"II" else ">"
        offset = struct.unpack(endian + "I", data[4:8])[0]
        return None if 8 <= offset < len(data) else "invalid TIFF IFD offset"
    if extension == ".webp":
        if len(data) < 20 or data[:4] != b"RIFF" or data[8:12] != b"WEBP" or data[12:16] not in (b"VP8 ", b"VP8L", b"VP8X"):
            return "invalid WebP container"
        declared = struct.unpack("<I", data[4:8])[0] + 8
        return None if declared <= len(data) else "truncated WebP container"
    if extension in (".heic", ".heif"):
        if len(data) < 16 or data[4:8] != b"ftyp":
            return "invalid HEIF container"
        brands = data[8:min(len(data), 64)]
        if not any(brand in brands for brand in (b"heic", b"heix", b"hevc", b"hevx", b"mif1", b"msf1")):
            return "unrecognised HEIF brand"
        return None
    if extension in RAW_EXTS:
        if len(data) < 16:
            return "RAW payload is too short"
        tiff = data[:4] in (b"II*\x00", b"MM\x00*")
        signatures = {
            ".cr2": tiff and data[8:10] == b"CR",
            ".cr3": data[4:8] == b"ftyp" and b"crx " in data[:64],
            ".nef": tiff,
            ".arw": tiff,
            ".raf": data.startswith(b"FUJIFILMCCD-RAW "),
            ".orf": data[:4] in (b"IIRO", b"MMOR"),
            ".rw2": data[:4] == b"IIU\x00",
            ".dng": tiff,
        }
        return None if signatures.get(extension, False) else "unrecognised %s RAW signature" % extension
    return "unsupported image extension"


def _scan_images(model_path: str, directory_name: str) -> dict[str, Any]:
    root = os.path.join(model_path, directory_name)
    result: dict[str, Any] = {
        "root": root,
        "files": [],
        "count": 0,
        "physical_count": 0,
        "problems": [],
    }
    if not os.path.isdir(root):
        result["problems"].append("missing %s/ directory" % directory_name)
        return result
    if not _is_contained(model_path, root):
        result["problems"].append("%s/ resolves outside the model folder" % directory_name)
        return result

    walk_errors: list[OSError] = []
    for current, dirs, filenames in os.walk(
        root,
        followlinks=False,
        onerror=walk_errors.append,
    ):
        safe_dirs: list[str] = []
        for name in dirs:
            child = os.path.join(current, name)
            if name.startswith("."):
                continue
            if not _is_contained(root, child):
                result["problems"].append("linked directory escapes %s/: %s" % (directory_name, name))
                continue
            if _is_linklike(child):
                # Avoid cycles and double counting. Internal directory links are
                # intentionally not followed; external ones are already errors.
                continue
            safe_dirs.append(name)
        dirs[:] = safe_dirs
        for filename in filenames:
            if filename.startswith(".") or filename == CHECKSUMS_NAME:
                continue
            path = os.path.join(current, filename)
            extension = os.path.splitext(filename)[1].lower()
            if extension not in IMAGE_EXTS:
                continue
            relative = os.path.relpath(path, root).replace("\\", "/")
            if not _is_contained(root, path):
                result["problems"].append("image resolves outside %s/: %s" % (directory_name, relative))
                continue
            if not os.path.isfile(path):
                result["problems"].append("image is not a regular file: %s" % relative)
                continue
            digest, hash_error = _sha256(path)
            payload_problem = _image_payload_problem(path)
            identity = None
            identity_error = None
            try:
                identity = _file_identity(path)
            except (OSError, ValueError, UnicodeError) as exc:
                identity_error = str(exc)
            valid = hash_error is None and payload_problem is None and identity_error is None
            if hash_error:
                result["problems"].append("could not hash %s (%s)" % (relative, hash_error))
            if payload_problem:
                result["problems"].append("invalid image %s (%s)" % (relative, payload_problem))
            if identity_error:
                result["problems"].append("could not identify %s (%s)" % (relative, identity_error))
            result["files"].append(
                {
                    "path": path,
                    "relative": relative,
                    "sha256": digest,
                    "valid": valid,
                    "checksum_verified": False,
                    "file_identity": identity,
                }
            )
    for error in walk_errors:
        result["problems"].append("could not traverse %s/ (%s)" % (directory_name, error))
    valid_digests = {record["sha256"] for record in result["files"] if record["valid"]}
    valid_files = [record for record in result["files"] if record["valid"]]
    if len(valid_files) != len(valid_digests):
        result["problems"].append(
            "%s/ contains duplicate image content; duplicate files are not distinct frames"
            % directory_name
        )
    result["physical_count"] = len(result["files"])
    result["count"] = len(valid_digests)
    return result


def count_images(path: str) -> int:
    """Compatibility helper: count unique, valid image payloads in one tree."""
    parent = os.path.dirname(path)
    return int(_scan_images(parent, os.path.basename(path))["count"])


def _manifest_relative(name: str) -> str | None:
    candidate = name.replace("\\", "/")
    drive, _tail = ntpath.splitdrive(candidate)
    if drive or ":" in candidate or candidate.startswith("/") or candidate.startswith("//"):
        return None
    if ".." in candidate.split("/"):
        return None
    marker = "/%s/" % REFERENCE_DIR
    if marker in "/" + candidate:
        candidate = ("/" + candidate).rsplit(marker, 1)[1]
    elif candidate.startswith(REFERENCE_DIR + "/"):
        candidate = candidate[len(REFERENCE_DIR) + 1:]
    return _normalise_relative_path(candidate)


def _validate_checksums(scan: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    root = scan["root"]
    manifest = os.path.join(root, CHECKSUMS_NAME)
    if not os.path.isfile(manifest):
        return ["missing %s/%s" % (REFERENCE_DIR, CHECKSUMS_NAME)]
    if not _is_contained(root, manifest):
        return ["%s resolves outside %s/" % (CHECKSUMS_NAME, REFERENCE_DIR)]
    text, error = _read_text(manifest)
    if error is not None or text is None:
        return ["could not read %s/%s (%s)" % (REFERENCE_DIR, CHECKSUMS_NAME, error)]

    matched_records: set[int] = set()
    seen_targets: set[int] = set()
    for line_number, line in enumerate(text.splitlines(), 1):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = re.fullmatch(r"([0-9A-Fa-f]{64})[ \t]+\*?(.+?)\s*", line)
        if match is None:
            problems.append("malformed checksum line %d" % line_number)
            continue
        expected, raw_name = match.group(1).lower(), match.group(2)
        relative = _manifest_relative(raw_name)
        if relative is None:
            problems.append("unsafe checksum path on line %d" % line_number)
            continue
        candidate = os.path.join(root, relative.replace("/", os.sep))
        if not _is_contained(root, candidate) or not os.path.isfile(candidate):
            problems.append("checksum target is missing or outside references: %s" % relative)
            continue
        identities = [
            index
            for index, record in enumerate(scan["files"])
            if _same_file(candidate, record["path"])
        ]
        if len(identities) != 1:
            problems.append("checksum target is not one unique reference image: %s" % relative)
            continue
        index = identities[0]
        if index in seen_targets:
            problems.append("duplicate/conflicting checksum entry for %s" % relative)
            continue
        seen_targets.add(index)
        matched_records.add(index)
        record = scan["files"][index]
        verification, verify_error = _stable_source_verification(
            record["path"],
            expected,
            record.get("file_identity"),
        )
        if verify_error is not None or verification is None:
            problems.append("checksum verification failed for %s (%s)" % (record["relative"], verify_error))
        elif record["sha256"] != expected:
            problems.append("checksum mismatch for %s" % record["relative"])
        else:
            record["checksum_verified"] = True

    for index, record in enumerate(scan["files"]):
        if index not in matched_records:
            problems.append("missing checksum entry for %s" % record["relative"])
    if not scan["files"]:
        problems.append("checksum manifest has no reference images to validate")
    return problems


def _find_scan_record(scan: dict[str, Any], path: str) -> dict[str, Any] | None:
    matches = [record for record in scan["files"] if _same_file(path, record["path"])]
    return matches[0] if len(matches) == 1 else None


def _load_state(model_path: str, reference_scan: dict[str, Any]) -> dict[str, Any]:
    state_path = os.path.join(model_path, STATE_NAME)
    result: dict[str, Any] = {
        "has_state": os.path.isfile(state_path),
        "reference_state": None,
        "allowed_cases": [],
        "case_a_sources": [],
        "case_a_source_records": [],
        "limitations": [],
        "problems": [],
    }
    if not result["has_state"]:
        result["problems"].append("missing %s" % STATE_NAME)
        return result
    if not _is_contained(model_path, state_path):
        result["problems"].append("%s resolves outside the model folder" % STATE_NAME)
        return result
    try:
        with open(state_path, encoding="utf-8", errors="strict") as handle:
            state = json.load(
                handle,
                object_pairs_hook=_json_object_without_duplicates,
                parse_constant=_reject_json_constant,
            )
    except (OSError, UnicodeError, json.JSONDecodeError, DuplicateJSONKey, ValueError) as exc:
        result["problems"].append("invalid %s (%s)" % (STATE_NAME, exc))
        return result
    if not isinstance(state, dict):
        result["problems"].append("%s must contain a JSON object" % STATE_NAME)
        return result
    if type(state.get("schema_version")) is not int or state.get("schema_version") != STATE_SCHEMA_VERSION:
        result["problems"].append("%s schema_version must be %d" % (STATE_NAME, STATE_SCHEMA_VERSION))
    reference_state = state.get("reference_state")
    if reference_state not in ("visual-only", "capture-backed"):
        result["problems"].append("%s reference_state must be visual-only or capture-backed" % STATE_NAME)
    else:
        result["reference_state"] = reference_state
    acknowledged = state.get("visual_only_acknowledged")
    if type(acknowledged) is not bool:
        result["problems"].append("%s visual_only_acknowledged must be a boolean" % STATE_NAME)
    raw_sources = state.get("case_a_sources")
    if not isinstance(raw_sources, list):
        result["problems"].append("%s case_a_sources must be a list" % STATE_NAME)
        raw_sources = []

    seen_records: list[dict[str, Any]] = []
    for index, raw_source in enumerate(raw_sources):
        relative = _normalise_relative_path(raw_source)
        label = "case_a_sources[%d]" % index
        if relative is None:
            result["problems"].append("%s must be a non-empty relative path" % label)
            continue
        absolute = os.path.join(model_path, relative.replace("/", os.sep))
        if not _is_contained(reference_scan["root"], absolute):
            result["problems"].append("%s must resolve under %s" % (label, REFERENCE_DIR))
            continue
        if not os.path.isfile(absolute):
            result["problems"].append("CASE A source is missing: %s" % relative)
            continue
        record = _find_scan_record(reference_scan, absolute)
        if record is None or not record["valid"]:
            result["problems"].append("CASE A source is not one valid reference image: %s" % relative)
            continue
        if not record["checksum_verified"]:
            result["problems"].append("CASE A source checksum is not verified: %s" % relative)
            continue
        if any(_same_file(record["path"], prior["path"]) for prior in seen_records):
            result["problems"].append("%s duplicates an existing CASE A source" % label)
            continue
        seen_records.append(record)
        result["case_a_sources"].append(relative)
        result["case_a_source_records"].append(record)

    if reference_state == "visual-only":
        result["allowed_cases"] = ["B"]
        result["limitations"].append("CASE A editing is unavailable because the references are visual-only.")
        if acknowledged is not True:
            result["problems"].append("%s visual_only_acknowledged must be true for visual-only references" % STATE_NAME)
        if raw_sources:
            result["problems"].append("%s case_a_sources must be empty for visual-only references" % STATE_NAME)
    elif reference_state == "capture-backed":
        result["allowed_cases"] = ["A", "B"]
        if acknowledged is not False:
            result["problems"].append("%s visual_only_acknowledged must be false for capture-backed references" % STATE_NAME)
        if not raw_sources:
            result["problems"].append("%s case_a_sources must contain at least one source for capture-backed references" % STATE_NAME)
        elif not result["case_a_source_records"]:
            result["problems"].append("%s has no valid CASE A source" % STATE_NAME)
    return result


def _file_identity(path: str) -> dict[str, int]:
    stat_result = os.stat(path, follow_symlinks=True)
    return {
        "device": int(stat_result.st_dev),
        "inode": int(stat_result.st_ino),
        "size": int(stat_result.st_size),
        "mtime_ns": int(stat_result.st_mtime_ns),
    }


def _stable_source_verification(
    path: str,
    expected_sha256: str,
    expected_identity: dict[str, int] | None = None,
) -> tuple[dict[str, Any] | None, str | None]:
    try:
        before = _file_identity(path)
        digest, error = _sha256(path)
        after = _file_identity(path)
    except (OSError, ValueError, UnicodeError) as exc:
        return None, str(exc)
    if error is not None or digest is None:
        return None, error
    if before != after:
        return None, "source changed while it was being verified"
    if expected_identity is not None and after != expected_identity:
        return None, "source file identity changed after inventory"
    if digest != expected_sha256:
        return None, "source digest no longer matches its validated checksum"
    return {"sha256": digest, "file_identity": after}, None


def inspect_model(
    models_dir: str,
    folder: str,
    ledger_row: dict[str, Any] | None,
) -> dict[str, Any]:
    path = os.path.join(models_dir, folder)
    slug = folder[:-len(SOURCE_SUFFIX)]
    brief = os.path.join(path, BRIEF_NAME)
    release = os.path.join(path, RELEASE_NAME)
    problems: list[str] = []

    if not _is_contained(models_dir, path):
        problems.append("model folder resolves outside models/")
    reference_scan = _scan_images(path, REFERENCE_DIR)
    select_scan = _scan_images(path, SELECTS_DIR)
    problems.extend(reference_scan["problems"])
    problems.extend(select_scan["problems"])
    checksum_problems = _validate_checksums(reference_scan)
    problems.extend(checksum_problems)

    reference_digests = {
        record["sha256"]
        for record in reference_scan["files"]
        if record["valid"] and record["checksum_verified"]
    }
    for record in select_scan["files"]:
        if record["valid"] and record["sha256"] not in reference_digests:
            problems.append(
                "select is not a copy of a checksum-verified reference: %s"
                % record["relative"]
            )

    brief_problem = _document_problem(brief, BRIEF_NAME)
    if brief_problem:
        problems.append(brief_problem)
    release_problem = _document_problem(release, RELEASE_NAME)
    if release_problem:
        problems.append(release_problem)
    release_authorisation_problem = _release_authorisation_problem(release)
    if release_authorisation_problem:
        problems.append(release_authorisation_problem)

    references = int(reference_scan["count"])
    selects = int(select_scan["count"])
    if references == 0:
        problems.append("no valid source frames found in %s" % REFERENCE_DIR)
    elif references < MIN_FRAMES_HARD:
        problems.append(
            "only %d unique valid source frames in %s (hard minimum %d, target %d)"
            % (references, REFERENCE_DIR, MIN_FRAMES_HARD, MIN_FRAMES_TARGET)
        )
    if selects < MIN_SELECTS or selects > MAX_SELECTS:
        problems.append("%d unique valid selects in %s (required %d or %d)" % (selects, SELECTS_DIR, MIN_SELECTS, MAX_SELECTS))
    if select_scan["physical_count"] < MIN_SELECTS or select_scan["physical_count"] > MAX_SELECTS:
        problems.append(
            "%d select image files in %s (folder must contain exactly %d or %d)"
            % (select_scan["physical_count"], SELECTS_DIR, MIN_SELECTS, MAX_SELECTS)
        )

    state = _load_state(path, reference_scan)
    problems.extend(state["problems"])
    retired = False
    ledger_row_present = ledger_row is not None
    if ledger_row is None:
        problems.append("missing exact ledger roster row for %s" % slug)
    else:
        retired = ledger_row["status"] == "retired"
        if ledger_row["frames"] != references:
            problems.append("ledger Frames %d does not match %d unique valid references" % (ledger_row["frames"], references))
        if ledger_row["selects"] != selects:
            problems.append("ledger Selects %d does not match %d unique valid selects" % (ledger_row["selects"], selects))
        if ledger_row["reference_state"] != state["reference_state"]:
            problems.append("ledger Reference state does not match %s" % STATE_NAME)
        if ledger_row["allowed_cases"] != state["allowed_cases"]:
            problems.append("ledger Allowed cases do not match %s" % STATE_NAME)

    limitations = list(state["limitations"])
    if retired:
        limitations.append("The ledger status is retired; explicit and generic requests are blocked.")
    record_valid = not problems
    return {
        "slug": slug,
        "folder": folder,
        "path": path,
        "frames": references,
        "has_brief": os.path.isfile(brief),
        "problems": problems,
        "usable": record_valid and not retired,
        "selects": selects,
        "has_release": os.path.isfile(release),
        "has_state": state["has_state"],
        "ledger_row_present": ledger_row_present,
        "ledger_status": ledger_row["status"] if ledger_row else None,
        "reference_state": state["reference_state"],
        "allowed_cases": state["allowed_cases"],
        "case_a_sources": state["case_a_sources"],
        "limitations": limitations,
        "_record_valid": record_valid,
        "_retired": retired,
        "_case_a_source_records": state["case_a_source_records"],
        "_reference_root": reference_scan["root"],
    }


def _public_model(model: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in model.items() if not key.startswith("_")}


def _validate_run_arguments(
    models_dir: Any,
    only: Any,
    requested_case: Any,
    requested_source: Any,
) -> str | None:
    if not isinstance(models_dir, str) or not models_dir.strip():
        return "--models-dir must be a nonempty path"
    if only is not None:
        if not isinstance(only, str) or not only or only != only.strip():
            return "--model must be nonempty and contain no surrounding whitespace"
        if not SLUG_RE.fullmatch(only):
            return "--model must be a canonical model slug"
    if requested_case not in (None, "A", "B"):
        return "--case must be A or B"
    if requested_case is not None and only is None:
        return "a case-specific gate requires --model"
    if requested_source is not None:
        if not isinstance(requested_source, str) or not requested_source.strip():
            return "--source must be a nonempty path"
        if requested_case != "A":
            return "--source is valid only with --case A"
    if requested_case == "A" and requested_source is None:
        return "--case A requires --source"
    return None


def _layout_error(result: dict[str, Any], message: str) -> dict[str, Any]:
    result.update(status="BAD_LAYOUT", code=4, message=message)
    return result


def _template_problem(models_dir: str) -> str | None:
    template = os.path.join(models_dir, TEMPLATE_DIR)
    if not os.path.isdir(template) or not _is_contained(models_dir, template):
        return "models/ is missing a contained %s/ directory" % TEMPLATE_DIR
    for name in TEMPLATE_FILES:
        path = os.path.join(template, name)
        if not os.path.isfile(path) or not _is_contained(template, path):
            return "%s/ is missing contained file %s" % (TEMPLATE_DIR, name)
        text, error = _read_text(path)
        if error is not None or text is None or not text.strip():
            return "%s/%s is empty or unreadable" % (TEMPLATE_DIR, name)
    for name in TEMPLATE_DIRECTORIES:
        path = os.path.join(template, name)
        if not os.path.isdir(path) or not _is_contained(template, path):
            return "%s/ is missing contained directory %s/" % (TEMPLATE_DIR, name)
    return None


def _candidate_folders(models_dir: str) -> tuple[dict[str, str], list[str]]:
    candidates: dict[str, str] = {}
    errors: list[str] = []
    try:
        entries = list(os.scandir(models_dir))
    except (OSError, UnicodeError) as exc:
        return {}, ["Could not read models/ (%s)" % exc]
    physical_directories: list[tuple[str, str]] = []
    for entry in entries:
        name = entry.name
        if name.startswith(".") or name == TEMPLATE_DIR:
            continue
        try:
            is_dir = entry.is_dir(follow_symlinks=True)
        except (OSError, UnicodeError) as exc:
            errors.append("could not inspect models entry %r (%s)" % (name, exc))
            continue
        if not is_dir:
            if name.endswith(SOURCE_SUFFIX):
                errors.append("model candidate %r is not a directory" % name)
            continue
        match = FOLDER_RE.fullmatch(name)
        if match is None:
            errors.append("malformed model candidate folder %r" % name)
            continue
        slug = match.group(1)
        if slug in candidates:
            errors.append("duplicate model slug %s" % slug)
            continue
        path = os.path.join(models_dir, name)
        if not _is_contained(models_dir, path):
            errors.append("model candidate %r resolves outside models/" % name)
            continue
        if _same_file(path, os.path.join(models_dir, TEMPLATE_DIR)):
            errors.append("model candidate %r aliases %s/" % (name, TEMPLATE_DIR))
            continue
        alias = next(
            (prior_name for prior_name, prior_path in physical_directories if _same_file(path, prior_path)),
            None,
        )
        if alias is not None:
            errors.append("model candidates %r and %r resolve to the same directory" % (alias, name))
            continue
        physical_directories.append((name, path))
        candidates[slug] = name
    return candidates, errors


def _requested_source_verification(model: dict[str, Any], source: str) -> tuple[dict[str, Any] | None, str | None]:
    candidate = source
    if not os.path.isabs(candidate):
        candidate = os.path.join(model["path"], candidate)
    if not _is_contained(model["_reference_root"], candidate):
        return None, "requested source resolves outside the reference folder"
    if not os.path.isfile(candidate):
        return None, "requested source is missing or not a regular file"
    matching = [
        record
        for record in model["_case_a_source_records"]
        if _same_file(candidate, record["path"])
    ]
    if len(matching) != 1:
        return None, "requested source is not one exact file identity registered in %s" % STATE_NAME
    record = matching[0]
    verification, error = _stable_source_verification(
        candidate,
        record["sha256"],
        record.get("file_identity"),
    )
    if error:
        return None, error
    assert verification is not None
    verification["path"] = os.path.abspath(candidate)
    verification["toctou_limitation"] = (
        "Verified only at preflight time; downstream must re-check file identity "
        "and SHA-256 immediately before reading or editing the source."
    )
    return verification, None


def run(
    models_dir: str,
    only: str | None = None,
    requested_case: str | None = None,
    requested_source: str | None = None,
) -> dict[str, Any]:
    argument_error = _validate_run_arguments(models_dir, only, requested_case, requested_source)
    if argument_error:
        return _invalid_result(models_dir, argument_error)
    result = _base_result(models_dir)
    if requested_case is not None:
        result["requested_case"] = requested_case
    if requested_source is not None:
        result["requested_source"] = requested_source

    if not os.path.isdir(models_dir):
        return _layout_error(result, "No models/ directory at %s." % models_dir)
    template_problem = _template_problem(models_dir)
    if template_problem:
        return _layout_error(result, template_problem + ".")
    ledger_path = os.path.join(models_dir, LEDGER_NAME)
    result["ledger_present"] = os.path.isfile(ledger_path) and _is_contained(models_dir, ledger_path)
    if not result["ledger_present"]:
        return _layout_error(result, "models/ is missing a contained %s." % LEDGER_NAME)
    ledger_text, ledger_error = _read_text(ledger_path)
    if ledger_error is not None or ledger_text is None:
        return _layout_error(result, "Could not read %s (%s)." % (LEDGER_NAME, ledger_error))
    roster = _parse_roster(ledger_text)
    if roster["errors"]:
        return _layout_error(result, "Malformed roster: " + "; ".join(roster["errors"]))

    candidates, candidate_errors = _candidate_folders(models_dir)
    if candidate_errors:
        return _layout_error(result, "Malformed models/: " + "; ".join(candidate_errors))
    orphan_rows = sorted(set(roster["rows"]) - set(candidates))
    if orphan_rows:
        return _layout_error(result, "Roster rows have no canonical model folder: %s" % ", ".join(orphan_rows))
    if roster["sentinel"] and candidates:
        return _layout_error(result, "Roster none-yet row conflicts with model folders.")
    if not candidates:
        result.update(
            status="NO_MODELS",
            code=2,
            message=(
                "Only model-template is present. No model has been ingested, so "
                "there is no consented source material to work from."
            ),
        )
        return result

    models = [
        inspect_model(models_dir, folder, roster["rows"].get(slug))
        for slug, folder in sorted(candidates.items())
    ]
    if only is not None:
        models = [model for model in models if model["slug"] == only]
        if not models:
            result.update(status="INCOMPLETE", code=3, message="No model matching %r was found." % only)
            return result

    if requested_case is not None:
        for model in models:
            model["request_allowed"] = False

    if only is not None and models[0]["_retired"]:
        result["models"] = [_public_model(model) for model in models]
        result.update(
            status="CASE_BLOCKED",
            code=5,
            message="The explicitly requested model %s is retired in the roster." % models[0]["slug"],
        )
        return result

    usable = [model for model in models if model["usable"]]
    if not usable:
        result["models"] = [_public_model(model) for model in models]
        lines = ["Model folders exist but none passes validation. STOP."]
        for model in models:
            reasons = model["problems"] or model["limitations"] or ["not active"]
            lines.append("  %s: %s" % (model["folder"], "; ".join(reasons)))
        result.update(status="INCOMPLETE", code=3, message="\n".join(lines))
        return result

    if requested_case is not None:
        model = models[0]
        if requested_case == "B":
            model["request_allowed"] = model["usable"] and "B" in model["allowed_cases"]
            if not model["request_allowed"]:
                result["models"] = [_public_model(item) for item in models]
                result.update(status="CASE_BLOCKED", code=5, message="CASE B is not allowed for the requested model.")
                return result
        else:
            verification = None
            verification_error = None
            if model["usable"] and "A" in model["allowed_cases"]:
                verification, verification_error = _requested_source_verification(model, requested_source or "")
            model["request_allowed"] = verification is not None
            if verification is None:
                result["models"] = [_public_model(item) for item in models]
                reason = verification_error
                if model["reference_state"] != "capture-backed":
                    reason = "CASE A is unavailable for visual-only references."
                result.update(status="CASE_BLOCKED", code=5, message="CASE A blocked. %s" % reason)
                return result
            result["requested_source_sha256"] = verification["sha256"]
            result["requested_source_file_identity"] = verification["file_identity"]
            result["requested_source_verification"] = verification
            # Straightforward aliases make the fingerprint convenient for
            # downstream consumers while the requested_* names remain explicit.
            result["source_sha256"] = verification["sha256"]
            result["source_size"] = verification["file_identity"]["size"]
            result["source_file_identity"] = verification["file_identity"]

    result["models"] = [_public_model(model) for model in models]
    result.update(status="READY", code=0)
    names = ", ".join(
        "%s (%d frames, %d selects, %s)" % (model["slug"], model["frames"], model["selects"], model["reference_state"])
        for model in usable
    )
    result["message"] = (
        "READY for CASE %s. Usable models: %s" % (requested_case, names)
        if requested_case
        else "READY. Usable models: %s" % names
    )
    if len(usable) < len(models):
        skipped = [model for model in models if not model["usable"]]
        result["message"] += "\nUnusable and skipped: " + "; ".join(
            "%s (%s)" % (model["folder"], "; ".join(model["problems"] or model["limitations"]))
            for model in skipped
        )
    return result


def _build_parser() -> GateArgumentParser:
    parser = GateArgumentParser(description="Model and operation gate for natural-photography-stinger")
    parser.add_argument("--models-dir", default=None)
    parser.add_argument("--model", default=None, help="check only this model slug")
    parser.add_argument("--case", choices=("A", "B"), default=None)
    parser.add_argument("--source", default=None, help="source path for CASE A")
    parser.add_argument("--json", action="store_true")
    return parser


def main(argv: Iterable[str] | None = None) -> int:
    raw_args = list(sys.argv[1:] if argv is None else argv)
    wants_json = "--json" in raw_args
    parser = _build_parser()
    try:
        args = parser.parse_args(raw_args)
    except CLIUsageError as exc:
        result = _invalid_result(None, str(exc))
        if wants_json:
            print(json.dumps(result, indent=2))
        else:
            print("[INVALID_ARGUMENTS] %s" % result["message"], file=sys.stderr)
        return INVALID_ARGUMENTS_CODE

    models_dir = default_models_dir() if args.models_dir is None else args.models_dir
    result = run(models_dir, args.model, args.case, args.source)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        stream = sys.stderr if result["status"] == "INVALID_ARGUMENTS" else sys.stdout
        print("[%s] %s" % (result["status"], result["message"]), file=stream)
    return int(result["code"])


if __name__ == "__main__":
    sys.exit(main())
