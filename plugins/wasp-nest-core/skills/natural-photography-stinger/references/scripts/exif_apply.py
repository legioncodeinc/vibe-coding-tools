#!/usr/bin/env python3
"""
exif_apply.py - the metadata layer for natural-photography-stinger.

Implements the three cases defined in guides/11-metadata-and-exif.md.

THE RULE THIS SCRIPT ENFORCES:
  EXIF describing a capture event may only be carried by an image that
  derives from that capture event.

  CASE A  inherit   Output derives from a specific named source frame.
                    Inherit that frame's genuine capture EXIF in full.
  CASE B  scene     Output is a novel composite or generation with no single
                    source frame. Write internally coherent technical EXIF.
                    Body serial, lens serial, GPS and capture timestamp are
                    REFUSED in this mode; there is no capture event to describe.
  CASE C  publish   Strip location and identifiers for publication while
                    preserving technical, authorship and rights data.

Requires exiftool on PATH.

Usage:
  exif_apply.py inherit --source SRC --target DST [--source-type VALUE] [--keep-gps]
  exif_apply.py scene   --target DST --profile PROFILE.json [--source-type VALUE]
  exif_apply.py publish --target DST [--keep-contact]
  exif_apply.py inspect --target DST
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone

IPTC_SCHEME = "http://cv.iptc.org/newscodes/digitalsourcetype/"

# IPTC DigitalSourceType values relevant to this workflow.
# Retired values (softwareImage, digitalArt, minorHumanEdits) are excluded
# on purpose. See guides/11-metadata-and-exif.md.
SOURCE_TYPES = {
    "digitalCapture": "Original photograph from a camera, unmodified in kind.",
    "computationalCapture": "Camera output built computationally (phone HDR merge, portrait mode).",
    "humanEdits": "Photograph edited by a human using non-generative tools.",
    "algorithmicallyEnhanced": "Photograph enhanced algorithmically without generative synthesis.",
    "compositeWithTrainedAlgorithmicMedia": "Real photograph with generative elements added or altered.",
    "trainedAlgorithmicMedia": "Image created wholly by a generative model.",
    "composite": "Composite of multiple sources.",
    "compositeCapture": "Composite built only from real captures.",
}

# Tags that assert a specific physical capture event. Never fabricated in
# CASE B, never carried onto an image that did not come from that capture.
CAPTURE_IDENTITY_TAGS = [
    "SerialNumber", "BodySerialNumber", "InternalSerialNumber",
    "LensSerialNumber", "CameraSerialNumber",
    "GPSLatitude", "GPSLongitude", "GPSAltitude", "GPSPosition",
    "GPSLatitudeRef", "GPSLongitudeRef", "GPSAltitudeRef",
    "GPSDateStamp", "GPSTimeStamp", "GPSDateTime", "GPSCoordinates",
    "DateTimeOriginal", "CreateDate", "OffsetTimeOriginal",
    "ImageUniqueID", "OriginalRawFileName", "ShutterCount", "ImageNumber",
]

# Stripped at publish time. Normal professional privacy practice.
PUBLISH_STRIP_TAGS = [
    "GPS:all",
    "SerialNumber", "BodySerialNumber", "InternalSerialNumber",
    "LensSerialNumber", "CameraSerialNumber",
    "OwnerName", "CameraOwnerName", "ImageUniqueID",
    "OriginalRawFileName", "ShutterCount",
]


def die(msg: str, code: int = 1):
    print("ERROR: %s" % msg, file=sys.stderr)
    sys.exit(code)


def require_exiftool() -> str:
    path = shutil.which("exiftool")
    if not path:
        die("exiftool not found on PATH. Install it before running this script.")
    return path


def sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def run_exiftool(args: list[str]) -> subprocess.CompletedProcess:
    cmd = [require_exiftool()] + args
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        die("exiftool failed:\n%s\n%s" % (proc.stdout.strip(), proc.stderr.strip()))
    return proc


def read_tags(path: str) -> dict:
    proc = run_exiftool(["-a", "-G1", "-s", "-json", "-n", path])
    data = json.loads(proc.stdout)
    return data[0] if data else {}


def source_type_uri(value: str) -> str:
    if value not in SOURCE_TYPES:
        die(
            "Unknown DigitalSourceType '%s'. Valid values:\n  %s"
            % (value, "\n  ".join("%s: %s" % (k, v) for k, v in SOURCE_TYPES.items()))
        )
    return IPTC_SCHEME + value


def stamp_history(target: str, note: str) -> list[str]:
    now = datetime.now(timezone.utc).strftime("%Y:%m:%d %H:%M:%S+00:00")
    return [
        "-XMP-xmp:ModifyDate=%s" % now,
        "-XMP-photoshop:DateCreated<${DateTimeOriginal}",
        "-Software=natural-photography-stinger",
        "-XMP-xmp:CreatorTool=natural-photography-stinger",
        "-XMP-dc:description-en-US=%s" % note if note else "-XMP-xmp:Label=",
    ]


def cmd_inherit(args) -> int:
    """CASE A. Output derives from a named source frame."""
    if not os.path.isfile(args.source):
        die("Source frame not found: %s" % args.source)
    if not os.path.isfile(args.target):
        die("Target not found: %s" % args.target)

    src_hash = sha256(args.source)
    tgt_hash_before = sha256(args.target)
    src_tags = read_tags(args.source)

    if not src_tags.get("EXIF:Model") and not src_tags.get("IFD0:Model"):
        print(
            "WARNING: source frame carries no camera Model tag. It may not be "
            "an original capture. Inheriting anyway, but verify the source.",
            file=sys.stderr,
        )

    # Copy the full genuine metadata block, preserving group structure.
    argv = ["-tagsFromFile", args.source, "-all:all"]

    # MakerNotes need Make and Model alongside them to be interpretable.
    argv += ["-makernotes", "-make", "-model"]

    if not args.keep_gps:
        argv += ["-gps:all="]

    argv += [
        "-XMP-iptcExt:DigitalSourceType=%s" % source_type_uri(args.source_type),
        "-Software=natural-photography-stinger",
        "-overwrite_original",
        "-P",
        args.target,
    ]

    run_exiftool(argv)

    lineage = {
        "case": "A_inherit",
        "written_utc": datetime.now(timezone.utc).isoformat(),
        "source_frame": os.path.abspath(args.source),
        "source_sha256": src_hash,
        "output": os.path.abspath(args.target),
        "output_sha256_before_metadata": tgt_hash_before,
        "output_sha256_after_metadata": sha256(args.target),
        "digital_source_type": source_type_uri(args.source_type),
        "gps_retained": bool(args.keep_gps),
        "inherited_camera": src_tags.get("IFD0:Model") or src_tags.get("EXIF:Model"),
        "inherited_lens": src_tags.get("ExifIFD:LensModel") or src_tags.get("EXIF:LensModel"),
        "inherited_datetime": src_tags.get("ExifIFD:DateTimeOriginal"),
    }
    write_lineage(args.target, lineage)
    print("CASE A applied. Inherited capture EXIF from %s" % args.source)
    print("Lineage: %s" % lineage_path(args.target))
    return 0


def cmd_scene(args) -> int:
    """CASE B. Novel composite or generation. No borrowed capture identity."""
    if not os.path.isfile(args.target):
        die("Target not found: %s" % args.target)
    if not os.path.isfile(args.profile):
        die("Profile not found: %s" % args.profile)

    with open(args.profile) as fh:
        profile = json.load(fh)

    # Refuse capture-identity tags outright. This is the boundary.
    refused = [k for k in profile if k in CAPTURE_IDENTITY_TAGS]
    if refused:
        die(
            "REFUSED. The scene profile contains tags that assert a specific "
            "physical capture event:\n  %s\n"
            "This output has no source frame, so there is no capture event for "
            "them to describe. Writing them would claim a photograph was taken "
            "that was not. Remove them from the profile.\n"
            "See guides/11-metadata-and-exif.md, CASE B."
            % ", ".join(sorted(refused))
        )

    st = args.source_type
    if st in ("digitalCapture", "computationalCapture"):
        die(
            "REFUSED. DigitalSourceType '%s' asserts camera origin, but CASE B "
            "output did not come from a camera. Use "
            "'trainedAlgorithmicMedia' or 'compositeWithTrainedAlgorithmicMedia'."
            % st
        )

    argv = []
    for tag, value in profile.items():
        argv.append("-%s=%s" % (tag, value))

    argv += [
        "-XMP-iptcExt:DigitalSourceType=%s" % source_type_uri(st),
        "-Software=natural-photography-stinger",
        "-XMP-xmp:CreatorTool=natural-photography-stinger",
        "-overwrite_original",
        "-P",
        args.target,
    ]

    run_exiftool(argv)

    lineage = {
        "case": "B_scene",
        "written_utc": datetime.now(timezone.utc).isoformat(),
        "source_frame": None,
        "output": os.path.abspath(args.target),
        "output_sha256": sha256(args.target),
        "digital_source_type": source_type_uri(st),
        "profile": profile,
        "capture_identity_written": False,
    }
    write_lineage(args.target, lineage)
    print("CASE B applied. Scene EXIF written; no capture identity asserted.")
    print("Lineage: %s" % lineage_path(args.target))
    return 0


def cmd_publish(args) -> int:
    """CASE C. Privacy strip for publication."""
    if not os.path.isfile(args.target):
        die("Target not found: %s" % args.target)

    before = read_tags(args.target)
    argv = ["-%s=" % t for t in PUBLISH_STRIP_TAGS]
    argv += ["-overwrite_original", "-P", args.target]
    run_exiftool(argv)
    after = read_tags(args.target)

    removed = sorted(set(before) - set(after))
    print("CASE C applied. Removed %d tag(s)." % len(removed))
    for t in removed:
        print("  - %s" % t)
    kept = [k for k in after if k.split(":")[-1] in (
        "Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO",
        "FocalLength", "Artist", "Copyright", "DigitalSourceType")]
    print("Preserved technical/rights tags: %s" % (", ".join(sorted(kept)) or "none"))
    return 0


def cmd_inspect(args) -> int:
    tags = read_tags(args.target)
    interesting = {
        k: v for k, v in tags.items()
        if any(s in k for s in (
            "Make", "Model", "Lens", "FNumber", "Exposure", "ISO", "Focal",
            "GPS", "Serial", "DateTime", "CreateDate", "DigitalSourceType",
            "Software", "Artist", "Copyright"))
    }
    print(json.dumps(interesting, indent=2, sort_keys=True))
    lp = lineage_path(args.target)
    if os.path.isfile(lp):
        print("\n--- lineage ---")
        with open(lp) as fh:
            print(fh.read())
    return 0


def lineage_path(target: str) -> str:
    base = os.path.splitext(target)[0]
    return base + ".lineage.json"


def write_lineage(target: str, record: dict) -> None:
    with open(lineage_path(target), "w") as fh:
        json.dump(record, fh, indent=2)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("inherit", help="CASE A: inherit capture EXIF from a named source frame")
    a.add_argument("--source", required=True)
    a.add_argument("--target", required=True)
    a.add_argument("--source-type", default="compositeWithTrainedAlgorithmicMedia")
    a.add_argument("--keep-gps", action="store_true")
    a.set_defaults(func=cmd_inherit)

    b = sub.add_parser("scene", help="CASE B: coherent scene EXIF, no capture identity")
    b.add_argument("--target", required=True)
    b.add_argument("--profile", required=True)
    b.add_argument("--source-type", default="trainedAlgorithmicMedia")
    b.set_defaults(func=cmd_scene)

    c = sub.add_parser("publish", help="CASE C: privacy strip for publication")
    c.add_argument("--target", required=True)
    c.add_argument("--keep-contact", action="store_true")
    c.set_defaults(func=cmd_publish)

    i = sub.add_parser("inspect", help="show the metadata that matters")
    i.add_argument("--target", required=True)
    i.set_defaults(func=cmd_inspect)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
