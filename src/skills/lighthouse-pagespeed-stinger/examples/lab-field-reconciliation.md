# Example: Lab-vs-Field Reconciliation

> Demonstrates guide: `guides/02-lab-vs-field.md`

**Scenario:** A developer reports "Lighthouse gives us a 92 Performance score, but PageSpeed Insights says our INP is Poor (450ms) and we're failing Core Web Vitals." This is a classic lab-vs-field divergence.

---

## Step 1: Confirm the divergence is real

Call the PSI API and compare both blocks:

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&key=YOUR_API_KEY" | jq '{
  lab_performance: .lighthouseResult.categories.performance.score,
  lab_tbt: .lighthouseResult.audits["total-blocking-time"].numericValue,
  field_inp: .loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile,
  field_inp_category: .loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.category,
  field_lcp: .loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
  field_lcp_category: .loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category
}'
```

Expected output for this scenario:
```json
{
  "lab_performance": 0.92,
  "lab_tbt": 180,
  "field_inp": 450,
  "field_inp_category": "POOR",
  "field_lcp": 2100,
  "field_lcp_category": "GOOD"
}
```

Lab TBT is 180ms (green). Field INP is 450ms (Poor). This is the TBT/INP gap in action.

---

## Step 2: Diagnose why TBT and INP diverge here

From `guides/02-lab-vs-field.md`:

TBT measures Long Tasks (> 50ms tasks) during page load. It does NOT measure:
- Interaction processing time after the initial Long Tasks clear
- Presentation delay (time from end of event handlers to the frame being painted)
- Long Tasks triggered by user events after page load

The likely culprits for high field INP with low TBT:
1. **Heavy event handlers**: click/input handlers that run synchronous JS without yielding
2. **Rendering work after interactions**: large component re-renders triggered by state changes
3. **Third-party scripts**: analytics or chat widgets that block the main thread on interaction
4. **Post-load Long Tasks**: code that loads lazily and blocks interactions once arrived

---

## Step 3: Debug with field data tools

1. Open Chrome DevTools on the live site (use real device or with CPU throttling matching field)
2. Run a Performance trace: click around the page and record interactions
3. Look for Long Tasks (red blocks) triggered by interactions, not just during page load
4. Check the Interactions track for events with > 200ms duration

Or use the Web Vitals extension to capture real-time INP during manual testing.

---

## Step 4: What to tell the developer

"Your Lighthouse score is high because TBT (the lab proxy for INP) is good at 180ms. But INP measures the full interaction lifecycle including processing and rendering time, which only real users can trigger. Your 450ms field INP means your interaction handlers are doing too much work. Check your click/input event handlers for synchronous heavy operations, and look at your main-thread activity after interactions in a Performance trace."

---

## The takeaway

High Lighthouse Performance score + failing field INP = **normal TBT/INP gap**. This is one of the most common confusions in web performance work. Always check field INP when users report slowness even with good Lighthouse scores.
