#!/usr/bin/env bash
#
# payments-stinger, replay-webhook-locally.sh
#
# Replays a Stripe event against your local webhook handler. Two modes:
#   1. Re-fire a SPECIFIC event ID (good for debugging a real production failure
#      against a local fixed handler).
#   2. Trigger a fresh fixture event of a given type.
#
# Prerequisites:
#   - Stripe CLI installed and `stripe login` completed.
#   - `stripe listen --forward-to localhost:3000/api/stripe/webhook` running in
#     another terminal (or a substitute URL passed as $LISTEN_URL).
#   - The local app running and serving the webhook route.
#
# Usage:
#   ./replay-webhook-locally.sh resend evt_1AbC123XYZ
#   ./replay-webhook-locally.sh trigger checkout.session.completed
#   ./replay-webhook-locally.sh trigger customer.subscription.updated
#
# See: guides/08-testing-and-local-development.md, guides/10-production-failure-modes.md.

set -euo pipefail

if ! command -v stripe >/dev/null 2>&1; then
  echo "ERROR: stripe CLI not found. Install: https://docs.stripe.com/stripe-cli"
  exit 1
fi

MODE="${1:-}"
ARG="${2:-}"

if [[ -z "$MODE" || -z "$ARG" ]]; then
  echo "Usage:"
  echo "  $0 resend  evt_<id>"
  echo "  $0 trigger <event.type>"
  exit 2
fi

case "$MODE" in
  resend)
    echo ">>> Resending event $ARG to all registered destinations + your local 'stripe listen' session."
    stripe events resend "$ARG"
    ;;
  trigger)
    echo ">>> Triggering a fresh fixture event of type $ARG."
    stripe trigger "$ARG"
    ;;
  *)
    echo "Unknown mode: $MODE (expected 'resend' or 'trigger')"
    exit 2
    ;;
esac

echo ""
echo "Done. Verify in your local app:"
echo "  - Handler returned 2xx (check the 'stripe listen' terminal output)."
echo "  - processed_webhook_events table has a new row with processed_at non-null."
echo "  - Any expected side effects fired (entitlement provisioned, email enqueued, etc.)."
