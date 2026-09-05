# SDK Agent Example

Complete `@cursor/sdk` pattern: create, stream, error-handle, dispose.

## Installation

```bash
npm install @cursor/sdk
# or
pnpm add @cursor/sdk
```

## Full example (`scripts/run-review.ts`)

```typescript
import {
  Agent,
  CursorAgentError,
  AgentBusyError,
  RateLimitError,
} from "@cursor/sdk";
import * as path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const REVIEW_PROMPT = `
Review the staged changes in this repository for:
1. Security issues (OWASP Top 10)
2. Performance anti-patterns
3. Missing error handling

Output a markdown report with findings grouped by severity: Critical, High, Medium, Low.
`;

async function runReview(): Promise<void> {
  let agent: Awaited<ReturnType<typeof Agent.create>> | null = null;

  try {
    agent = await Agent.create({
      local: {
        cwd: PROJECT_ROOT,
        model: "claude-sonnet-4-5",
        settingSources: ["user", "project"],
      },
    });

    console.log("Agent created. Starting review...\n");

    const run = agent.send(REVIEW_PROMPT);

    // Stream output in real time
    let reportBuffer = "";
    for await (const msg of run.stream()) {
      switch (msg.type) {
        case "assistant":
          process.stdout.write(msg.text ?? "");
          reportBuffer += msg.text ?? "";
          break;
        case "tool_call":
          if (msg.status === "running") {
            process.stderr.write(`\n[tool: ${msg.name} running...]\n`);
          } else {
            process.stderr.write(`[tool: ${msg.name} done]\n`);
          }
          break;
        case "status":
          process.stderr.write(`\n[status: ${msg.text}]\n`);
          break;
      }
    }

    const result = await run.wait();
    console.log(`\n\nReview complete. Status: ${result.status}`);

    // Write report to disk
    const { writeFileSync } = await import("fs");
    writeFileSync("review-report.md", reportBuffer, "utf-8");
    console.log("Report written to review-report.md");

  } catch (err) {
    if (err instanceof AgentBusyError) {
      // Cloud agent: one run at a time
      console.error("Agent is busy. Wait for the current run to finish.");
    } else if (err instanceof RateLimitError) {
      // Transient — back off and retry
      console.error("Rate limited. Retry after 60 seconds.");
    } else if (err instanceof CursorAgentError) {
      console.error(`Cursor error [${err.code}]: ${err.message}`);
      console.error(`Retryable: ${err.isRetryable}`);
    } else {
      throw err; // unexpected — rethrow
    }
  } finally {
    if (agent) {
      await agent.dispose();
    }
  }
}

runReview().catch(console.error);
```

## Run it

```bash
npx tsx scripts/run-review.ts
```

## Variant: one-shot with `Agent.prompt`

For simple fire-and-forget automations:

```typescript
import { Agent, CursorAgentError } from "@cursor/sdk";

try {
  const result = await Agent.prompt(
    "Add JSDoc comments to all exported functions in src/utils.ts",
    {
      local: {
        cwd: process.cwd(),
        model: "claude-sonnet-4-5",
      },
    }
  );
  console.log("Done:", result.status);
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error(`[${err.code}] ${err.message}`);
  }
}
```

## Variant: resume across processes

```typescript
import { Agent } from "@cursor/sdk";
import { writeFileSync, readFileSync } from "fs";

// First process: create and save agentId
const agent = await Agent.create({ local: { cwd: process.cwd(), model: "..." } });
writeFileSync(".agent-id", agent.id);
const run = agent.send("Start the migration...");
await run.wait();
// process exits

// Second process: resume
const agentId = readFileSync(".agent-id", "utf-8").trim();
const resumedAgent = await Agent.resume(agentId, {
  local: { cwd: process.cwd(), model: "..." },
});
const run2 = resumedAgent.send("Continue from where you left off.");
for await (const msg of run2.stream()) {
  if (msg.type === "assistant") process.stdout.write(msg.text ?? "");
}
await run2.wait();
await resumedAgent.dispose();
```
