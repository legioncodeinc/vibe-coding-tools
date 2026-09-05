#!/usr/bin/env python3
"""Read-only, deterministic inspection of a Tauri 2 project.

The script uses only the Python standard library, performs no network calls,
executes no project commands, and writes nothing. JSON is the only stdout
format. Exit code 0 means the inspector found no error findings and no
unresolved manual-review boundary. Exit code 1 means a failed inspection or
manual review is required. Exit code 2 means usage or environment error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.parse import urlsplit


SCHEMA_VERSION = 1
MAX_TEXT_BYTES = 4 * 1024 * 1024
CONFIG_NAMES = ("tauri.conf.json", "tauri.conf.json5", "Tauri.toml")
PLATFORM_CONFIG_RE = re.compile(
    r"^(?:tauri\.(?:linux|windows|macos|android|ios)\.conf\.json|"
    r"Tauri\.(?:linux|windows|macos|android|ios)\.toml)$"
)
VERSION_RE = re.compile(r"^\s*[=~^v]*\s*(\d+)\.(\d+)(?:\.(\d+))?\s*$")
DEPENDENCY_LINE_RE = re.compile(r"^\s*([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*$")
SECTION_RE = re.compile(r"^\s*\[([^]]+)]\s*$")
QUOTED_RE = re.compile(r'"([^"\\]*(?:\\.[^"\\]*)*)"')
PACKAGE_FIELD_RE = re.compile(r'\bpackage\s*=\s*"([^"]+)"')
VERSION_FIELD_RE = re.compile(r'\bversion\s*=\s*"([^"]+)"')


def emit(payload: Dict[str, Any], pretty: bool = False) -> None:
    print(json.dumps(payload, indent=2 if pretty else None, sort_keys=True))


def read_text(path: Path) -> str:
    size = path.stat().st_size
    if size > MAX_TEXT_BYTES:
        raise ValueError(f"file exceeds {MAX_TEXT_BYTES} byte inspection limit")
    return path.read_text(encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(read_text(path))


def version_tuple(spec: Optional[str]) -> Optional[Tuple[int, int, Optional[int]]]:
    if not spec:
        return None
    match = VERSION_RE.match(spec)
    if not match:
        return None
    patch = int(match.group(3)) if match.group(3) is not None else None
    return int(match.group(1)), int(match.group(2)), patch


def version_text(parts: Optional[Tuple[int, int, Optional[int]]]) -> Optional[str]:
    if parts is None:
        return None
    major, minor, patch = parts
    return f"{major}.{minor}" if patch is None else f"{major}.{minor}.{patch}"


def redact_url(value: Any) -> Any:
    """Keep report URLs useful without disclosing userinfo, query, or fragment."""
    if not isinstance(value, str):
        return value
    parsed = urlsplit(value)
    if not parsed.scheme or not parsed.netloc:
        return value
    host = parsed.hostname or "<redacted-host>"
    suffix = "?…" if parsed.query else ""
    return f"{parsed.scheme}://{host}{parsed.path}{suffix}"


def dependency_spec(rhs: str) -> Tuple[Optional[str], str]:
    rhs = rhs.strip()
    if rhs.startswith('"'):
        match = QUOTED_RE.match(rhs)
        return (match.group(1) if match else None), "version"
    if rhs.startswith("{"):
        version_match = VERSION_FIELD_RE.search(rhs)
        if version_match:
            return version_match.group(1), "inline-table"
        if re.search(r"\bworkspace\s*=\s*true\b", rhs):
            return None, "workspace"
        if re.search(r"\b(?:git|path)\s*=", rhs):
            return None, "git-or-path"
        return None, "inline-table-without-version"
    return None, "unparsed"


def parse_cargo_dependencies(text: str) -> Dict[str, List[Dict[str, Any]]]:
    result: Dict[str, List[Dict[str, Any]]] = {}
    section = ""
    for raw_line in text.splitlines():
        section_match = SECTION_RE.match(raw_line)
        if section_match:
            section = section_match.group(1)
            continue
        if "dependencies" not in section:
            continue
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        dep_match = DEPENDENCY_LINE_RE.match(line)
        if not dep_match:
            continue
        alias, rhs = dep_match.groups()
        package_match = PACKAGE_FIELD_RE.search(rhs)
        package = package_match.group(1) if package_match else alias
        if package != "tauri" and package != "tauri-build" and not package.startswith("tauri-plugin-"):
            continue
        spec, source = dependency_spec(rhs)
        result.setdefault(package, []).append(
            {
                "alias": alias,
                "section": section,
                "constraint": spec,
                "source": source,
            }
        )
    return result


def parse_npm_dependencies(package_data: Dict[str, Any]) -> Dict[str, Dict[str, str]]:
    result: Dict[str, Dict[str, str]] = {}
    for section in ("dependencies", "devDependencies", "optionalDependencies", "peerDependencies"):
        dependencies = package_data.get(section)
        if not isinstance(dependencies, dict):
            continue
        for name, value in dependencies.items():
            if not isinstance(name, str) or not isinstance(value, str):
                continue
            if name in ("@tauri-apps/api", "@tauri-apps/cli") or name.startswith("@tauri-apps/plugin-"):
                result[name] = {"constraint": value, "section": section}
    return result


def first_constraint(entries: Iterable[Dict[str, Any]]) -> Optional[str]:
    for entry in entries:
        value = entry.get("constraint")
        if isinstance(value, str):
            return value
    return None


def add_finding(
    findings: List[Dict[str, str]], severity: str, code: str, message: str, path: Optional[Path] = None
) -> None:
    finding = {"severity": severity, "code": code, "message": message}
    if path is not None:
        finding["path"] = str(path)
    findings.append(finding)


def alignment_findings(
    cargo: Dict[str, List[Dict[str, Any]]],
    npm: Dict[str, Dict[str, str]],
    findings: List[Dict[str, str]],
) -> List[Dict[str, Any]]:
    checks: List[Dict[str, Any]] = []
    cargo_tauri = first_constraint(cargo.get("tauri", []))
    npm_api = npm.get("@tauri-apps/api", {}).get("constraint")
    if cargo_tauri is not None or npm_api is not None:
        status = "missing-surface" if cargo_tauri is None or npm_api is None else "not-provable"
        checks.append(
            {
                "rule": "tauri-and-api-same-major-minor",
                "status": status,
                "cargo_tauri": cargo_tauri,
                "npm_api": npm_api,
            }
        )
        if status == "missing-surface":
            add_finding(
                findings,
                "info",
                "core-surface-missing",
                "Only one of Cargo tauri and npm @tauri-apps/api is present; the minor alignment rule applies when both are used",
            )
        elif status == "not-provable":
            add_finding(
                findings,
                "warning",
                "core-alignment-not-provable",
                "Manifest constraints cannot prove Cargo tauri and npm @tauri-apps/api resolved minor alignment; inspect both lockfiles",
            )

    cargo_plugins = {name.removeprefix("tauri-plugin-"): entries for name, entries in cargo.items() if name.startswith("tauri-plugin-")}
    npm_plugins = {
        name.removeprefix("@tauri-apps/plugin-"): data
        for name, data in npm.items()
        if name.startswith("@tauri-apps/plugin-")
    }
    for plugin in sorted(set(cargo_plugins) | set(npm_plugins)):
        cargo_spec = first_constraint(cargo_plugins.get(plugin, []))
        npm_spec = npm_plugins.get(plugin, {}).get("constraint")
        status = "missing-peer" if cargo_spec is None or npm_spec is None else "not-provable"
        checks.append(
            {
                "rule": "plugin-exact-pair",
                "plugin": plugin,
                "status": status,
                "cargo": cargo_spec,
                "npm": npm_spec,
            }
        )
        if status == "missing-peer":
            add_finding(
                findings,
                "info",
                "plugin-surface-missing",
                f"Plugin {plugin!r} appears on one side only; exact pairing applies when both Rust and npm surfaces are used",
            )
        elif status == "not-provable":
            add_finding(
                findings,
                "warning",
                "plugin-alignment-not-provable",
                f"Plugin {plugin!r} exact Rust/npm alignment cannot be proved from manifest constraints; inspect both lockfiles",
            )
    return checks


def nested_true_args(value: Any) -> bool:
    if isinstance(value, dict):
        if value.get("args") is True:
            return True
        return any(nested_true_args(item) for item in value.values())
    if isinstance(value, list):
        return any(nested_true_args(item) for item in value)
    return False


def has_broad_tauri_env_prefix(text: str) -> bool:
    """Detect the literal broad TAURI_ Vite prefix, not TAURI_ENV_*."""
    return bool(re.search(r"envPrefix[\s\S]{0,300}['\"]TAURI_['\"]", text))


def inspect_capabilities(tauri_dir: Path, findings: List[Dict[str, str]]) -> Dict[str, Any]:
    directory = tauri_dir / "capabilities"
    result: Dict[str, Any] = {"directory": str(directory), "files": [], "memberships": {}}
    if not directory.is_dir():
        add_finding(findings, "warning", "capabilities-missing", "No src-tauri capabilities directory found", directory)
        return result

    memberships: Dict[str, List[str]] = {}
    for path in sorted(item for item in directory.rglob("*") if item.is_file()):
        relative = path.relative_to(directory).as_posix()
        entry: Dict[str, Any] = {"path": relative, "parsed": False}
        if path.suffix.lower() != ".json":
            entry["reason"] = "Only strict JSON capability files are parsed"
            result["files"].append(entry)
            continue
        try:
            data = read_json(path)
        except Exception as exc:
            entry["error"] = str(exc)
            result["files"].append(entry)
            add_finding(findings, "error", "capability-json-invalid", str(exc), path)
            continue
        if not isinstance(data, dict):
            entry["error"] = "capability root is not an object"
            result["files"].append(entry)
            add_finding(findings, "error", "capability-shape-invalid", "Capability root is not an object", path)
            continue
        identifier = data.get("identifier", relative)
        windows = data.get("windows", []) if isinstance(data.get("windows", []), list) else []
        webviews = data.get("webviews", []) if isinstance(data.get("webviews", []), list) else []
        remote = data.get("remote") if isinstance(data.get("remote"), dict) else {}
        permissions = data.get("permissions", []) if isinstance(data.get("permissions", []), list) else []
        entry.update(
            {
                "parsed": True,
                "identifier": identifier,
                "windows": windows,
                "webviews": webviews,
                "platforms": data.get("platforms"),
                "local": data.get("local", True),
                "remote_urls": [redact_url(url) for url in remote.get("urls", []) if isinstance(url, str)],
                "permission_count": len(permissions),
                "wildcard_target": "*" in windows or "*" in webviews,
                "arbitrary_args": nested_true_args(permissions),
            }
        )
        for target in windows + webviews:
            if isinstance(target, str):
                memberships.setdefault(target, []).append(str(identifier))
        if entry["remote_urls"]:
            add_finding(findings, "warning", "remote-capability", f"Capability {identifier!r} grants remote URLs", path)
        if entry["wildcard_target"]:
            add_finding(findings, "warning", "wildcard-capability-target", f"Capability {identifier!r} uses a wildcard target", path)
        if entry["arbitrary_args"]:
            add_finding(findings, "warning", "arbitrary-shell-args", f"Capability {identifier!r} contains args: true", path)
        result["files"].append(entry)

    result["memberships"] = memberships
    for target, identifiers in memberships.items():
        if len(identifiers) > 1:
            add_finding(
                findings,
                "warning",
                "capability-union",
                f"Target {target!r} appears in multiple capabilities: {', '.join(identifiers)}",
                directory,
            )
    return result


def inspect_config(tauri_dir: Path, findings: List[Dict[str, str]]) -> Dict[str, Any]:
    candidates = [tauri_dir / name for name in CONFIG_NAMES if (tauri_dir / name).is_file()]
    overlays = sorted(path.name for path in tauri_dir.iterdir() if path.is_file() and PLATFORM_CONFIG_RE.match(path.name))
    result: Dict[str, Any] = {"candidates": [str(path) for path in candidates], "platform_overlays": overlays}
    if not candidates:
        add_finding(findings, "error", "tauri-config-missing", "No supported Tauri configuration file found", tauri_dir)
        return result
    if len(candidates) > 1:
        add_finding(findings, "warning", "multiple-base-configs", "Multiple base Tauri configuration files found", tauri_dir)
    selected = candidates[0]
    result["selected"] = str(selected)
    if selected.name != "tauri.conf.json":
        result["parsed"] = False
        result["reason"] = "JSON5 and TOML are reported but not parsed by this standard-library inspector"
        return result
    try:
        data = read_json(selected)
    except Exception as exc:
        result["parsed"] = False
        result["error"] = str(exc)
        add_finding(findings, "error", "tauri-config-invalid", str(exc), selected)
        return result
    if not isinstance(data, dict):
        result["parsed"] = False
        result["error"] = "configuration root is not an object"
        add_finding(findings, "error", "tauri-config-shape-invalid", result["error"], selected)
        return result

    app = data.get("app") if isinstance(data.get("app"), dict) else {}
    security = app.get("security") if isinstance(app.get("security"), dict) else {}
    bundle = data.get("bundle") if isinstance(data.get("bundle"), dict) else {}
    plugins = data.get("plugins") if isinstance(data.get("plugins"), dict) else {}
    updater = plugins.get("updater") if isinstance(plugins.get("updater"), dict) else {}
    build = data.get("build") if isinstance(data.get("build"), dict) else {}
    remote_window_urls: List[Dict[str, str]] = []
    windows = app.get("windows") if isinstance(app.get("windows"), list) else []
    for window in windows:
        if not isinstance(window, dict):
            continue
        url = window.get("url")
        if isinstance(url, str) and re.match(r"^https?://", url):
            remote_window_urls.append({"label": str(window.get("label", "")), "url": redact_url(url)})
    if remote_window_urls:
        add_finding(findings, "warning", "remote-window-content", "One or more windows load remote HTTP content", selected)
    if security.get("csp") is None:
        add_finding(findings, "warning", "csp-null", "Tauri CSP is null or absent", selected)
    result.update(
        {
            "parsed": True,
            "identifier": data.get("identifier"),
            "version": data.get("version"),
            "frontend_dist": redact_url(build.get("frontendDist")),
            "dev_url": redact_url(build.get("devUrl")),
            "with_global_tauri": app.get("withGlobalTauri", False),
            "csp_present": security.get("csp") is not None,
            "selected_capabilities_present": security.get("capabilities") is not None,
            "remote_window_urls": remote_window_urls,
            "external_bin": bundle.get("externalBin", []),
            "create_updater_artifacts": bundle.get("createUpdaterArtifacts"),
            "updater_endpoints": [redact_url(url) for url in updater.get("endpoints", []) if isinstance(url, str)],
            "updater_pubkey_present": bool(updater.get("pubkey")),
            "legacy_tauri_key_present": "tauri" in data,
            "legacy_allowlist_present": isinstance(data.get("tauri"), dict) and "allowlist" in data["tauri"],
        }
    )
    if result["legacy_tauri_key_present"] or result["legacy_allowlist_present"]:
        add_finding(findings, "warning", "v1-config-indicator", "Tauri 1 configuration keys were detected", selected)
    return result


def inspect_vite_configs(root: Path, findings: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for name in ("vite.config.js", "vite.config.mjs", "vite.config.cjs", "vite.config.ts", "vite.config.mts"):
        path = root / name
        if not path.is_file():
            continue
        entry: Dict[str, Any] = {"path": str(path)}
        try:
            text = read_text(path)
        except Exception as exc:
            entry["error"] = str(exc)
            results.append(entry)
            continue
        broad_tauri_prefix = has_broad_tauri_env_prefix(text)
        entry["tauri_env_prefix_detected"] = broad_tauri_prefix
        if broad_tauri_prefix:
            add_finding(
                findings,
                "warning",
                "frontend-tauri-env-prefix",
                "Vite configuration mentions TAURI_ in an envPrefix context; inspect built assets and secret exposure",
                path,
            )
        results.append(entry)
    return results


def locate_tauri_dir(target: Path) -> Optional[Path]:
    if target.name == "src-tauri" and any((target / name).is_file() for name in CONFIG_NAMES):
        return target
    candidate = target / "src-tauri"
    if candidate.is_dir() and any((candidate / name).is_file() for name in CONFIG_NAMES):
        return candidate
    if any((target / name).is_file() for name in CONFIG_NAMES):
        return target
    return None


def inspect_project(target: Path) -> Dict[str, Any]:
    resolved = target.resolve()
    findings: List[Dict[str, str]] = []
    if not resolved.exists() or not resolved.is_dir():
        return {
            "schema_version": SCHEMA_VERSION,
            "status": "fail",
            "target": str(resolved),
            "findings": [{"severity": "error", "code": "target-invalid", "message": "Target is not a directory"}],
        }

    tauri_dir = locate_tauri_dir(resolved)
    if tauri_dir is None:
        return {
            "schema_version": SCHEMA_VERSION,
            "status": "fail",
            "target": str(resolved),
            "detected": False,
            "findings": [{"severity": "error", "code": "tauri-not-detected", "message": "No Tauri configuration marker found"}],
        }

    project_root = tauri_dir.parent if tauri_dir.name == "src-tauri" else resolved
    package_path = project_root / "package.json"
    cargo_path = tauri_dir / "Cargo.toml"
    npm_dependencies: Dict[str, Dict[str, str]] = {}
    cargo_dependencies: Dict[str, List[Dict[str, Any]]] = {}

    if package_path.is_file():
        try:
            package_data = read_json(package_path)
            if isinstance(package_data, dict):
                npm_dependencies = parse_npm_dependencies(package_data)
            else:
                add_finding(findings, "error", "package-json-shape-invalid", "package.json root is not an object", package_path)
        except Exception as exc:
            add_finding(findings, "error", "package-json-invalid", str(exc), package_path)
    else:
        add_finding(findings, "info", "package-json-absent", "No package.json found; this may be a Rust-only Tauri project", package_path)

    if cargo_path.is_file():
        try:
            cargo_dependencies = parse_cargo_dependencies(read_text(cargo_path))
        except Exception as exc:
            add_finding(findings, "error", "cargo-toml-unreadable", str(exc), cargo_path)
    else:
        add_finding(findings, "error", "cargo-toml-missing", "Cargo.toml is missing from the Tauri directory", cargo_path)

    checks = alignment_findings(cargo_dependencies, npm_dependencies, findings)
    config = inspect_config(tauri_dir, findings)
    capabilities = inspect_capabilities(tauri_dir, findings)
    frontend_locks = [
        name
        for name in ("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "deno.lock")
        if (project_root / name).is_file()
    ]
    if package_path.is_file() and not frontend_locks:
        add_finding(findings, "warning", "frontend-lock-missing", "package.json exists but no recognized frontend lockfile was found", project_root)
    if not (tauri_dir / "Cargo.lock").is_file():
        add_finding(findings, "warning", "cargo-lock-missing", "Cargo.lock was not found", tauri_dir)

    lib_path = tauri_dir / "src" / "lib.rs"
    build_rs_path = tauri_dir / "build.rs"
    mobile_entry = False
    if lib_path.is_file():
        try:
            mobile_entry = "tauri::mobile_entry_point" in read_text(lib_path)
        except Exception as exc:
            add_finding(findings, "warning", "lib-rs-unreadable", str(exc), lib_path)

    app_manifest_commands = False
    if build_rs_path.is_file():
        try:
            build_text = read_text(build_rs_path)
            app_manifest_commands = "AppManifest" in build_text and ".commands(" in build_text
        except Exception as exc:
            add_finding(findings, "warning", "build-rs-unreadable", str(exc), build_rs_path)

    invoke_handler_detected = False
    rust_files = sorted((tauri_dir / "src").rglob("*.rs")) if (tauri_dir / "src").is_dir() else []
    for rust_file in rust_files[:200]:
        try:
            if "invoke_handler" in read_text(rust_file):
                invoke_handler_detected = True
                break
        except Exception:
            continue
    if invoke_handler_detected and not app_manifest_commands:
        add_finding(
            findings,
            "info",
            "custom-command-permissions-not-detected",
            "invoke_handler was detected but AppManifest::commands was not; confirm whether custom commands need capability restrictions",
            build_rs_path,
        )

    permission_directory = tauri_dir / "permissions"
    permission_files = (
        sorted(path.relative_to(permission_directory).as_posix() for path in permission_directory.rglob("*") if path.is_file())
        if permission_directory.is_dir()
        else []
    )
    schema_directory = tauri_dir / "gen" / "schemas"
    schema_files = (
        sorted(path.relative_to(schema_directory).as_posix() for path in schema_directory.rglob("*") if path.is_file())
        if schema_directory.is_dir()
        else []
    )

    manual_review_reasons: List[str] = []
    if not config.get("parsed", False):
        manual_review_reasons.append("base configuration was not parsed")
    if config.get("platform_overlays"):
        manual_review_reasons.append("platform configuration overlays are not merged")
    if config.get("selected_capabilities_present"):
        manual_review_reasons.append("effective capability selection is not resolved")
    if any(check.get("status") == "not-provable" for check in checks):
        manual_review_reasons.append("resolved dependency versions were not read from lockfiles")

    result: Dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "status": "fail" if any(item["severity"] == "error" for item in findings) else "needs-manual-review" if manual_review_reasons else "pass",
        "target": str(resolved),
        "detected": True,
        "project_root": str(project_root),
        "tauri_dir": str(tauri_dir),
        "files": {
            "package_json": str(package_path) if package_path.is_file() else None,
            "frontend_lockfiles": frontend_locks,
            "cargo_toml": str(cargo_path) if cargo_path.is_file() else None,
            "cargo_lock": str(tauri_dir / "Cargo.lock") if (tauri_dir / "Cargo.lock").is_file() else None,
            "build_rs": str(build_rs_path) if build_rs_path.is_file() else None,
            "app_manifest_commands_detected": app_manifest_commands,
            "lib_rs": str(lib_path) if lib_path.is_file() else None,
            "mobile_entry_point_detected": mobile_entry,
            "rust_source_files_scanned": min(len(rust_files), 200),
            "invoke_handler_detected": invoke_handler_detected,
            "permission_files": permission_files,
            "generated_schema_files": schema_files,
            "generated_android": (tauri_dir / "gen" / "android").is_dir(),
            "generated_apple": (tauri_dir / "gen" / "apple").is_dir(),
        },
        "versions": {
            "npm": npm_dependencies,
            "cargo": cargo_dependencies,
            "normalized": {
                "cargo_tauri": version_text(version_tuple(first_constraint(cargo_dependencies.get("tauri", [])))),
                "npm_api": version_text(version_tuple(npm_dependencies.get("@tauri-apps/api", {}).get("constraint"))),
            },
        },
        "alignment": checks,
        "configuration": config,
        "capabilities": capabilities,
        "vite_configs": inspect_vite_configs(project_root, findings),
        "manual_review_reasons": manual_review_reasons,
        "findings": findings,
        "limitations": [
            "Manifest constraints are not resolved lockfile versions.",
            "Cargo.lock and frontend lockfiles are detected but not parsed.",
            "JSON5 and TOML Tauri configuration files are reported but not parsed.",
            "Custom command detection scans at most 200 Rust source files and does not prove authorization behavior.",
            "Capability glob overlap and URLPattern semantics require manual review.",
            "The script performs no security verdict, build, test, network request, or file mutation.",
        ],
    }
    return result


def self_test() -> Dict[str, Any]:
    cargo = parse_cargo_dependencies(
        """
[dependencies]
tauri = { version = "2.11.5", features = [] }
tauri-plugin-store = "2.4.4"
[build-dependencies]
tauri-build = "2.6.3"
""".strip()
    )
    npm = parse_npm_dependencies(
        {
            "dependencies": {
                "@tauri-apps/api": "^2.11.1",
                "@tauri-apps/plugin-store": "2.4.4",
            }
        }
    )
    findings: List[Dict[str, str]] = []
    checks = alignment_findings(cargo, npm, findings)
    assertions = {
        "cargo-core-found": "tauri" in cargo,
        "cargo-plugin-found": "tauri-plugin-store" in cargo,
        "npm-api-found": "@tauri-apps/api" in npm,
        "core-alignment-not-provable": any(item["rule"] == "tauri-and-api-same-major-minor" and item["status"] == "not-provable" for item in checks),
        "plugin-alignment-not-provable": any(item["rule"] == "plugin-exact-pair" and item["status"] == "not-provable" for item in checks),
        "no-error-findings": not any(item["severity"] == "error" for item in findings),
        "broad-tauri-prefix-detected": has_broad_tauri_env_prefix("envPrefix: ['VITE_', 'TAURI_']"),
        "narrow-tauri-env-prefix-not-flagged": not has_broad_tauri_env_prefix("envPrefix: ['VITE_', 'TAURI_ENV_*']"),
        "credential-url-redacted": redact_url("https://username:opaque@example.test/path?query=opaque#fragment") == "https://example.test/path?…",
    }
    passed = all(assertions.values())
    return {
        "schema_version": SCHEMA_VERSION,
        "status": "pass" if passed else "fail",
        "self_test": assertions,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Inspect a Tauri project without modifying it.")
    parser.add_argument("target", nargs="?", type=Path, help="Project root or src-tauri directory")
    parser.add_argument("--pretty", action="store_true", help="Indent JSON output")
    parser.add_argument("--self-test", action="store_true", help="Run deterministic in-memory parser checks")
    args = parser.parse_args()

    try:
        if args.self_test:
            result = self_test()
        elif args.target is None:
            emit({"schema_version": SCHEMA_VERSION, "status": "error", "message": "target is required unless --self-test is used"}, args.pretty)
            return 2
        else:
            result = inspect_project(args.target)
    except Exception as exc:  # noqa: BLE001
        emit({"schema_version": SCHEMA_VERSION, "status": "error", "message": str(exc)}, args.pretty)
        return 2

    emit(result, args.pretty)
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
