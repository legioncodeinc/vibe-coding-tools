# beforeSend PII-scrubbing pattern

Grounded in [raw/sentry--data-scrubbing--beforesend-pii.md]. Applies to both `hooks.client.ts` and `instrumentation.server.ts` - PII can leak from either side, and the two `beforeSend` functions run independently (client events never pass through the server hook and vice versa).

## Full example

```typescript
import type { ErrorEvent, EventHint } from '@sentry/sveltekit';

const SENSITIVE_TAG_KEYS = new Set(['ssn', 'creditCard', 'apiKey']);

function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
	// 1. Drop events entirely for known-noisy, non-actionable errors.
	const errorMessage = event.exception?.values?.[0]?.value ?? '';
	if (errorMessage.includes('ResizeObserver loop limit exceeded')) {
		return null;
	}

	// 2. Strip user email if the org's policy treats it as sensitive.
	//    Prefer internal user IDs over email at Sentry.setUser() call sites instead
	//    of relying on this as the only line of defense - see the setUser pattern below.
	if (event.user) {
		delete event.user.email;
		delete event.user.ip_address;
	}

	// 3. Scrub request data that may carry PII in headers, cookies, or query strings.
	if (event.request) {
		delete event.request.cookies;
		if (event.request.headers) {
			delete event.request.headers['authorization'];
			delete event.request.headers['cookie'];
		}
		if (event.request.query_string) {
			// Query strings can carry tokens or PII depending on the app's routing -
			// scrub known-sensitive param names rather than deleting the whole string
			// if some query params are safe and useful for debugging.
			event.request.query_string = scrubQueryString(event.request.query_string);
		}
	}

	// 4. Scrub extra/context data recursively for known-sensitive key names.
	if (event.extra) {
		for (const key of Object.keys(event.extra)) {
			if (SENSITIVE_TAG_KEYS.has(key)) {
				event.extra[key] = '[Scrubbed]';
			}
		}
	}

	return event;
}

function scrubQueryString(qs: string): string {
	const params = new URLSearchParams(qs);
	for (const key of ['token', 'session', 'password', 'api_key']) {
		if (params.has(key)) params.set(key, '[Scrubbed]');
	}
	return params.toString();
}
```

## Where PII tends to hide (audit checklist)

Per the raw research, check each of these before shipping a scrubbing function as "done":

- **Stack-local variable values** (Node SDK can pick these up) - disable or scrub if function-local variables may hold secrets.
- **Breadcrumbs** - previously-executed log statements, DB queries, and query strings attached automatically. Do not log PII if breadcrumb capture is on; use `beforeBreadcrumb` to filter if legacy logging can't be changed immediately.
- **User context** - gated by `dataCollection.userInfo` (see `hooks-server-pattern.md` / `hooks-client-pattern.md`); set `userInfo: false` at init time if user identity should never leave the app at all, rather than only stripping it in `beforeSend`.
- **Transaction names** - SDKs generally auto-parameterize routes (`/users/1234/details` -> `/users/:userid/details`), but routing-config edge cases can leave raw IDs unparameterized. Spot-check transaction names in the Sentry dashboard after shipping, don't assume parameterization always worked.
- **HTTP spans** - query string/fragment often attached as a span data attribute; scrub the same way as request query strings above.

[raw/sentry--data-scrubbing--beforesend-pii.md]

## Prefer not sending PII over scrubbing it after the fact

Hashing sensitive tag values instead of sending them raw:

```typescript
Sentry.setTag('accountRegion', hashValue(user.region));
```

Identifying users by internal ID instead of email:

```typescript
Sentry.setUser({ id: user.id }); // not { email: user.email }
```

Both patterns still enable Sentry's user-impact features (affected-user counts) without ever transmitting the sensitive value in the first place - `beforeSend` scrubbing is a backstop for what automatic instrumentation picks up, not the primary control for data explicitly attached in application code [raw/sentry--data-scrubbing--beforesend-pii.md].

## Server-side scrubbing as a second layer

Everything above is SDK-side (never sent). Sentry also supports **server-side scrubbing** configured in the Sentry UI (`Settings > Security & Privacy > Data Scrubber`), which prevents storage of matched patterns even if something slips past `beforeSend`. Configuration changes there apply immediately without a redeploy, unlike SDK-side changes - useful as a fast-response tool if a PII leak is discovered in production before a code fix can ship [raw/sentry--data-scrubbing--beforesend-pii.md].

Escalate any policy question about what counts as sensitive for this specific app (beyond the generic PII categories above) to `security-worker-bee` rather than deciding unilaterally in this scrubbing function.
