/**
 * templates/session-summary.ts
 *
 * The canonical generateSessionSummary() output shape and the two-step pipeline.
 *
 * Source-of-truth: library/knowledge-base/ai/memory-summarization.md §5
 * Code: lib/coaching-llm.ts (generateSessionSummary)
 */

// =============================================================================
// 1. The structured-extraction shape (Step 1)
// =============================================================================

export interface SessionExtraction {
  goals_discussed:     string[];
  decisions_made:      string[];
  commitments_made:    string[];
  blockers_identified: string[];
  next_session_focus:  string;
}

// =============================================================================
// 2. Two-step pipeline
// =============================================================================
//
// Step 1: structured JSON extraction (fast model, temperature 0.1)
//         Prevents hallucination by extracting facts before narrative.
//
// Step 2: narrative summary (chat model, temperature 0.4)
//         200-300 words, third-person past tense.
//         Grounded in Step 1's structured output.
//         Falls back to direct transcript summarization if Step 1 fails.

import { traceAICall } from "@/lib/ai-tracer";
import { getAIClient, getAIModels } from "@/lib/ai-client";

export async function generateSessionSummary(params: {
  tenantId:   string;
  userId:     string;
  sessionId:  string;
  transcript: string;
}): Promise<string> {
  if (countUserMessages(params.transcript) < 2) {
    return "Session too brief to summarize.";
  }

  const openai                          = getAIClient();
  const { fast: fastModel, chat: chatModel } = await getAIModels();

  // Step 1 — structured extraction
  let extraction: SessionExtraction | null = null;
  try {
    extraction = await traceAICall({
      tenantId:  params.tenantId,
      userId:    params.userId,
      sessionId: params.sessionId,
      traceType: "summarization",
      model:     fastModel,
      userQuery: params.transcript.slice(0, 500),
      call: async () => {
        const r = await openai.chat.completions.create({
          model:           fastModel,
          temperature:     0.1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are a coaching session summarizer. Return only valid JSON." },
            { role: "user",   content: STEP_1_PROMPT(params.transcript) },
          ],
        });
        const json = JSON.parse(r.choices[0]?.message?.content ?? "{}");
        return {
          goals_discussed:     Array.isArray(json.goals_discussed)     ? json.goals_discussed     : [],
          decisions_made:      Array.isArray(json.decisions_made)      ? json.decisions_made      : [],
          commitments_made:    Array.isArray(json.commitments_made)    ? json.commitments_made    : [],
          blockers_identified: Array.isArray(json.blockers_identified) ? json.blockers_identified : [],
          next_session_focus:  typeof json.next_session_focus === "string" ? json.next_session_focus : "",
        };
      },
    });
  } catch (err) {
    console.error("session summary step 1 failed; falling back", err);
  }

  // Step 2 — narrative summary
  const narrative = await traceAICall({
    tenantId:  params.tenantId,
    userId:    params.userId,
    sessionId: params.sessionId,
    traceType: "summarization",
    model:     chatModel,
    userQuery: params.transcript.slice(0, 500),
    call: async () => {
      const r = await openai.chat.completions.create({
        model:       chatModel,
        temperature: 0.4,
        messages: [
          { role: "system", content: STEP_2_SYSTEM },
          { role: "user",   content: STEP_2_PROMPT(params.transcript, extraction) },
        ],
      });
      return r.choices[0]?.message?.content ?? "";
    },
  });

  return narrative;
}

// =============================================================================
// 3. Indexing the summary into Qdrant conversations-{tenantId}
// =============================================================================

export interface SessionSummaryVectorPayload {
  // Mandatory
  tenant_id:               string;
  user_id:                 string;
  session_id:              string;
  thread_id:               string;     // currently == session_id
  agent_type:              string;     // coach type
  content_type:            "session_summary";
  timestamp:               string;     // ISO 8601
  embedding_model_version: "cohere-embed-english-v3.0";
  source_document_id:      string;     // == session_id

  // Memory tier
  memory_tier:    "episodic";
  consolidated:   false;
  decay_weight:   number;             // pre-computed for debugging only — recompute at query

  // Content
  text:        string;                 // narrative summary

  // Chunking
  chunk_index: 0;
  chunk_total: 1;
}

// =============================================================================
// 4. Anti-patterns
// =============================================================================
//
// BAD — Step 1 with chat model (waste of cost; should-refactor):
// model: chatModel
//
// BAD — Step 2 with structured response_format (loses narrative quality; must-fix):
// response_format: { type: "json_object" } at Step 2
//
// BAD — temperature drift from 0.1 / 0.4 (must-fix):
// temperature: 0.5
//
// BAD — minimum-message check skipped (must-fix; trivially short sessions hallucinate):
// (no countUserMessages gate)
//
// BAD — summary not written to AiChatSession.summary AND Qdrant (must-fix):
// (writing to only one tier breaks reconstructSession())
//
// =============================================================================

const STEP_1_PROMPT = (t: string) => `Extract from this coaching session transcript as JSON:
{
  "goals_discussed":     [],
  "decisions_made":      [],
  "commitments_made":    [],
  "blockers_identified": [],
  "next_session_focus":  ""
}

Transcript:
${t}`;

const STEP_2_SYSTEM = "You are a coaching session summarizer. Write a concise 200–300 word summary in third-person past tense. Be specific and factual. Cover: main topics, key decisions, commitments, and next actions.";

const STEP_2_PROMPT = (transcript: string, extraction: SessionExtraction | null): string => {
  if (!extraction) return `Summarize this coaching session transcript:\n\n${transcript}`;
  return `Structured extraction:
${JSON.stringify(extraction, null, 2)}

Full transcript:
${transcript}

Write the narrative summary now.`;
};

function countUserMessages(transcript: string): number {
  return (transcript.match(/^User:/gm) ?? []).length;
}
