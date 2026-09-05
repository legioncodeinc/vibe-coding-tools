#!/usr/bin/env node
// Zero-dependency Electron ASAR metadata reader.
//
// Usage:
//   node asar-header.mjs <app.asar>              summary: size, entry hint, top-level tree, file count
//   node asar-header.mjs <app.asar> --list       print every file path in the archive
//   node asar-header.mjs <app.asar> <path>       header entry for one path (size, offset, unpacked, integrity)
//
// ASAR layout (verified against a real 292.9 MB archive):
//   bytes 0-3   uint32 = 4 (size-pickle payload)
//   bytes 4-7   uint32 = header pickle length H
//   bytes 8-11  uint32 = header payload size (H - 4)
//   bytes 12-15 uint32 = JSON index string length L
//   bytes 16..16+L    JSON index (4-byte padded)
//   bytes 8+H..       concatenated file blobs; header "offset" fields are relative to 8+H
import fs from "node:fs";

const [archive, ...args] = process.argv.slice(2);
if (!archive) {
  console.error("Usage: node asar-header.mjs <app.asar> [--list | <path>]");
  process.exit(1);
}

const buf = fs.readFileSync(archive);
const blobBase = 8 + buf.readUInt32LE(4);
const jsonLength = buf.readUInt32LE(12);
const header = JSON.parse(buf.slice(16, 16 + jsonLength).toString("utf8"));

const walk = (node, prefix, visit) => {
  for (const [name, child] of Object.entries(node.files ?? {})) {
    const path = prefix ? `${prefix}/${name}` : name;
    if (child.files) {
      visit(path, child, true);
      walk(child, path, visit);
    } else {
      visit(path, child, false);
    }
  }
};

let fileCount = 0;
let dirCount = 0;
walk(header, "", (_p, _c, isDir) => (isDir ? dirCount++ : fileCount++));

if (args[0] === "--list") {
  walk(header, "", (path, _c, isDir) => console.log((isDir ? "d " : "f ") + path));
} else if (args[0]) {
  const target = header.files;
  const parts = args[0].split("/").filter(Boolean);
  let node = { files: target };
  for (const part of parts) {
    node = node?.files?.[part];
    if (!node) {
      console.error(`not found in archive: ${args[0]}`);
      process.exit(2);
    }
  }
  console.log(JSON.stringify(node, null, 2));
} else {
  const sizeMB = (buf.length / 1048576).toFixed(1);
  console.log(`archive : ${archive}`);
  console.log(`size    : ${sizeMB} MB on disk, ${jsonLength} byte JSON index`);
  console.log(`contents: ${fileCount} files, ${dirCount} directories`);
  console.log(`top level: ${Object.keys(header.files).join(", ")}`);
  const pkg = header.files["package.json"];
  if (pkg) {
    const pkgJson = JSON.parse(
      buf.slice(blobBase + Number(pkg.offset), blobBase + Number(pkg.offset) + pkg.size).toString("utf8"),
    );
    console.log(`entry   : package.json -> "main": ${pkgJson.main ?? "(none)"}${pkgJson.type ? `, "type": ${pkgJson.type}` : ""}`);
  }
}
