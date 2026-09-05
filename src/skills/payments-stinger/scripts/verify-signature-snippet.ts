/**
 * payments-stinger, Minimal portable HMAC-SHA256 Stripe-Signature verification.
 *
 * Use this only when:
 *   - You can't / won't pull in the `stripe` SDK (e.g., a tiny edge runtime).
 *   - You want a reference for what the SDK actually does.
 *
 * For production: USE THE SDK (`stripe.webhooks.constructEvent`). It handles
 * timing-safe comparison, multiple signatures (key rotation), tolerance,
 * and edge cases the SDK maintainers think about so you don't have to.
 *
 * See:
 *   - guides/06-webhooks-and-provisioning.md
 *   - https://docs.stripe.com/webhooks/signatures
 *   - https://github.com/stripe/stripe-go/blob/master/webhooks.go (canonical)
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export interface VerifyOptions {
  /** Raw request body, exact bytes Stripe sent. NEVER JSON-parsed first. */
  rawBody: string | Buffer;
  /** Value of the Stripe-Signature header. */
  header: string;
  /** Endpoint signing secret (whsec_*). */
  secret: string;
  /** Replay tolerance in seconds. Stripe SDK default is 300. */
  toleranceSeconds?: number;
}

export class StripeSignatureError extends Error {
  constructor(
    public readonly reason:
      | 'missing-header'
      | 'malformed-header'
      | 'no-v1-scheme'
      | 'timestamp-too-old'
      | 'no-signature-match',
    message: string,
  ) {
    super(message);
    this.name = 'StripeSignatureError';
  }
}

/**
 * Returns true if the signature is valid. Throws StripeSignatureError otherwise.
 *
 * This implementation:
 *   - Parses `t=` and ALL `v1=` entries from the header.
 *   - Rejects schemes that aren't `v1` (no v0 in production).
 *   - Computes HMAC-SHA256 over `<t>.<rawBody>` keyed by `secret`.
 *   - Compares against each provided v1 signature in constant time.
 *   - Enforces the 300s default tolerance.
 */
export function verifyStripeSignature(opts: VerifyOptions): true {
  if (!opts.header) {
    throw new StripeSignatureError('missing-header', 'no Stripe-Signature header');
  }

  const parts = opts.header.split(',').map((p) => p.trim());
  let timestamp: number | null = null;
  const v1Sigs: string[] = [];

  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    const v = part.slice(eq + 1);
    if (k === 't') {
      timestamp = Number.parseInt(v, 10);
    } else if (k === 'v1') {
      v1Sigs.push(v);
    }
    // Ignore v0 and any other scheme deliberately.
  }

  if (timestamp === null || Number.isNaN(timestamp)) {
    throw new StripeSignatureError('malformed-header', 'no t= in Stripe-Signature');
  }
  if (v1Sigs.length === 0) {
    throw new StripeSignatureError('no-v1-scheme', 'no v1= in Stripe-Signature');
  }

  const tolerance = opts.toleranceSeconds ?? 300;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - timestamp) > tolerance) {
    throw new StripeSignatureError(
      'timestamp-too-old',
      `timestamp ${timestamp} is outside ${tolerance}s tolerance from now=${nowSec}`,
    );
  }

  const bodyStr =
    typeof opts.rawBody === 'string' ? opts.rawBody : opts.rawBody.toString('utf8');
  const signedPayload = `${timestamp}.${bodyStr}`;

  const expected = createHmac('sha256', opts.secret).update(signedPayload).digest();

  for (const sigHex of v1Sigs) {
    let provided: Buffer;
    try {
      provided = Buffer.from(sigHex, 'hex');
    } catch {
      continue;
    }
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
      return true;
    }
  }

  throw new StripeSignatureError(
    'no-signature-match',
    'no provided v1 signature matched the expected HMAC',
  );
}

// ----- Self-test (run with: npx tsx verify-signature-snippet.ts) -----

if (require.main === module) {
  const secret = 'whsec_test_secret';
  const body = '{"id":"evt_test","type":"checkout.session.completed"}';
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
  const header = `t=${t},v1=${sig}`;

  try {
    verifyStripeSignature({ rawBody: body, header, secret });
    console.log('OK: self-test passed');
  } catch (err) {
    console.error('FAIL:', err);
    process.exit(1);
  }
}
