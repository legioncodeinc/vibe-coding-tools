/**
 * templates/ai-trace-record.ts
 *
 * Canonical traceAICall() invocation. Use this shape for every LLM call in the
 * cognitive layer.
 *
 * Source-of-truth: library/knowledge-base/ai/observability-evaluation.md §2
 * Code: lib/ai-tracer.ts
 *
 * Untraced LLM calls are must-fix. This is the only sanctioned path.
 */

import { traceAICall } from "@/lib/ai-tracer";
import { getAIClient, getAIModels } from "@/lib/ai-client";

// =============================================================================
// 1. CHAT TURN — main coaching response (most common)
// =============================================================================

export async function exampleChatTurn(params: {
  tenantId:      string;
  userId:        string;
  sessionId:     string;
  systemPrompt:  string;
  history:       Array<{ role: "user" | "assistant"; content: string }>;
  userMessage:   string;
  coachType:     string;
}) {
  const openai          = getAIClient();
  const { chat: model } = await getAIModels();   // never hardcode model

  return traceAICall({
    tenantId:  params.tenantId,
    userId:    params.userId,
    sessionId: params.sessionId,
    traceType: "chat_turn",
    model,
    coachType: params.coachType,
    userQuery: params.userMessage,
    call: async () => {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: params.systemPrompt },
          ...params.history,
          { role: "user",   content: params.userMessage },
        ],
        temperature: 0.7,
        max_tokens:  500,
      });
      return response.choices[0]?.message?.content ?? "";
    },
  });
}

// =============================================================================
// 2. ROUTING — Llama 3.1 8B classifier
// =============================================================================
//
// NOTE: the current runOrchestrator() does NOT trace the routing call.
// This is one of the recurring gap patterns. New code MUST trace.
// =============================================================================

export async function exampleRouting(params: {
  tenantId:    string;
  userId:      string;
  sessionId:   string;
  message:     string;
  memberLevel: number;
}) {
  const openai          = getAIClient();
  const { fast: model } = await getAIModels();

  return traceAICall({
    tenantId:  params.tenantId,
    userId:    params.userId,
    sessionId: params.sessionId,
    traceType: "routing",
    model,
    userQuery: params.message,
    call: async () => {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: ROUTING_PROMPT(params.memberLevel) },
          { role: "user",   content: params.message },
        ],
        temperature: 0,        // deterministic
        max_tokens:  20,       // one word
      });
      const raw = response.choices[0]?.message?.content?.trim().toLowerCase() ?? "";
      return VALID_COACH_TYPES.has(raw) ? raw : "main_community";
    },
  });
}

// =============================================================================
// 3. RAG RETRIEVAL — fits the rag_retrieval traceType when the LLM is involved
//                    (e.g., LLM-as-judge on retrieval). Pure Qdrant queries
//                    don't need traceAICall — they appear inside chat_turn
//                    via the retrievedChunks/knowledgeChunks fields.
// =============================================================================

export async function exampleEvalRetrievalPrecision(params: {
  tenantId:       string;
  userId:         string;
  userQuery:      string;
  retrievedChunks: Array<{ text: string; score: number; contentType: string }>;
}) {
  const openai          = getAIClient();
  const { fast: model } = await getAIModels();

  return traceAICall({
    tenantId:        params.tenantId,
    userId:          params.userId,
    traceType:       "rag_retrieval",
    model,
    userQuery:       params.userQuery,
    retrievedChunks: params.retrievedChunks,
    call: async () => {
      const response = await openai.chat.completions.create({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a retrieval-quality judge. Return only valid JSON." },
          { role: "user",   content: buildJudgePrompt(params.userQuery, params.retrievedChunks) },
        ],
        temperature: 0.1,
      });
      const json = JSON.parse(response.choices[0]?.message?.content ?? "{}");
      return Number(json.score ?? 0);
    },
  });
}

// =============================================================================
// 4. SUMMARIZATION — session summary generation (two-step pipeline)
// =============================================================================

export async function exampleSessionSummaryStep1(params: {
  tenantId:   string;
  userId:     string;
  sessionId:  string;
  transcript: string;
}) {
  const openai          = getAIClient();
  const { fast: model } = await getAIModels();

  return traceAICall({
    tenantId:  params.tenantId,
    userId:    params.userId,
    sessionId: params.sessionId,
    traceType: "summarization",
    model,
    userQuery: params.transcript.slice(0, 500),  // truncate per AiTrace.userQuery
    call: async () => {
      const response = await openai.chat.completions.create({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a coaching session summarizer. Return only valid JSON." },
          { role: "user",   content: buildExtractPrompt(params.transcript) },
        ],
        temperature: 0.1,
      });
      return JSON.parse(response.choices[0]?.message?.content ?? "{}");
    },
  });
}

// =============================================================================
// Anti-patterns — DO NOT do these
// =============================================================================

// BAD — untraced (must-fix):
// const response = await openai.chat.completions.create({ ... });

// BAD — hardcoded model (must-fix):
// model: "meta-llama/Llama-3.3-70B-Instruct",

// BAD — direct provider (must-fix; bypasses OpenRouter gateway):
// import Anthropic from "@anthropic-ai/sdk";
// const anthropic = new Anthropic({ apiKey });

// BAD — wrong traceType (must-fix):
// traceType: "anything_other_than_the_4_valid_values",

// BAD — userQuery not truncated to 500 (PII concern, should-refactor):
// userQuery: fullUserMessage_might_be_long,

// =============================================================================
// Helpers (would live elsewhere)
// =============================================================================

const VALID_COACH_TYPES = new Set([
  "main_community", "onboarding", "level_1", "level_2", "level_3",
  "offer_doc", "special_gift_strategist",
]);

function ROUTING_PROMPT(level: number): string {
  return `You are a routing classifier. ... The member is currently at Level ${level}.`;
}

function buildJudgePrompt(query: string, chunks: { text: string; score: number }[]): string {
  return `Query: ${query}\n\nChunks:\n${chunks.map((c, i) => `${i+1}. ${c.text}`).join("\n")}\n\nReturn { "score": 0.0-1.0, "reasoning": "..." }`;
}

function buildExtractPrompt(transcript: string): string {
  return `Transcript:\n${transcript}\n\nExtract as JSON: { "goals_discussed":[], "decisions_made":[], "commitments_made":[], "blockers_identified":[], "next_session_focus":"" }`;
}
