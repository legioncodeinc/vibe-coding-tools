import { Agent, CursorAgentError, AgentBusyError, RateLimitError } from "@cursor/sdk";
import * as path from "path";

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname, "..");
const MODEL = "claude-sonnet-4-5"; // Required for local runtime

async function main(): Promise<void> {
  let agent: Awaited<ReturnType<typeof Agent.create>> | null = null;

  try {
    // Create agent with local runtime
    agent = await Agent.create({
      local: {
        cwd: PROJECT_ROOT,
        model: MODEL,
        // settingSources inherits project + user Cursor settings
        settingSources: ["user", "project"],
      },
    });

    // Send a task and stream output
    const run = agent.send("Your task description here");

    for await (const msg of run.stream()) {
      if (msg.type === "assistant") process.stdout.write(msg.text ?? "");
      if (msg.type === "tool_call") {
        process.stderr.write(`[${msg.name}: ${msg.status}]\n`);
      }
    }

    const result = await run.wait();
    console.log(`\nDone. Status: ${result.status}`);

  } catch (err) {
    if (err instanceof AgentBusyError) {
      // Cloud only: one active run at a time
      console.error("Agent busy (cloud). Wait for current run to finish.");
    } else if (err instanceof RateLimitError && err.isRetryable) {
      console.error("Rate limited. Retry after back-off.");
    } else if (err instanceof CursorAgentError) {
      console.error(`[${err.code}] ${err.message} (retryable: ${err.isRetryable})`);
    } else {
      throw err;
    }
  } finally {
    if (agent) await agent.dispose();
  }
}

main().catch(console.error);
