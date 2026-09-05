/**
 * templates/knowledge-document.ts
 *
 * Canonical KnowledgeDocument shape and indexing call. Use this when
 * authoring a new knowledge type or reviewing an indexing path.
 *
 * Source-of-truth: library/knowledge-base/ai/knowledge-base.md
 * Code: lib/knowledge-indexer.ts, api/prisma/schema.prisma
 */

// =============================================================================
// 1. The Prisma model
// =============================================================================

/*
model KnowledgeDocument {
  id           String              @id @default(cuid())
  title        String
  documentType KnowledgeDocType    @map("document_type")
  body         String              // full markdown content
  visibility   KnowledgeVisibility @default(organization)
  creatorId    String              @map("creator_id")
  tenantId     String              @map("tenant_id")
  isDeleted    Boolean             @default(false) @map("is_deleted")
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  @@index([tenantId, documentType])
}

enum KnowledgeDocType {
  company_context
  customer_persona
  product_info
  methodology
  framework
  best_practice
  faq
  resource
  goal_mapping
  ideal_client_avatar
  offer_definition
  strategic_positioning
  referral_strategy
  business_profile
}

enum KnowledgeVisibility {
  private
  team
  organization
  public
}
*/

// =============================================================================
// 2. Indexing — fire-and-forget from admin CRUD
// =============================================================================

import { indexKnowledgeDocument, removeKnowledgeDocument } from "@/lib/knowledge-indexer";

export async function exampleCreateKnowledgeDoc(input: {
  tenantId:     string;
  creatorId:    string;
  title:        string;
  body:         string;
  documentType: KnowledgeDocType;
  visibility:   KnowledgeVisibility;
}) {
  const doc = await prisma.knowledgeDocument.create({ data: input });

  // Fire-and-forget — indexing failure must not break the admin write
  indexKnowledgeDocument({
    id:           doc.id,
    tenantId:     doc.tenantId,
    title:        doc.title,
    body:         doc.body,
    documentType: doc.documentType,
  }).catch(console.error);

  return doc;
}

export async function exampleUpdateKnowledgeDoc(id: string, input: {
  title?: string;
  body?:  string;
}) {
  const doc = await prisma.knowledgeDocument.update({ where: { id }, data: input });

  // CRITICAL: remove old chunks BEFORE re-indexing to avoid leak.
  // The current production PUT route does NOT do this — that's the recurring gap pattern.
  await removeKnowledgeDocument(id, doc.tenantId);
  indexKnowledgeDocument({
    id:           doc.id,
    tenantId:     doc.tenantId,
    title:        doc.title,
    body:         doc.body,
    documentType: doc.documentType,
  }).catch(console.error);

  return doc;
}

export async function exampleDeleteKnowledgeDoc(id: string) {
  const doc = await prisma.knowledgeDocument.update({
    where: { id },
    data:  { isDeleted: true },
  });
  removeKnowledgeDocument(id, doc.tenantId).catch(console.error);
  return doc;
}

// =============================================================================
// 3. Visibility rules (text-budget fallback)
// =============================================================================
//
// Only `company_context` docs in the text-budget fallback are filtered:
//   visibility: { not: "private" }
//
// All other types are organization-scoped by default. `private` means
// "only visible to the creator". `team` is reserved (not yet used).
// `public` is reserved for future cross-tenant visibility.
//
// =============================================================================

// =============================================================================
// 4. Anti-patterns
// =============================================================================
//
// BAD — synchronous indexing (must-fix; admin write must not block on Cohere/Qdrant):
// await indexKnowledgeDocument({ ... });
//
// BAD — PUT without removeKnowledgeDocument first (must-fix; chunk leak):
// await prisma.knowledgeDocument.update(...);
// indexKnowledgeDocument(...);   // chunks accumulate
//
// BAD — visibility: "private" doc indexed without sender-only retrieval (must-fix):
// (private docs should be filtered out of org-wide retrieval paths)
//
// BAD — using a documentType not in the enum (must-fix; will fail at DB level
//       but also breaks priority ordering in text-budget fallback):
// documentType: "random_string"
//
// =============================================================================

// =============================================================================
// 5. The auto-generated business_profile
// =============================================================================
//
// When the onboarding agent calls `complete_onboarding`, the system auto-creates
// or updates a `business_profile` KnowledgeDocument for the member:
//
//   {
//     creatorId:    member.id,
//     tenantId,
//     title:        `${member.name}'s Business Profile`,
//     body:         (compiled from member fields),
//     documentType: "business_profile",
//     visibility:   "organization",
//   }
//
// This doc is always appended in vector retrieval (after top-K) AND is the
// last priority in text-budget fallback. See guides/07-knowledge-base.md §6.
//
// =============================================================================

// (Type declarations would import from your Prisma client)
declare const prisma: any;
type KnowledgeDocType = string;
type KnowledgeVisibility = "private" | "team" | "organization" | "public";
