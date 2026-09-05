# SvelteKit + Stripe webhook: getting the true raw body

- URL: https://stackoverflow.com/questions/71002364/verifying-stripe-webhook-in-sveltekit-endpoint-how-to-get-the-raw-body-of-a-req ; https://github.com/sveltejs/kit/issues/10831
- Fetched: 2026-08-14
- Source type: community (Stack Overflow, sveltejs/kit GitHub issue), cross-check against official raw-body requirement above
- Component: SvelteKit webhook endpoint raw body

## Facts

- SvelteKit's `+server.ts` endpoints receive a standard Fetch API `Request` object; there is no `rawBody` shortcut (an early SvelteKit PR, #3384, removed the old rawBody exposure in favor of the standard `Request`).
- The convergent, currently-working solution across both threads: `const body = await request.text();`, read the body as a raw string, and pass that string directly (not `request.json()`, not a re-stringified object) into `stripe.webhooks.constructEvent(body, signature, secret)`.
- Confirmed failure modes people hit before landing on `request.text()`: calling `request.json()` first and reconstructing with `JSON.stringify(body)` (fails, key order/whitespace changes break the HMAC); passing the raw `Uint8Array` from `request.arrayBuffer()` directly without converting to string or `Buffer` (works in Node runtimes per stripe-node's accepted types of `string | Buffer | Uint8Array`, but `request.text()` is simpler and portable across all adapters including edge runtimes).
- A `TypeError: Body is unusable` error is a classic symptom of calling `request.json()` (or any other body-consuming method) before `request.text()` on the same `Request`, a `Request` body stream can only be read once.
- Get the signature header via `request.headers.get('stripe-signature')`, not from a `headers` object destructured off the request event (older pre-`Request`-object SvelteKit examples use `headers["stripe-signature"]`, which is stale API and won't work against a current `+server.ts` route).
