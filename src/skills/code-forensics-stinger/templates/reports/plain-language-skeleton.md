# Plain Language Report — Skeleton

Target audience: the client (an 8th-grade reading level — about Flesch-Kincaid 70). Heavy use of analogies. No jargon without immediate explanation.

The Node script `scripts/build_plain_language.js` is the production builder.

## The "House Construction" Analogy (used throughout)

Every technical concept maps to a house-building analogy. The recurring framing: "You hired a contractor to build a 3-bedroom house for $33,000. He promised 6 months. Four years later, here is what you actually got..." then enumerate the failures.

| Technical | House Analogy |
|---|---|
| Web shell installed in production | Master key left under the doormat |
| Public-read S3 ACLs | Customer photos left in the front yard |
| Unauthenticated webhook with default password | Back gate doorbell that makes a guessable key |
| Recurring appointment time bomb | Appointment book pages quietly disappearing |
| Maintenance fee with no work performed | Contractor sends a $4,000 bill for "maintenance" while security camera shows nobody arrived |
| Hosting double-billing | Two landlords sending rent bills for the same apartment |
| Virtual assistant non-delivery | A housekeeper you're paying for who never shows up |
| Zero engagement social media | Flyers nobody reads on doors of houses that don't exist |

## Structure

### Cover Page
- Title: `WHAT HAPPENED WITH YOUR APP`
- Subtitle: `A Plain-English Explanation of the {PROJECT_NAME} Investigation`
- Prepared for: `{CLIENT_PRINCIPAL}`

### The Short Version
The 6-bullet summary of what happened.

### The House Analogy
The setup analogy and the "Picture this" list of failures.

### Part 1: The App (Half-Built)
- What you were promised
- What you got (working/broken feature table)
- The "Time Bomb" (recurring appointment defect)

### Part 2: Security (Front Door Unlocked)
- 1. The Master Key Under the Doormat (web shell)
- 2. Customer Photos in the Front Yard (public S3)
- 3. Anyone Could Create a Manager Account (webhook + hardcoded password)
- Why this matters even if you haven't been hacked yet

### Part 3: The Maintenance Fee (Paying for Nothing)
- The git log smoking gun (idle months table)
- What real maintenance should look like (the 20-30 hr/month framing)

### Part 4: ADA (Marketing & Hosting Bills)
- 1. The Hosting Bill (paying twice)
- 2. The Virtual Assistant (where was she?)
- 3. Social Media (the posts nobody saw)

### Part 5: What This Means In Dollars
- What you paid
- What it was actually worth (table)
- Bottom line cash-overpayment range

### Part 6: What Happens Now
- What you have already done (good)
- What needs to happen next (numbered steps)
- What to expect (timeline, cost, outcome)
- What NOT to do

### Part 7: The Hardest Part — How This Happened to Begin With
The acknowledgment that the client did nothing wrong. Six bullets explaining how the pattern works to deceive even careful business owners.

### Part 8: The Bright Side
Six bullets about the positive things:
- The client documented everything
- The client took back control
- Comprehensive forensic investigation was commissioned
- The app has salvageable engineering at its core
- The defendants are already distracted by other litigation
- Contingency-fee counsel is feasible

## Tone Rules

- Treat the client as intelligent — they were deceived by a sophisticated pattern, not stupid
- Use second person ("you")
- Be supportive, not preachy
- Use specific numbers (not vague "a lot of money")
- Quote ADA/DevPipe actions specifically — not character attacks
- End every section with reassurance about what comes next
