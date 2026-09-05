#!/usr/bin/env node
// Evaluate a JavaScript expression in a live Electron renderer over the Chrome DevTools Protocol.
// Zero dependencies: uses Node >= 22 global fetch and WebSocket.
//
// Usage:
//   node cdp-eval.mjs <port> --list                 list debuggable targets
//   node cdp-eval.mjs <port> "<js expression>"      evaluate in the first page target
//   node cdp-eval.mjs <port> "<expr>" --title substr  evaluate in the first target whose title matches
//
// Launch the app first, with a throwaway profile so the flag is not swallowed
// by an already-running instance:
//   "<path>/App.exe" --remote-debugging-port=9222 --user-data-dir="$TEMP/app-re-debug"
const port = process.argv[2];
const exprIdx = process.argv.indexOf(process.argv[3] === "--list" ? "--list" : process.argv[3]);
if (!port) {
  console.error("Usage: node cdp-eval.mjs <port> [--list | <expression> [--title substr]]");
  process.exit(1);
}

const listTargets = async () => {
  let res;
  try {
    res = await fetch(`http://127.0.0.1:${port}/json/list`);
  } catch {
    console.error(`nothing listening on 127.0.0.1:${port} — launch the app first:`);
    console.error(`  "<path>/App.exe" --remote-debugging-port=${port} --user-data-dir="$TEMP/app-re-debug"`);
    process.exit(2);
  }
  if (!res.ok) throw new Error(`CDP port ${port} not reachable (HTTP ${res.status})`);
  return res.json();
};

const targets = await listTargets();

if (process.argv[3] === "--list") {
  for (const t of targets) {
    console.log(`[${t.type}] ${t.title}  ${t.url}`);
    console.log(`   ws: ${t.webSocketDebuggerUrl ?? "(none)"}`);
  }
  process.exit(0);
}

const expression = process.argv[3];
if (!expression) {
  console.error("no expression given; use --list to enumerate targets");
  process.exit(1);
}
const titleFilter = process.argv.includes("--title")
  ? process.argv[process.argv.indexOf("--title") + 1]
  : null;

const target =
  targets.find((t) => t.type === "page" && titleFilter && t.title?.includes(titleFilter)) ??
  targets.find((t) => t.type === "page" && !titleFilter);
if (!target?.webSocketDebuggerUrl) {
  console.error(`no debuggable page target${titleFilter ? ` matching title "${titleFilter}"` : ""}`);
  console.error("available: " + targets.map((t) => t.title).join(" | "));
  process.exit(2);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = () => reject(new Error("websocket connect failed"));
});

const result = await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error("evaluation timed out (30s)")), 30_000);
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id === 1) {
      clearTimeout(timeout);
      resolve(msg.result);
    }
  };
  ws.send(
    JSON.stringify({
      id: 1,
      method: "Runtime.evaluate",
      params: { expression, returnByValue: true, awaitPromise: true },
    }),
  );
});

ws.close();

if (result.exceptionDetails) {
  const text = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
  console.error("threw: " + text);
  process.exit(3);
}
console.log(
  typeof result.result.value === "string" ? result.result.value : JSON.stringify(result.result.value, null, 2),
);
