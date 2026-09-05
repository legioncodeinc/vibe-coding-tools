# JWT / JWKS verification snippet

Grounded in [raw/workos--authkit--jwt-jwks-verification.md]. Use this pattern when a service receives a bare WorkOS access token (bearer JWT) rather than the sealed-session cookie - e.g. a separate internal API that trusts the SvelteKit app's forwarded `Authorization: Bearer <token>` header, or a Vercel Edge Function that can't share the sealed-session cookie decryption.

If you're inside the SvelteKit app itself using the SDK's sealed-session flow (`loadSealedSession(...).authenticate()`), that call already verifies the token server-side - you do not need this snippet there. See `hooks-server-session-pattern.md`.

## `src/lib/server/verify-token.ts`

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { env } from '$env/dynamic/private';

// Module-scoped: createRemoteJWKSet caches keys in memory and only refetches
// when it sees an unrecognized `kid`. Defining it at module scope (not inside
// the function) lets the cache survive across requests. [raw/workos--authkit--jwt-jwks-verification.md]
const JWKS = createRemoteJWKSet(
	new URL(`https://api.workos.com/sso/jwks/${env.WORKOS_CLIENT_ID}`)
);

export interface WorkOSAccessTokenClaims {
	sid: string; // session id
	org_id?: string;
	role?: string;
	permissions?: string[];
	[claim: string]: unknown;
}

export async function verifyAccessToken(token: string): Promise<WorkOSAccessTokenClaims> {
	const { payload } = await jwtVerify(token, JWKS, {
		algorithms: ['RS256'],
		issuer: 'https://api.workos.com/'
		// audience: set only if your WorkOS configuration issues an `aud` claim
		// you intend to check; omitting it is safer than passing a wrong value.
	});
	return payload as WorkOSAccessTokenClaims;
}
```

## Usage in a route handler

```typescript
// src/routes/api/internal/+server.ts
import { json, error } from '@sveltejs/kit';
import { verifyAccessToken } from '$lib/server/verify-token';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

	if (!token) {
		throw error(401, 'Missing bearer token');
	}

	try {
		const claims = await verifyAccessToken(token);
		return json({ sessionId: claims.sid, organizationId: claims.org_id });
	} catch {
		throw error(401, 'Invalid or expired token');
	}
};
```

## Rules pulled directly from the research

- Always pass `algorithms`, `issuer`, and (when applicable) `audience` explicitly to `jwtVerify` - never let them default [raw/workos--authkit--jwt-jwks-verification.md].
- Keep tokens in `httpOnly` cookies, never `localStorage` [raw/workos--authkit--jwt-jwks-verification.md].
- Verify in `hooks.server.ts` for routing decisions, and again in the specific server load function or route handler that reads claims - don't rely on a single upstream check [raw/workos--authkit--jwt-jwks-verification.md].
- Each JWKS key carries a `kid` matching the token header's `kid`; WorkOS rotates keys periodically without invalidating outstanding tokens, which is why fetching by `kid` (not caching a single static key) matters [raw/workos--authkit--jwt-jwks-verification.md].
