const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, AlignmentType, LevelFormat, ShadingType, WidthType, BorderStyle, HeadingLevel, PageBreak, PageNumber } = require('docx');

const COLORS = { primary: '1F4E78', accent: '2E75B6', red: 'C00000', green: '548235', amber: 'BF9000', lightblue: 'D5E8F0', lightred: 'FCE4E4', lightgreen: 'E2EFDA', lightamber: 'FFF2CC', grey: 'F2F2F2', darkgrey: '595959' };

const border = (c='CCCCCC') => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders4 = (c='CCCCCC') => { const b=border(c); return { top: b, bottom: b, left: b, right: b }; };

const para = (text, opts = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [new TextRun({ text: text || '', ...(opts.run || {}) })],
  spacing: opts.spacing || { after: 120 }, alignment: opts.alignment, heading: opts.heading,
  ...(opts.numbering ? { numbering: opts.numbering } : {}),
  ...(opts.pageBreakBefore ? { pageBreakBefore: true } : {}),
});
const h1 = (t) => para(t, { heading: HeadingLevel.HEADING_1, run: { size: 32, bold: true, color: COLORS.primary }, spacing: { before: 360, after: 180 } });
const h2 = (t) => para(t, { heading: HeadingLevel.HEADING_2, run: { size: 28, bold: true, color: COLORS.primary }, spacing: { before: 280, after: 140 } });
const h3 = (t) => para(t, { heading: HeadingLevel.HEADING_3, run: { size: 24, bold: true, color: COLORS.accent }, spacing: { before: 220, after: 120 } });
const body = (t) => para(t, { run: { size: 22 } });
const bodyBold = (t) => para(t, { run: { size: 22, bold: true } });
const bullet = (t, l=0) => new Paragraph({ numbering: { reference: 'bullets', level: l }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
const numb = (t, l=0) => new Paragraph({ numbering: { reference: 'numbers', level: l }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
const tcell = (text, opts={}) => {
  const runs = Array.isArray(text) ? text : [new TextRun({ text: String(text==null?'':text), size: 20, ...(opts.bold?{bold:true}:{}), ...(opts.color?{color:opts.color}:{}) })];
  return new TableCell({ borders: borders4(), width: { size: opts.width, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined, children: [new Paragraph({ children: runs, alignment: opts.align })] });
};
const mktable = (hdr, rows, widths) => {
  const total = widths.reduce((a,b)=>a+b,0);
  const hdrCells = hdr.map((l, i) => tcell([new TextRun({ text: l, bold: true, color: 'FFFFFF', size: 20 })], { width: widths[i], shading: COLORS.primary, align: AlignmentType.CENTER }));
  const dataRows = rows.map(r => new TableRow({ children: r.map((cd, i) => { let opts={width:widths[i]}; let text=cd; if (typeof cd === 'object' && cd !== null && !Array.isArray(cd)) { text=cd.text; opts={...opts, ...cd}; } return tcell(text, opts); }) }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ children: hdrCells, tableHeader: true }), ...dataRows] });
};

const cover = [
  new Paragraph({ children: [new TextRun({ text: '', size: 30 })], spacing: { before: 1800 } }),
  para('LEGAL MEMORANDUM', { run: { size: 44, bold: true, color: COLORS.primary }, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
  para('Attorney-Client Privileged & Confidential — Work Product', { run: { size: 24, italics: true, color: COLORS.red }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('TO:', { run: { size: 22, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Counsel for Example Booking Co. LLC', { run: { size: 24 }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('FROM:', { run: { size: 22, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Sarah Bennett — Example Booking Co. LLC', { run: { size: 24 }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('RE:', { run: { size: 22, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Potential Civil Claims — Software Development Fraud & Agency Services Fraud', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Against Acme Digital Agency / Northstar Holdings (Robert Hartwell)', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('and Offshore Build Group LLC / DevPipe LLC (Sameer Khan)', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('DATE: May 15, 2026', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('ENGAGEMENT VALUE AT ISSUE: $160,000 – $224,000 paid; $130,000+ in measurable overpayment', { run: { size: 22, color: COLORS.red, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  new Paragraph({ children: [new PageBreak()] }),
];

const intro = [
  h1('I. Purpose of This Memorandum'),
  body('This memorandum is intended for review by retained counsel who may not have a software-engineering background. Its purpose is to: (1) summarize the factual record assembled during a five-month forensic investigation, (2) identify the legal theories that the factual record supports, (3) quantify damages with citations to the underlying evidence, and (4) recommend a strategic sequence for pursuing claims.'),
  body('The memorandum is the briefing companion to the following evidence packet (delivered electronically alongside this memo):'),
  bullet('Example Booking Co. Forensic Report (43 pages) — the master technical and financial investigation across seven domains.'),
  bullet('ADA Services Forensic Report (24 pages) — the agency-services-specific report on Acme Digital Agency.'),
  bullet('Example Booking Co. Invoice Forensics (51-tab Excel workbook) — every invoice, every line item, every recurring charge with full extrapolation, plus the full git-commit log from the developer.'),
  bullet('152 individual email messages and 6 reconstructed email threads in the /individual-messages/ and /threads/ folders.'),
  bullet('Original signed contracts, the Offshore Build MSA, W-9, W-8BEN, tax forms.'),
  bullet('Eight third-party technical audit reports covering security, feature completeness, code quality, and value.'),
  body('Counsel may also wish to skim the 8th-grade-reading-level Plain Language Report (separately produced for the client to use in conversations with non-technical advisors). It contains the same facts but in accessible language.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const facts = [
  h1('II. Statement of Facts'),
  h2('A. The Parties'),
  body('CLIENT: Sarah M. Bennett, individually and through her Maryland-organized LLC Example Booking Co. LLC (previously operating as Cleaning Maid Easy of MD, Inc.). The client owns and operates a cleaning-services business that contracted for the development of a scheduling SaaS application.'),
  body('DEFENDANT 1 — ADA: Acme Digital Agency, LLC (Ohio) is a digital agency operating out of Lakewood, Ohio. The registered owner per public filings is James Whitfield; the managing director is Robert J. Hartwell. ADA operates under at least two corporate forms: Acme Digital Agency LLC and Northstar Holdings Inc. (which appears to be Robert Hartwell\'s personal holding company). Hartwell and Whitfield are currently engaged in commercial litigation against each other (Cuyahoga County Case No. CV-XX-XXXXXX), indicating significant internal instability.'),
  body('DEFENDANT 2 — DEVPIPE / OFFSHORE BUILD: Offshore Build Group LLC (Delaware-organized, operating from Lahore, Pakistan) was contracted by ADA as the actual software developer. The operator is Sameer Khan. The entity rebranded to DevPipe LLC mid-engagement (LinkedIn URL "devpipe-ex-offshorebuild" confirms the rebrand). Two of Offshore Build\'s billing Stripe accounts (acct_REDACTED_A and acct_REDACTED_B) were observed in the invoice archive.'),
  h2('B. The Original Contract'),
  body('On November 22, 2021, Sarah Bennett signed a $32,329 proposal with ADA titled "Cleaning Maid Easy, Inc — Example Booking Co. — Scheduling Mobile App Creation & Web App Update." The proposal specified:'),
  bullet('Delivery within 120 working days from acceptance and first payment (i.e., approximately May 2022).'),
  bullet('29 user stories across four user types (Cleaner, Client, Team Admin, Super Admin).'),
  bullet('Mobile app for iOS and Android, web app updates, and integrations with SendGrid, Google Calendar, and Geolocation API.'),
  body('The original contract is in evidence at /legal/2021-11-22_ADA_Original_Signed_Agreement.pdf.'),
  h2('C. What Actually Happened'),
  body('Per client testimony and the documentary record:'),
  numb('ADA subcontracted the original build to Initial Build Vendor (a no-code/low-code development platform). Initial Build Vendor produced a sub-par version of the software.'),
  numb('When the Initial Build Vendor build failed, Robert Hartwell did not refund the client. Instead, he directed her to pay a former Initial Build Vendor developer (Sameer Khan) to rebuild the software from scratch — for additional cost. The client never received a refund or compensation from ADA for the original $30,000+ paid to Initial Build Vendor.'),
  numb('On November 1, 2023, the client signed a separate Master Services Agreement with Offshore Build Group LLC. The first git commit on the simple-schedular-web repository is November 10, 2023 — consistent with the start of the Offshore Build rebuild.'),
  numb('Through mid-2024, the client paid Offshore Build through ADA as a middleman, then was redirected to pay Offshore Build directly via Stripe.'),
  numb('The Offshore Build rebuild took 29 months from first commit to last commit (April 10, 2026). The total documented engagement (Nov 21, 2021 to May 1, 2026 termination) ran 53 months.'),
  numb('The client terminated the engagement on May 1, 2026 after receiving the independent technical audit. On May 2, 2026 she performed the WordPress plugin and theme updates herself that ADA had been billing to perform for years.'),
  h2('D. What Was Paid'),
  body('The documented payment trail (assembled from the email archive, Stripe statements, and forensic extrapolation) shows:'),
  mktable(
    ['Recipient', 'Documented Invoices', 'Extrapolated', 'Total Captured', 'Client-Reported Total'],
    [
      ['ADA / Northstar Holdings (Robert Hartwell)', '$43,185.51', '$3,235.96', '$46,421.47', 'Higher (pre-Oct 2023 not captured)'],
      ['Offshore Build / DevPipe (Sameer Khan)', '$37,800.00', '$48,000.00', '$85,800.00', 'Higher (~$160k+ build cost not captured)'],
      ['Initial Build Vendor (pre-2023)', 'NOT IN ARCHIVE', '—', '—', '$30,000+ per client'],
      [{ text: 'TOTAL', bold: true }, { text: '$80,985.51', bold: true }, { text: '$51,235.96', bold: true }, { text: '$132,221.47', bold: true }, { text: '$160,000 – $224,000', bold: true, color: COLORS.red }],
    ],
    [3200, 1800, 1500, 1700, 1860]
  ),
  para('', { spacing: { after: 200 } }),
  body('The gap between documented + extrapolated ($132,221) and client-reported total ($160,000–$224,000) is approximately $27,000–$92,000. That gap is explained by: (a) the $6,000/month "Platinum Maintenance" era which preceded the documented $4,000/month era (no documented $6,000 invoices were retained); (b) pre-October 2023 ADA and Initial Build Vendor payments that fall before the email archive begins; and (c) potentially additional Stripe billings on accounts the client did not retain receipts for. A subpoena of the two Stripe accounts noted above would close this gap.'),
  h2('E. What Was Delivered'),
  body('A nine-domain independent technical audit conducted in March 2026 evaluated the delivered software against the standards of professional commercial software. The audit findings:'),
  mktable(
    ['Dimension', 'Score / Result'],
    [
      ['Overall weighted quality score', '3.1 / 10 (CRITICAL FAILURE)'],
      ['Features promised vs working', '13 of 28 fully working (46%)'],
      ['Features that crash every time used', '6 of 28 (one-line, one-character, one-template bugs)'],
      ['Documented security findings', '13 Critical + 30 High + 37 Medium + 16 Low = 96 actionable'],
      ['Active "backdoor" web shell present in production', { text: 'YES — django-webshell installed at /adminx/webshell/', color: COLORS.red, bold: true }],
      ['Customer files publicly readable on AWS S3', { text: 'YES — all uploaded photos and database backups set to public-read ACL', color: COLORS.red, bold: true }],
      ['Hardcoded credentials in source code (HighLevel OAuth secret)', { text: 'YES — visible to anyone with repository access', color: COLORS.red, bold: true }],
      ['Automated tests in the codebase', '0 (zero)'],
      ['Framework version (Django 3.2) end-of-life status', 'EOL since April 1, 2024 — no security patches'],
      ['Industry-recognized fair value for delivered scope (US senior rate)', '$54,000 – $80,000'],
      ['Industry-recognized fair value for delivered scope (offshore rate)', '$16,200 – $24,000'],
    ],
    [4500, 4500]
  ),
  para('', { spacing: { after: 200 } }),
  h2('F. The Git Log Evidence'),
  body('Git is the version-control system used by virtually every software developer. Every change to the source code creates a "commit" — a permanent, cryptographically-chained record with timestamp, author, and a count of lines added and removed. Git history cannot be retroactively fabricated without showing the manipulation.'),
  body('The git log for the simple-schedular-web repository was extracted from a zip the developers themselves provided. The analysis:'),
  bullet('534 total commits across November 10, 2023 to April 10, 2026 (29 months of actual work).'),
  bullet('Two operators — Sameer Khan and Ravi Sharma — produced ~95% of the work. The "team of US-based engineers" implied by the $100/hour rate did not exist.'),
  bullet('Calibrated effort estimate (industry-standard 30 lines of completed code per hour, with category multipliers): 648 senior-engineer hours.'),
  bullet('At the contracted $100/hour rate, the entire delivered codebase represents $64,784 of legitimate work.'),
  bullet('Four months within the 26-month paid-maintenance window had ZERO commits while continuous billing was occurring: February 2025, June 2025, July 2025, December 2025.'),
  bullet('Six additional months had fewer than 10 hours of total engineering activity.'),
  bullet('Across the maintenance window, claimed hours (80/month × 26 months = 2,080) versus delivered hours (574 from git) shows a gap of 1,506 hours = $150,600 in pure overcharge at the contracted rate.'),
  h2('G. The Marketing-Services Layer'),
  body('Separately from the application build, ADA charged $1,811.98/month for hosting, social media, and a virtual assistant. The ADA-specific forensic report quantifies the damages on this layer:'),
  bullet('Hosting fraud: ADA billed $149.99/month for WordPress hosting that GoHighLevel was actually providing (client paid GoHighLevel separately). 32+ months of double-billing.'),
  bullet('Maintenance negligence: WordPress audit log shows ADA personnel performed zero plugin/theme updates between December 16, 2025 and May 2, 2026 (138 days). Across the 34-month engagement ADA performed plugin/theme updates approximately twice. The client herself updated all plugins and the Avada theme on May 2, 2026 — the only "real" maintenance event captured in the audit log export.'),
  bullet('CVE exposure: Site was exposed to Post SMTP CVE-2025-11833 (CVSS 9.8, unauthenticated, actively exploited in the wild) for approximately 7 months while ADA billed for "Website Support and Hosting."'),
  bullet('Virtual Assistant non-delivery: $1,100/month for 25+ months, with client testimony that no VA services were delivered for several of those months. Pure billing-for-services-not-rendered.'),
  bullet('Social media non-performance: $549.99/month for 20+ months produced zero engagement on Instagram and LinkedIn across multiple 90-day periods, AI-template content with no audience growth, no engagement, no business inquiries.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const claims = [
  h1('III. Legal Theories and Causes of Action'),
  body('The factual record supports the following causes of action. Each is independently viable; collectively they form layered claims that pressure both defendants on multiple fronts.'),
  h2('A. Fraud / Fraudulent Misrepresentation (Strongest Claim)'),
  body('Elements (Ohio): (1) a material false representation made (2) with knowledge of its falsity (or with reckless disregard for the truth) (3) with intent to induce reliance, (4) which the plaintiff justifiably relied upon, (5) resulting in damages.'),
  h3('A.1 The Virtual Assistant Charge'),
  body('Claim: ADA billed $1,100/month for "Virtual Assistant — Part-Time" for 25+ months while not providing a virtual assistant for several of those months.'),
  body('Why this is the strongest claim:'),
  bullet('Binary fact: services were delivered or not. No technical expertise required.'),
  bullet('Documentary evidence: ADA produced invoices billing for the service. Client can testify no services were received. The burden shifts to ADA to produce timesheets, deliverables, or communication evidence — none of which is documented in the client\'s email archive across the relevant months.'),
  bullet('Pierces the ADA limitation-of-liability clause: Ohio law does not enforce liability caps for intentional fraud.'),
  bullet('Damages: $5,500 – $27,500 (depending on which months can be confirmed as non-delivery).'),
  bullet('Procedural advantage: the VA claim is the "wedge issue" — small in dollars but unambiguous in proof — that opens the door to discovery on the rest.'),
  h3('A.2 The Hosting Double-Billing'),
  body('Claim: ADA billed $149.99/month for "Summit Website Support and Hosting" while the client\'s examplebooking.example WordPress site was actually hosted on her own GoHighLevel WordPress hosting account, which she paid for separately.'),
  bullet('ADA was charging the client for a service GoHighLevel was actually providing.'),
  bullet('Damages: $4,800 if treated as full double-billing, or ~$4,300 if measured as the difference between ADA\'s $149.99 charge and the $10–$30 industry-standard for hosting ADA was not actually performing.'),
  h2('B. Breach of Contract / Failure of Consideration'),
  body('Elements (Ohio): (1) existence of a valid contract, (2) performance by the plaintiff, (3) breach by the defendant, (4) damages.'),
  h3('B.1 The Software Build'),
  body('Claim against Offshore Build and ADA (joint, as ADA was the contracting party and Offshore Build was the subcontractor): the November 22, 2021 ADA contract committed to delivery within 120 working days. As of May 1, 2026, 4.5 years later, the software remains:'),
  bullet('Not safe to use in production (13 Critical security vulnerabilities including an active web shell).'),
  bullet('Only 46% feature-complete against the original 29 user stories.'),
  bullet('Crashing on every attempt for six core features.'),
  bullet('Missing entirely from the original scope: the iOS mobile app, the Android mobile app, payment processing.'),
  body('Damages: clawback of $54,000 — $80,000 (the difference between paid and the fair-value of the delivered product) at a minimum; potentially full clawback under failure-of-consideration theory.'),
  h3('B.2 The Maintenance Retainer'),
  body('Claim against Offshore Build: the $4,000–$6,000/month maintenance retainer obligated Offshore Build to perform routine maintenance. Per the dependency lockfile (Django 3.2 since project start, Pillow 9.0.1, PyJWT 1.7.1, all CVE-affected packages never updated) and the git log (four full months with zero commits during the paid window), routine maintenance was not performed.'),
  bullet('Damages: $79,000 – $151,000 in maintenance overpayment, depending on the precise scope of the $6,000 vs $4,000 month accounting.'),
  h3('B.3 The Hosting / Social / VA Retainer'),
  body('Claim against ADA: covered above in fraud and below in negligence; can also be pled as breach of contract for failure to deliver the services contracted.'),
  h2('C. Gross Negligence'),
  body('Elements (Ohio): conduct manifesting reckless disregard for the rights of others, beyond mere negligence.'),
  h3('C.1 Software Engineering Gross Negligence'),
  body('The Example Booking Co. application was delivered to production with:'),
  bullet('An active web shell (django-webshell) that grants any admin-level user complete operating-system-level control of the server. This is malware-equivalent. No professional engineer would intentionally deliver this in production.'),
  bullet('A hardcoded HighLevel OAuth client secret in the source code visible to anyone with repository read access.'),
  bullet('All uploaded customer files (including photos) set to public-read on AWS S3.'),
  bullet('A default password ("TempPass123@") hardcoded in an unauthenticated webhook that lets any internet user create admin accounts.'),
  bullet('A password reset OTP that never checks its expiry, making any reset code valid forever — facilitating brute-force account takeover.'),
  body('These are not edge cases. They are first-day-of-a-security-class failures that a professional engineering team must catch. Combined, they constitute reckless disregard for the client\'s and the client\'s customers\' data privacy and business operations.'),
  h3('C.2 Maintenance Gross Negligence'),
  body('Across 26 paid maintenance months, no dependency-security patch was applied — including patches for Pillow CVE-2023-50447 (arbitrary code execution, publicly known since January 2024) and PyJWT CVE-2022-29217 (authentication bypass, publicly known since May 2022). The Django framework itself reached end-of-life on April 1, 2024 and was not upgraded.'),
  h3('C.3 WordPress Marketing-Site Negligence'),
  body('Post SMTP CVE-2025-11833 (CVSS 9.8, unauthenticated, actively exploited from disclosure on October 11, 2025) was not patched until the client did it herself on May 2, 2026 — approximately 7 months during which ADA was being paid for "Website Support and Hosting" while the site was vulnerable to a publicly-disclosed account-takeover exploit.'),
  body('Why gross negligence matters here: it is a separate cause of action that does not require a fraud finding, and it also pierces the limitation-of-liability cap in ADA\'s Terms of Service.'),
  h2('D. Deceptive Trade Practices (Ohio CSPA)'),
  body('The Ohio Consumer Sales Practices Act (ORC § 1345.01 et seq.) prohibits deceptive acts in connection with a consumer transaction. While the engagement is commercial-to-commercial (LLC-to-LLC), Ohio courts have permitted CSPA claims where the misrepresented service involves a "personal" or "family" element — here, the client is an individual operating a small cleaning business in her name. Counsel should evaluate viability.'),
  body('If CSPA applies: it permits treble damages plus attorney\'s fees, which is a significant multiplier.'),
  h2('E. Unjust Enrichment (Equitable Backup)'),
  body('Standard pleading practice would include unjust enrichment as a backup theory in case any of the contracts are found unenforceable for some other reason. The factual elements (benefit conferred, knowledge of the benefit, retention without payment) are easily satisfied.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const damages = [
  h1('IV. Damages Summary'),
  mktable(
    ['Damages Category', 'Theory', 'Low Estimate', 'High Estimate'],
    [
      ['Software build overpayment', 'Breach of contract / failure of consideration', '$80,000', '$170,000'],
      ['Maintenance overpayment (Offshore Build)', 'Breach of contract / fraud', '$79,000', '$151,000'],
      ['ADA hosting double-billing', 'Fraud / restitution', '$3,840', '$4,800'],
      ['ADA Virtual Assistant non-delivery', 'Fraud', '$5,500', '$27,500'],
      ['ADA social media non-performance', 'Breach of contract / restitution', '$5,000', '$9,000'],
      ['ADA misc. (GSuite markup, etc.)', 'Restitution', '$140', '$200'],
      [{ text: 'SUBTOTAL — actual damages', bold: true }, '', { text: '$173,480', bold: true }, { text: '$362,500', bold: true, color: COLORS.red }],
      ['Punitive damages (Ohio permits 2× actual damages for fraud)', 'Fraud (VA + hosting)', '$18,680', '$64,600'],
      ['CSPA treble damages (if applicable)', 'Deceptive Trade Practices', '+2× actual', '+2× actual'],
      ['Attorney\'s fees (if CSPA applies)', 'Statutory', 'TBD', 'TBD'],
      [{ text: 'AGGREGATE (low — high)', bold: true }, '', { text: '$192,160+', bold: true, color: COLORS.red }, { text: '$427,100+', bold: true, color: COLORS.red }],
    ],
    [3700, 2000, 1700, 1860]
  ),
  para('', { spacing: { after: 200 } }),
  body('A reasonable settlement target — accounting for litigation risk, collectibility, and the time-value of money — is likely in the $100,000–$250,000 range. This is sufficient to make the client substantially whole on the cash overpayment while leaving meaningful "headroom" to settle without trial.'),
  body('Note on collectibility: Northstar Holdings Inc. and Robert Hartwell are currently engaged in commercial litigation with co-owner James Whitfield (Cuyahoga County CV-XX-XXXXXX). This may indicate financial strain on the ADA side. The Offshore Build entity is offshore (Pakistan-operated, Delaware-shell) and presents collection difficulties. Counsel should consider whether the strongest collectible asset is ADA and structure pleadings accordingly.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const strategy = [
  h1('V. Strategic Recommendations'),
  h2('A. Sequencing'),
  numb('Step 1 — Demand Letter (Days 1–14). Draft a comprehensive demand letter that anchors on the Virtual Assistant fraud (cleanest, most unambiguous claim) and layers the hosting double-billing, security negligence, and breach of contract. Demand: (a) cessation of all ongoing billings, (b) clawback of fees paid for unrendered services (start at the high end of the range to leave negotiation room), and (c) preservation of evidence including the ADA client portal, billing records, and Slack/Teams archives.'),
  numb('Step 2 — Filing (Days 30–45 if demand letter is unanswered). File a civil complaint in Cuyahoga County Court of Common Pleas (where the existing Hartwell-Whitfield litigation is venued and where ADA is registered). Name as defendants: Northstar Holdings Inc., Robert J. Hartwell individually (piercing the corporate veil where applicable), Acme Digital Agency, Offshore Build Group LLC, and Sameer Khan individually. Allege fraud (count 1), breach of contract (count 2), gross negligence (count 3), unjust enrichment (count 4), and CSPA if viable (count 5).'),
  numb('Step 3 — Discovery (Days 60–180). Aggressive discovery on ADA\'s side: subpoena the Virtual Assistant timesheet records, the actual hosting provider invoices, all internal Slack/Teams communications about Example Booking Co., ADA\'s contracts with Initial Build Vendor and Offshore Build (to establish the offshore arrangement), and tax filings to assess collectibility. On the Offshore Build side: subpoena the two Stripe billing accounts (acct_REDACTED_A and acct_REDACTED_B) for the complete billing history, including the missing $6,000/month Platinum Maintenance era.'),
  numb('Step 4 — Settlement window (Days 90–270). Most cases of this profile settle in the 6-month range after filing. The Hartwell-Whitfield litigation creates pressure on ADA to settle rather than fight a two-front war.'),
  h2('B. The "Squeeze" Strategy'),
  body('Northstar Holdings Inc. (Robert Hartwell\'s holding company, which controls ADA) is currently suing James Whitfield (publicly listed as ADA\'s owner) in Cuyahoga County. The two principals of ADA are litigating against each other. This is a significant strategic advantage:'),
  bullet('ADA\'s legal and financial reserves are already partially consumed by the Hartwell-Whitfield case.'),
  bullet('A simultaneous Example Booking Co. lawsuit forces Robert Hartwell into a two-front legal war.'),
  bullet('Settlement leverage is highest precisely when a defendant is financially strained.'),
  body('Counsel should monitor the Hartwell-Whitfield docket and time the Example Booking Co. filing for maximum overlap.'),
  h2('C. Cross-Claim Potential Between ADA and Offshore Build'),
  body('ADA was the contracting party with the client. Offshore Build was ADA\'s subcontractor. If the client sues both, ADA has a credible cross-claim against Offshore Build for indemnification — which means ADA has an incentive to settle quickly to avoid having to litigate against its own Pakistan-based subcontractor across jurisdictional barriers.'),
  body('This dynamic creates a "race to settle" between ADA and Offshore Build, both of whom would prefer to be left out of the lawsuit. Counsel should consider whether to settle with ADA first (extracting cash, since ADA is in-jurisdiction and collectible) and then deal with Offshore Build separately (where collection is harder).'),
  h2('D. The Class-Action Question'),
  body('ADA markets itself as a premium US-based digital agency offering monthly retainers including the same hosting, virtual assistant, and social media line items. If they have employed the same model on other clients — billing for offshore work at US-premium rates, billing for VAs that don\'t exist, billing for hosting they don\'t actually provide — there is a class-action universe.'),
  body('Counsel should consider in early discovery whether to request ADA\'s full client list and billing structure. Even if a class action is not ultimately pursued, the threat is significant leverage: ADA\'s business model collapses publicly if disclosed.'),
  body('Caution: any pre-litigation threat to publicize this information must be handled carefully under Ohio law to avoid civil extortion claims. The standard practice is to make demands privately and proceed through litigation channels.'),
  h2('E. Insurance Coverage Considerations'),
  body('The client may have errors-and-omissions or cyber-liability insurance that covers some or all of the damages (specifically the web-shell-related breach risk and the unpatched-CVE exposure period). Counsel should request and review:'),
  bullet('The client\'s commercial general liability policy.'),
  bullet('Any cyber-liability or media-liability rider.'),
  bullet('Any technology errors-and-omissions coverage.'),
  body('The "Requested info for Cyber coverage" email in the archive suggests the client was in the process of applying for cyber coverage; if a policy was issued and any incident occurred during the unpatched-CVE window, coverage may apply.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const evidence = [
  h1('VI. Evidence Index'),
  body('The complete evidence packet is on the client\'s OneDrive at /Example Booking Co./forensic-output/. Key items by priority for counsel:'),
  h2('A. Primary Documents'),
  bullet('legal/2021-11-22_ADA_Original_Signed_Agreement.pdf — original signed proposal, $32,329, 120-day delivery.'),
  bullet('legal/OFFSHORE BUILD GROUP LLC (Service Agreement).docx (1).pdf — November 2023 MSA with Offshore Build.'),
  bullet('legal/Contract.eml — contract transmittal email.'),
  bullet('legal/W9.eml — Offshore Build\'s W-9 (tax-ID information for serving).'),
  bullet('legal/fw8ben.pdf, fw9 (1) copy.pdf — additional tax forms.'),
  h2('B. Damage-Quantification Evidence'),
  bullet('ExampleBooking_Forensic_Report.docx/.pdf — master 7-part technical and financial investigation.'),
  bullet('ExampleBooking_ADA_Forensic_Report.docx — agency-services damages report.'),
  bullet('invoices/ExampleBooking_Invoice_Forensics.xlsx — 51-tab Excel: every invoice, recurring breakdown, one-off breakdown, full git commit log, monthly effort rollup, billed-vs-delivered variance, idle months.'),
  h2('C. Technical Audit Evidence'),
  bullet('reports/00-value-assessment.md — master value assessment, 3.1/10 score.'),
  bullet('reports/04-feature-completeness.md — 13-of-28 feature audit with specific line-number references.'),
  bullet('reports/security-audit-report.md — 105 security findings with OWASP categorization.'),
  bullet('reports/Comprehensive_Software_Assessment_Report.md — non-technical executive summary.'),
  bullet('reports/examplebooking_wordpress_security.md — WordPress marketing-site security scan.'),
  h2('D. Communication Evidence'),
  bullet('individual-messages/ — 152 individual emails (M-0001 through M-0152), markdown-formatted with full headers, sender, recipient, date, time, and summary.'),
  bullet('threads/ — 6 reconstructed multi-message email threads (T-0001 through T-0006).'),
  bullet('individual-messages/M-0001 to M-0152 specifically include exchanges with Robert Hartwell, Helen Brooks (ADA account manager), Diana Reeves (ADA web dev), Sameer Khan, and Bilal (Offshore Build team).'),
  h2('E. Operational Evidence'),
  bullet('Git repository simple-schedular-web (zipped) — 534 commits, complete development history, cryptographically chained timestamps.'),
  bullet('other-attachments/wdf-audit-logs-export-260515154146.csv — WordPress audit log showing zero ADA maintenance Dec 16, 2025 – May 2, 2026.'),
  bullet('other-attachments/avada_changelog.txt — Avada theme changelog with all "SECURITY:" patch entries.'),
  bullet('other-attachments/Example Booking Co. Account Report _ 90 Days _ July 2025.pdf — ADA\'s own quarterly account report documenting marketing failure.'),
  bullet('other-attachments/(scanned PDFs)/Example Booking Co. Account Report _ Q1 2026.pdf — most recent ADA quarterly report.'),
  h2('F. Subpoena Targets'),
  numb('Stripe Inc. — for full billing records on accounts acct_REDACTED_A and acct_REDACTED_B (the two Offshore Build billing accounts). Will close the gap between documented and client-asserted total spend.'),
  numb('ADA / Northstar Holdings — for Virtual Assistant timesheet records, hosting provider invoices, plugin/theme update logs, social-media campaign briefs, and all internal communications about Example Booking Co..'),
  numb('GoHighLevel — to confirm the examplebooking.example WordPress hosting was on the client\'s account (not ADA\'s), thereby establishing the hosting double-billing.'),
  numb('Initial Build Vendor — for the original pre-Offshore Build build records and payments received (to determine whether ADA pocketed the original $30,000+).'),
  new Paragraph({ children: [new PageBreak()] }),
];

const close = [
  h1('VII. Closing Observation'),
  body('The factual record assembled in this packet is unusually complete for a fraud / breach-of-contract case of this profile. Three artifacts in particular are dispositive:'),
  numb('The git log. 534 commits, cryptographically chained, showing exactly what was built and when. Idle months and rework patterns visible at a glance. This is the kind of evidence that does not need expert testimony to explain — counsel can show a court the per-month commit count chart and the case is largely made.'),
  numb('The WordPress audit log. 138 days with zero plugin updates by ADA, then the client doing them all herself on the day of termination. This is one screenshot of evidence.'),
  numb('ADA\'s own quarterly account reports. They documented the marketing failure in writing, quarter after quarter, and did nothing about it. Their own reports are the testimony against them.'),
  body('The client has been substantially defrauded across two distinct vectors (software development at offshore-arbitrage markups, and agency services on a "white-label-front" model) over a 53-month engagement. The aggregate documented overpayment is $130,000–$280,000 depending on which months and which interpretations are credited. Both vectors are evidentially clean and litigatable.'),
  body('Recommended next step: a one-hour engagement call with the client to discuss the evidence packet, retain commercial-litigation counsel in Cuyahoga County, and serve a demand letter within 30 days targeting the Virtual Assistant fraud as the wedge issue.'),
  para('', { spacing: { after: 240 } }),
  para('— End of Memorandum —', { run: { size: 22, bold: true, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: COLORS.accent }, paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: { default: new Header({ children: [new Paragraph({
      children: [new TextRun({ text: 'PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT', size: 18, color: COLORS.red, italics: true, bold: true })],
      alignment: AlignmentType.CENTER,
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Page ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLORS.darkgrey }), new TextRun({ text: ' of ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLORS.darkgrey })],
    })] }) },
    children: [...cover, ...intro, ...facts, ...claims, ...damages, ...strategy, ...evidence, ...close],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = './forensic-output/forensic-output/ExampleBooking_Attorney_Legal_Memo.docx';
  fs.writeFileSync(out, buffer);
  console.log('Wrote ' + out + ' (' + buffer.length + ' bytes)');
});
