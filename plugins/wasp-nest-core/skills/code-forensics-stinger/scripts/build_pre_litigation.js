const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, AlignmentType, LevelFormat, ShadingType, WidthType, BorderStyle, HeadingLevel, PageBreak, PageNumber } = require('docx');

const COLORS = { primary: '1F4E78', accent: '2E75B6', red: 'C00000', green: '548235', darkgrey: '595959', lightgrey: 'F2F2F2', lightred: 'FCE4E4' };

const border = (c='CCCCCC') => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders4 = (c='CCCCCC') => { const b=border(c); return { top: b, bottom: b, left: b, right: b }; };

const para = (text, opts = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [new TextRun({ text: text || '', ...(opts.run || {}) })],
  spacing: opts.spacing || { after: 160 }, alignment: opts.alignment, heading: opts.heading,
  ...(opts.numbering ? { numbering: opts.numbering } : {}),
  ...(opts.pageBreakBefore ? { pageBreakBefore: true } : {}),
});
const h1 = (t) => para(t, { heading: HeadingLevel.HEADING_1, run: { size: 28, bold: true, color: COLORS.primary }, spacing: { before: 280, after: 140 } });
const h2 = (t) => para(t, { heading: HeadingLevel.HEADING_2, run: { size: 24, bold: true, color: COLORS.primary }, spacing: { before: 240, after: 120 } });
const body = (t, opts={}) => para(t, { run: { size: 22, ...opts } });
const bodyBold = (t) => para(t, { run: { size: 22, bold: true } });
const small = (t) => para(t, { run: { size: 18, italics: true, color: COLORS.darkgrey } });
const bullet = (t) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
const numb = (t) => new Paragraph({ numbering: { reference: 'numbers', level: 0 }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
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
const spacer = (size = 200) => new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: size } });
const hr = () => new Paragraph({ children: [new TextRun({ text: '', size: 14 })], border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' } }, spacing: { after: 80, before: 80 } });

const senderBlock = () => [
  para('EXAMPLE BOOKING CO. LLC', { run: { size: 24, bold: true, color: COLORS.primary }, spacing: { after: 40 } }),
  body('[REDACTED CLIENT ADDRESS — line 1]'),
  body('[REDACTED CLIENT ADDRESS — line 2]'),
  body('Email: sarah@examplebooking.example'),
  body('Phone: [REDACTED PHONE]'),
  spacer(240),
];

const sigBlock = (date) => [
  spacer(400),
  body('Sincerely,'),
  spacer(600),
  para('______________________________', { run: { size: 22 } }),
  para('Sarah M. Bennett', { run: { size: 24, bold: true } }),
  para('Owner and Managing Member', { run: { size: 20 } }),
  para('Example Booking Co. LLC', { run: { size: 20 } }),
  spacer(160),
  para(`Date Issued: ${date}`, { run: { size: 20, italics: true } }),
];

const reserveRights = () => [
  hr(),
  para('RESERVATION OF RIGHTS', { run: { size: 20, bold: true, color: COLORS.darkgrey } }),
  small('This letter is submitted without prejudice to any rights or remedies of Example Booking Co. LLC under contract, statute, or common law, all of which are expressly reserved. Nothing in this letter shall be construed as a waiver of any right, claim, or defense. This communication is intended solely for the named recipient(s).'),
];

// =================================================================
// SHARED HEADER STYLE FOR ALL DOCS
// =================================================================
const docStyles = {
  default: { document: { run: { font: 'Arial', size: 22 } } },
  paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
  ],
};

const docNumbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
  ],
};

const buildDoc = (children, headerText) => new Document({
  styles: docStyles,
  numbering: docNumbering,
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: { default: new Header({ children: [new Paragraph({
      children: [new TextRun({ text: headerText, size: 18, color: COLORS.darkgrey, italics: true })],
      alignment: AlignmentType.CENTER,
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Page ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLORS.darkgrey }), new TextRun({ text: ' of ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLORS.darkgrey })],
    })] }) },
    children,
  }],
});

const writeDoc = (doc, outName) => {
  return Packer.toBuffer(doc).then(buffer => {
    const out = `./forensic-output/forensic-output/pre-litigation-pack/${outName}`;
    fs.writeFileSync(out, buffer);
    console.log('Wrote ' + out + ' (' + buffer.length + ' bytes)');
  });
};

const DATE = 'May 15, 2026';

// =================================================================
// DOC 1: PRE-DEMAND FINDINGS LETTER — ADA
// =================================================================
const doc1 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND CERTIFIED MAIL — RETURN RECEIPT REQUESTED', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Robert J. Hartwell, Managing Director'),
  body('Acme Digital Agency, LLC'),
  body('Northstar Holdings Inc.'),
  body('[REDACTED AGENCY ADDRESS] (previously listed at [REDACTED FORMER AGENCY ADDRESS])'),
  body('[REDACTED CITY, STATE ZIP]'),
  body('Via email: robert@acmedigitalagency.example; robert@ada.example; support@acmedigitalagency.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   Notice of Forensic Findings — Example Booking Co. LLC Engagement (Nov 2021 – May 2026)'),
  bodyBold('         Reference: Original Proposal Dated November 22, 2021 — "Example Booking Co. — Scheduling Mobile App Creation & Web App Update"'),
  spacer(240),
  body('Dear Mr. Hartwell,'),
  spacer(80),
  body('I write to provide you with formal notice that Example Booking Co. LLC has completed a comprehensive forensic investigation of the engagement that began with the proposal dated November 22, 2021 and continued through the termination of services on May 1, 2026.'),
  body('The investigation was conducted across nine independent technical and financial domains by qualified third-party analysts and resulted in approximately 90 pages of formal reporting, a 51-tab evidence spreadsheet, and a fully indexed archive of 152 email messages and 8 contract documents. The full evidence packet has been preserved for legal proceedings and is available to your counsel upon written request.'),
  body('The purpose of this letter is to summarize, at a high level, what the investigation found. A separate Formal Notice of Breach and Demand for Cure will follow within seven (7) calendar days.'),
  h1('I.  Summary of Findings'),
  body('Across the 53-month engagement, Example Booking Co. LLC has paid Acme Digital Agency, LLC and its affiliates approximately $160,000 to $224,000. The forensic record establishes that a material portion of these payments was either (a) for services not delivered, (b) for services delivered at quality far below industry standards, or (c) for services billed by ADA while actually provided by a separate vendor for which Example Booking Co. LLC was also paying.'),
  h2('A. Hosting Charges — Apparent Double-Billing'),
  body('ADA billed Example Booking Co. LLC $149.99 per month for "Summit Website Support and Hosting" for the examplebooking.example WordPress website. Independent technical analysis establishes that this website was hosted on Example Booking Co. LLC\'s own GoHighLevel (now HighLevel) WordPress hosting account during the entire billing period — a service for which Example Booking Co. LLC paid GoHighLevel directly and separately.'),
  body('To the extent any "support" portion was bundled into this fee, the WordPress audit log for examplebooking.example confirms that between December 16, 2025 and May 2, 2026 (138 days), no ADA employee performed a single plugin or theme security update. The Avada theme was updated by ADA personnel approximately twice across the entire 34-month period (September 2024 and May 2025), leaving the site exposed to critical, publicly-disclosed CVEs for periods exceeding 600 days.'),
  body('Aggregate documented hosting overcharge across 32 documented billing months: approximately $3,840 to $4,800 depending on the interpretation applied.'),
  h2('B. Virtual Assistant Charges — Apparent Billing for Services Not Rendered'),
  body('ADA billed Example Booking Co. LLC $1,100.00 per month for a line item titled "Virtual Assistant — Part-Time" beginning approximately January 1, 2024 and continuing through at least March 1, 2026. Across 25 documented billing months, Example Booking Co. LLC was charged a total of $27,500.00 for this service.'),
  body('Per the direct records and testimony of Example Booking Co. LLC, no virtual assistant services were rendered for a significant portion of those months. Specifically, there is no documentary record of communications, task assignments, completed deliverables, or any other artifact of a virtual assistant having worked on Example Booking Co. LLC matters during multiple months for which ADA billed.'),
  body('Billing for services not rendered may constitute fraud under Ohio law. This finding alone, independent of all other findings in the investigation, supports a clawback claim.'),
  h2('C. Social Media Management — Documented Non-Performance'),
  body('ADA billed Example Booking Co. LLC $549.99 per month for "Social Media Management — Silver" beginning September 2024 and continuing through May 2026. ADA\'s own quarterly Account Reports — which we have on file as authored by your account manager Helen Brooks — document the following performance across the April 22 – July 20, 2025 90-day reporting period:'),
  mktable(
    ['Platform / Metric', 'ADA Result', 'Industry Benchmark'],
    [
      ['Instagram engagement rate', '0.0%', '0.45 – 0.60%'],
      ['LinkedIn engagement rate', '0.0%', '3.0 – 6.2%'],
      ['Facebook post engagements (90 days)', '2', '20 – 200 typical'],
      ['Google My Business reviews', '0', '5 – 50 / year typical'],
      ['Google My Business website visits', '0', '20 – 500 / quarter typical'],
      ['Google Search Console clicks', '28 (down 51.72%)', '~100 – 500 typical'],
    ],
    [3800, 2500, 2700]
  ),
  spacer(160),
  body('Comparable industry deliverables at this price point ($550/month) include custom-written, business-specific content, measurable audience growth, and engagement-driven optimization. The output documented in ADA\'s own reports — emoji-laden AI-template posts producing zero engagement on multiple platforms — is consistent with the lowest tier of automated post-scheduling, valued at $100–$300 per month at most.'),
  h2('D. Software Build and Maintenance (Subcontracted to Offshore Build Group LLC)'),
  body('The independent technical audit of the Example Booking Co. application, which ADA contracted in November 2021 and subsequently subcontracted to Offshore Build Group LLC, found the application to be unsafe for production use. Specific findings include:'),
  bullet('Overall weighted quality score: 3.1 / 10 (CRITICAL).'),
  bullet('Working features: 13 of 28 promised (46%). Six features crash on every attempted use, each with single-line, single-character, or single-template defects.'),
  bullet('Security: 13 Critical, 30 High, and 37 Medium documented security vulnerabilities. These include an active "web shell" (django-webshell) in production, customer files set to public-read on Amazon S3, a hardcoded HighLevel OAuth client secret in the source code, and an unauthenticated webhook that allows creation of admin accounts with a known default password.'),
  bullet('Test coverage: zero automated tests.'),
  bullet('Framework: Django 3.2, end-of-life since April 1, 2024 and never upgraded.'),
  body('Because ADA was the original contracting party under the November 22, 2021 proposal, ADA bears contractual responsibility for the defects of the subcontracted work, notwithstanding any side agreements directing Example Booking Co. LLC to pay Offshore Build Group LLC directly.'),
  h1('II.  Evidence Available to Your Counsel'),
  body('The forensic packet preserved for legal proceedings includes:'),
  bullet('Master Forensic Report (40+ pages) detailing all seven investigation domains.'),
  bullet('Master Invoice Spreadsheet (51 worksheets) including the complete git commit log of 534 commits, monthly effort rollup, and a "Billed vs Delivered" variance analysis.'),
  bullet('152 email messages and 6 reconstructed email threads covering the full engagement.'),
  bullet('Original signed ADA proposal dated November 22, 2021.'),
  bullet('Eight third-party technical audit reports.'),
  bullet('WordPress audit log export (Dec 16, 2025 – May 2, 2026) showing zero ADA-driven maintenance activity.'),
  bullet('Complete Avada theme changelog with CVE-by-version timeline.'),
  bullet('All retained ADA quarterly Account Reports.'),
  body('Each item above is dated, signed, or otherwise authenticatable.'),
  h1('III.  Notice of Litigation Hold'),
  body('You are formally on notice that Example Booking Co. LLC contemplates legal proceedings. You and your affiliated entities (Acme Digital Agency, LLC; Northstar Holdings Inc.; and any successor entities) are required to preserve all documents, electronic records, communications, billing records, internal Slack/Teams/email archives, timesheet records, contractor invoices, and any other materials relating to the Example Booking Co. LLC engagement. The destruction or alteration of any such materials following receipt of this letter may be sanctionable conduct.'),
  body('This litigation hold expressly includes — but is not limited to — all records relating to:'),
  bullet('The "Virtual Assistant — Part-Time" service line, including any timesheets, deliverables, and contractor assignments for the period January 2024 through May 2026.'),
  bullet('The hosting and maintenance arrangements for examplebooking.example, including any contracts with third-party hosting providers and plugin/theme update logs.'),
  bullet('The Initial Build Vendor, Inc. relationship for the original 2021–2023 build of the Example Booking Co. application, including all payments to or from Initial Build Vendor.'),
  bullet('The Offshore Build Group LLC subcontracting arrangement, including all payments, work orders, and quality assurance records.'),
  h1('IV.  Next Steps'),
  body('Example Booking Co. LLC intends to issue a Formal Notice of Breach and Demand for Cure within the next seven (7) calendar days. The Demand will identify specific dollar amounts subject to clawback, cite specific breached contract terms and applicable Ohio statutory authority, and set a response deadline.'),
  body('In the interim, you are encouraged to:'),
  numb('Retain legal counsel.'),
  numb('Preserve all evidence as identified in Section III above.'),
  numb('Cease all further billing to Example Booking Co. LLC. Any further charges to Example Booking Co. LLC payment methods will be disputed with the issuing institution as billing for services not rendered, with this letter and the underlying forensic packet provided as supporting documentation.'),
  numb('Direct any inquiries through counsel.'),
  body('If you wish to engage in good-faith pre-litigation resolution discussions, please direct your counsel to respond to this letter in writing within seven (7) calendar days from the date above.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Pre-Litigation Findings Notice (ADA) — CONFIDENTIAL');

// =================================================================
// DOC 2: PRE-DEMAND FINDINGS LETTER — OFFSHORE BUILD / DEVPIPE
// =================================================================
const doc2 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND INTERNATIONAL CERTIFIED MAIL', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Sameer Khan'),
  body('Offshore Build Group LLC'),
  body('DevPipe LLC'),
  body('[REDACTED SUBCONTRACTOR ADDRESS]'),
  body('[REDACTED CITY], New Jersey 08880 (US registered agent address)'),
  body('Operating address: Lahore, Pakistan'),
  body('Via email: sameer@devpipe.example; sameer@offshorebuild.example; contact@devpipe.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   Notice of Forensic Findings — Example Booking Co. Application'),
  bodyBold('         Reference: Master Services Agreement Dated November 1, 2023'),
  spacer(240),
  body('Mr. Offshore Build,'),
  spacer(80),
  body('I write to provide you with formal notice that Example Booking Co. LLC has completed a comprehensive forensic investigation of the development and maintenance services provided by Offshore Build Group LLC (now operating as DevPipe LLC) under the Master Services Agreement dated November 1, 2023.'),
  body('The investigation was conducted across nine independent technical domains and includes a complete forensic parse of the git history of the simple-schedular-web repository (534 commits, November 10, 2023 through April 10, 2026). The full evidence packet has been preserved and is available to your counsel upon written request.'),
  body('The purpose of this letter is to summarize, at a high level, what the investigation found. A separate Formal Notice of Breach and Demand for Cure will follow within seven (7) calendar days.'),
  h1('I.  Summary of Findings'),
  h2('A. Software Quality — Below Professional Standard'),
  body('The independent technical audit, conducted in March 2026, assigned the delivered Example Booking Co. application an overall weighted quality score of 3.1 out of 10 across nine quality domains. Specific findings include:'),
  bullet('13 of 28 promised features fully functional; 6 of 28 crash on every attempted use; 9 are partially working; and several core features (payment processing, invoicing, mobile applications, public booking, reporting) were never delivered at all.'),
  bullet('13 Critical, 30 High, and 37 Medium documented security vulnerabilities — totaling 96 actionable findings.'),
  bullet('Among the Critical findings: an active django-webshell package installed in production, granting any administrator complete operating-system-level access to the production server.'),
  bullet('All customer-uploaded files and database backups set to publicly-readable on Amazon S3.'),
  bullet('The HighLevel OAuth2 client secret hardcoded in the source code, exposing the integration to any party with repository read access.'),
  bullet('An unauthenticated webhook endpoint allowing any internet user to create administrator accounts using a hardcoded default password ("TempPass123@").'),
  bullet('A password-reset OTP function that never checks expiry, leaving the application brute-forceable in approximately 15 minutes.'),
  bullet('Zero automated tests.'),
  bullet('The application framework, Django 3.2, has been end-of-life and unsupported since April 1, 2024 — twenty-four months prior to the date of this letter — and was never upgraded.'),
  h2('B. The Recurring-Appointment Logic Defect'),
  body('The most consequential defect found in the application is a logic error in the `regenerate_appointments` Celery task, which is responsible for extending the rolling two-year window of future appointments. The date-guard condition in the task only triggers when the next scheduled date exactly matches today\'s month and day. For weekly recurring appointments, this condition is satisfied at most once per year. As a result, the rolling window is functionally never extended, and recurring appointment series will gradually vanish from client calendars without notification. This defect alone renders the core business feature of the application unfit for its intended commercial purpose.'),
  h2('C. Maintenance Billing Versus Delivered Effort'),
  body('Across the 26-month maintenance window (approximately March 2024 through April 2026), Offshore Build Group LLC (and successor DevPipe LLC) billed Example Booking Co. LLC $4,000 to $6,000 per month for what was represented as 80 hours per month of maintenance work. The git commit history establishes the actual delivered effort:'),
  mktable(
    ['Metric', 'Value'],
    [
      ['Total commits across maintenance window', '440+ across 26 months'],
      ['Months with ZERO commits to the repository', '4 (February, June, July, and December 2025)'],
      ['Additional months with fewer than 10 hours of activity', '6'],
      ['Total calibrated senior-engineer hours delivered', '574 hours'],
      [{ text: 'Total hours implied by maintenance billing (80 × 26)', bold: true }, { text: '2,080 hours', bold: true, color: COLORS.red }],
      [{ text: 'Unexplained gap', bold: true }, { text: '1,506 hours = $150,600 at the contracted $100/hr rate', bold: true, color: COLORS.red }],
    ],
    [4500, 4500]
  ),
  spacer(160),
  body('The git log is a cryptographically-chained record that cannot be retroactively altered without detection. The four months showing zero commits while continuous monthly billing occurred — at $4,000 per month each, totaling $16,000 — are particularly difficult to reconcile with the represented 80-hour-per-month maintenance schedule.'),
  h2('D. Dependency Maintenance — Not Performed'),
  body('The dependency lockfile (requirements.txt) of the simple-schedular-web repository establishes that no security patch has been applied to any of the following CVE-affected packages across the entire 29-month commit history:'),
  bullet('Django 3.2 — end-of-life since April 2024.'),
  bullet('Pillow 9.0.1 — CVE-2023-50447 (arbitrary code execution) unpatched since January 2024.'),
  bullet('PyJWT 1.7.1 — CVE-2022-29217 (authentication bypass) unpatched since May 2022.'),
  bullet('cryptography 36.0.2, waitress 2.0.0, urllib3 1.26.16 — all multiple major versions behind current.'),
  bullet('djangorestframework-jwt 1.11.0 — package abandoned by maintainer in 2019.'),
  body('A maintenance vendor performing the routine work covered by a Master Services Agreement of this type would, at minimum, apply security patches to known CVE-affected dependencies within weeks of disclosure. The absence of any such patches across 26 months of paid maintenance is the foundation of the maintenance-fraud component of this investigation.'),
  h1('II.  Evidence Available to Your Counsel'),
  body('The forensic packet preserved for legal proceedings includes:'),
  bullet('Master Forensic Report (40+ pages).'),
  bullet('Master Invoice Spreadsheet with the complete git commit log (534 rows, calibrated effort estimates per commit).'),
  bullet('Eight third-party technical audit reports.'),
  bullet('The full simple-schedular-web repository as provided by your team in zipped form.'),
  bullet('All DevPipe LLC and Offshore Build Group LLC invoices retained by Example Booking Co. LLC, including PDFs of invoices #STRIPE_PREFIX_A-0006, CC2FAA50-0003 through 0032, 157FDCC1-0003 through 0005, and DO4PCESA-0001.'),
  bullet('The Master Services Agreement dated November 1, 2023.'),
  h1('III.  Notice of Litigation Hold'),
  body('You are formally on notice that Example Booking Co. LLC contemplates legal proceedings against Offshore Build Group LLC, DevPipe LLC, and any successor or affiliated entities, and against you personally as the operator of those entities. You are required to preserve all documents, electronic records, communications, billing records, timesheets, deliverables, payroll records, contractor agreements, and any other materials relating to the Example Booking Co. LLC engagement.'),
  body('This litigation hold expressly includes — but is not limited to — all records relating to:'),
  bullet('The 80-hours-per-month maintenance schedule represented in monthly invoices.'),
  bullet('All Stripe billing accounts associated with this engagement, including acct_REDACTED_A and acct_REDACTED_B.'),
  bullet('All contractor or employee timesheets for any individual who performed work on the Example Booking Co. application or marketing site.'),
  bullet('All internal communications (Slack, Discord, email, WhatsApp, or other) regarding Example Booking Co. LLC or its work.'),
  bullet('The complete git repository in its full unaltered form, including any branches and forks.'),
  h1('IV.  Next Steps'),
  body('Example Booking Co. LLC intends to issue a Formal Notice of Breach and Demand for Cure within the next seven (7) calendar days. The Demand will identify specific dollar amounts subject to clawback, cite specific breached contract terms and applicable U.S. statutory authority, and set a response deadline.'),
  body('In the interim, you are encouraged to:'),
  numb('Retain U.S. legal counsel. Notwithstanding your operating presence in Pakistan, both Offshore Build Group LLC and DevPipe LLC are U.S. legal entities (Delaware-registered, with the latter having a New Jersey address on recent invoices) and are subject to U.S. jurisdiction.'),
  numb('Preserve all evidence as identified in Section III above.'),
  numb('Cease all further billing to Example Booking Co. LLC. Any further charges to Example Booking Co. LLC payment methods will be disputed with the issuing institution as billing for services not rendered, with this letter and the underlying forensic packet provided as supporting documentation.'),
  numb('Direct any inquiries through counsel.'),
  body('If you wish to engage in good-faith pre-litigation resolution discussions, please direct your counsel to respond to this letter in writing within seven (7) calendar days from the date above.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Pre-Litigation Findings Notice (DevPipe/Offshore Build) — CONFIDENTIAL');

// =================================================================
// DOC 3: DEMAND LETTER — ADA
// =================================================================
const doc3 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND CERTIFIED MAIL — RETURN RECEIPT REQUESTED', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Robert J. Hartwell, Managing Director'),
  body('Acme Digital Agency, LLC'),
  body('Northstar Holdings Inc.'),
  body('[REDACTED AGENCY ADDRESS — Lakewood, OH]'),
  body('Via email: robert@acmedigitalagency.example; robert@ada.example; support@acmedigitalagency.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   FORMAL NOTICE OF MATERIAL BREACH AND DEMAND FOR CURE'),
  bodyBold('         Reference: Original Proposal Dated November 22, 2021'),
  spacer(240),
  body('Mr. Hartwell:'),
  spacer(80),
  body('This letter constitutes formal notice to Acme Digital Agency, LLC ("ADA") and Northstar Holdings Inc. (collectively, "You" or "Your Entities") that You are in material breach of multiple contractual obligations to Example Booking Co. LLC (the "Client"). It further constitutes a formal demand for cure, accompanied by a settlement offer designed to resolve this matter without litigation.'),
  body('This demand is supported by a comprehensive forensic investigation, the executive summary of which was provided to You under separate cover dated May 15, 2026. The full evidentiary record is preserved and will be produced in litigation if necessary.'),
  h1('I.  Material Breaches Identified'),
  h2('1. Billing for Services Not Rendered — Virtual Assistant'),
  body('For the period beginning January 1, 2024 and continuing through at least March 1, 2026, You billed the Client $1,100.00 per month for a service titled "Virtual Assistant — Part-Time." For multiple months in this period, no virtual assistant services were rendered. Billing for services not rendered constitutes fraud under Ohio law. This is a material breach of the implied covenant of good faith and fair dealing inherent in every commercial contract under Ohio law.'),
  h2('2. Apparent Double-Billing — Website Hosting'),
  body('You billed the Client $149.99 per month for "Summit Website Support and Hosting" of the examplebooking.example WordPress site. The Client\'s investigation establishes that during the entire billing period, the site was actually hosted on the Client\'s separately-paid GoHighLevel WordPress hosting account. You charged for hosting that another vendor was providing and that the Client was paying for independently. This is a material misrepresentation of the services delivered.'),
  h2('3. Failure to Perform Contracted Maintenance'),
  body('The "Support" component of the Summit Website Support and Hosting line item required, at minimum, the timely application of security updates and patches to the WordPress core, theme, and plugins. The WordPress audit log for examplebooking.example establishes that between December 16, 2025 and May 2, 2026 (138 days), no ADA employee performed a single security update on the site. The site remained exposed during this period to multiple publicly-disclosed critical vulnerabilities, including Post SMTP CVE-2025-11833 (CVSS 9.8, actively exploited in the wild from October 11, 2025 onward).'),
  h2('4. Breach of the November 22, 2021 Proposal'),
  body('The original signed proposal committed ADA to deliver a functional, secure scheduling application within 120 working days from acceptance and first payment. As of the date of this letter — over 1,640 calendar days after acceptance — the application remains:'),
  bullet('Functional in only 46% of promised features (13 of 28).'),
  bullet('Subject to 13 Critical and 30 High security vulnerabilities including an active web shell, public-read customer files, and an unauthenticated webhook permitting administrator account creation.'),
  bullet('Lacking the iOS and Android mobile applications expressly contracted in the original proposal.'),
  bullet('Lacking payment processing, invoicing, appointment reminders, and reporting — all features that a market-ready cleaning-services scheduling application requires.'),
  body('You subcontracted the build to Initial Build Vendor in 2021–2023, that engagement failed, You did not refund the Client, and You then directed the Client to engage Offshore Build Group LLC for a rebuild at additional cost. Notwithstanding these subcontracting arrangements, ADA remains the original contracting party under the November 22, 2021 proposal and is therefore liable to the Client for the resulting failure of consideration.'),
  h1('II.  Damages Demanded'),
  body('The Client demands restitution and damages in the following itemized amounts:'),
  mktable(
    ['Claim', 'Amount Demanded'],
    [
      ['Restitution of hosting overcharges (32 months × ($149.99 − $30 fair value))', '$3,840'],
      ['Restitution of Virtual Assistant charges for confirmed non-delivery months', '$11,000 minimum (10 months) to $27,500 maximum (all 25 months)'],
      ['Restitution of social media management overcharges (20 months × ($549.99 − $200 fair value))', '$7,000'],
      ['Damages for failure to deliver the originally-contracted scope (allocable portion attributable to ADA as original contracting party)', '$50,000'],
      [{ text: 'TOTAL DEMANDED — ADA', bold: true }, { text: '$71,840 minimum to $88,340 maximum', bold: true, color: COLORS.red }],
    ],
    [5500, 3500]
  ),
  spacer(160),
  body('This figure does not include punitive damages, attorney\'s fees, court costs, or any additional damages that may be available under the Ohio Consumer Sales Practices Act (Ohio Rev. Code § 1345.01 et seq.). The Client expressly reserves the right to pursue all such additional damages in litigation.'),
  body('You are further on notice that the limitation-of-liability clause in ADA\'s Terms of Service does not, under Ohio law, protect a party from claims of intentional fraud or gross negligence. The Client believes the factual record supports both characterizations.'),
  h1('III.  Cure Period'),
  body('The Client demands the following cure within fourteen (14) calendar days from the date this letter is received:'),
  numb('Acknowledgment in writing of receipt of this letter.'),
  numb('Payment of the minimum demand amount ($71,840) by wire transfer or certified check, OR a written, good-faith counter-proposal accompanied by supporting documentation that justifies any reduction.'),
  numb('Cessation of all further billing to the Client. Any subsequent invoices issued by ADA, Northstar Holdings, or any affiliated entity will be disputed with the issuing financial institution and may form additional grounds for damages.'),
  numb('Production of the records identified in the Notice of Litigation Hold previously served on You.'),
  body('If You fail to cure within this fourteen (14) day period, the Client will proceed without further notice to file a civil complaint in the Cuyahoga County Court of Common Pleas, naming as defendants Acme Digital Agency, LLC; Northstar Holdings Inc.; and Robert J. Hartwell individually where applicable.'),
  h1('IV.  Additional Notices'),
  h2('A. Litigation Hold'),
  body('The litigation-hold notice previously served on You remains in full force. All documents and records identified therein must be preserved. Destruction or alteration of any such records is sanctionable conduct that the Client will not hesitate to bring to the court\'s attention.'),
  h2('B. Communications'),
  body('All communications regarding this matter should be in writing and directed to the Client at the address above, or, once retained, to the Client\'s legal counsel. The Client is not interested in informal discussions, phone calls, or in-person meetings outside of a formal mediation or settlement framework.'),
  h2('C. Confidentiality'),
  body('This letter is intended for the named recipient(s) only. Any further pre-litigation communications regarding settlement will be conducted under the protections of Ohio Rule of Evidence 408. The Client reserves all rights to disclose the underlying facts as required in any judicial proceeding, regulatory inquiry, or response to lawful subpoena.'),
  h2('D. Chargebacks'),
  body('The Client notes that ADA\'s Terms of Service threaten a $50 fee and characterize chargebacks as "fraud." This language has no legal effect with respect to chargebacks initiated for billing of services not actually rendered. Federal and state consumer protection law expressly permits consumers and businesses to dispute charges through their card issuer when goods or services have not been provided as agreed. The Client will exercise this right with respect to any further charges from ADA.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Demand Letter (ADA) — CONFIDENTIAL');

// =================================================================
// DOC 4: DEMAND LETTER — OFFSHORE BUILD / DEVPIPE
// =================================================================
const doc4 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND INTERNATIONAL CERTIFIED MAIL', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Sameer Khan'),
  body('Offshore Build Group LLC / DevPipe LLC'),
  body('[REDACTED SUBCONTRACTOR ADDRESS — NJ]'),
  body('Via email: sameer@devpipe.example; contact@devpipe.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   FORMAL NOTICE OF MATERIAL BREACH AND DEMAND FOR CURE'),
  bodyBold('         Reference: Master Services Agreement Dated November 1, 2023'),
  spacer(240),
  body('Mr. Offshore Build:'),
  spacer(80),
  body('This letter constitutes formal notice that Offshore Build Group LLC and DevPipe LLC (collectively, "You" or "Your Entities") are in material breach of the Master Services Agreement dated November 1, 2023 and the implied warranty of merchantability under U.S. commercial law. It further constitutes a formal demand for cure, accompanied by a settlement offer designed to resolve this matter without litigation.'),
  body('This demand is supported by a comprehensive forensic investigation, the executive summary of which was provided to You under separate cover dated May 15, 2026. The full evidentiary record — including the complete git history of the simple-schedular-web repository that Your team produced and provided — is preserved and will be produced in litigation if necessary.'),
  h1('I.  Material Breaches Identified'),
  h2('1. Failure to Deliver Merchantable Software'),
  body('The Example Booking Co. application as delivered is not fit for its intended commercial purpose. The independent technical audit established an overall weighted quality score of 3.1 out of 10, with thirteen (13) Critical security vulnerabilities, six features that crash on every attempted use, and the complete absence of automated testing.'),
  body('Among the Critical security findings — any one of which alone would render the software unusable in a commercial context — are:'),
  bullet('An active django-webshell package installed in the production deployment, granting any Django administrator complete operating-system-level access to the production server. This is malware-equivalent and has no legitimate purpose in production software.'),
  bullet('All customer-uploaded files, customer profile images, and database backups configured with public-read ACL on Amazon S3, exposing customer personally identifiable information to anyone with the URL.'),
  bullet('The HighLevel OAuth2 client secret hardcoded directly into the source code, exposing the Client\'s CRM integration to any party with repository read access.'),
  bullet('An unauthenticated webhook endpoint at /api/v1/operations/webhook/company/ that allows any internet user to create administrator accounts with a hardcoded default password ("TempPass123@").'),
  bullet('A password-reset OTP function that never validates expiry, leaving any reset code valid indefinitely.'),
  body('These defects, individually and collectively, constitute gross negligence in software engineering. Delivery of code containing an active "backdoor" mechanism is not merely a quality failure — it is a breach of the most basic duty of care owed by a software developer to a client.'),
  h2('2. The Recurring-Appointment Time Bomb'),
  body('The `regenerate_appointments` Celery task contains a fatal logic error. Its date-guard condition triggers only when the next scheduled date exactly matches today\'s month and day. For weekly recurring appointments, this is satisfied at most once per year. The rolling two-year window of future appointments is therefore functionally never extended. Without notice or warning, recurring appointment series will vanish from the Client\'s calendar. This defect renders the core feature of the application unfit for its intended purpose.'),
  h2('3. Maintenance Billing Without Corresponding Effort'),
  body('Across the 26-month maintenance window from approximately March 2024 through April 2026, Your Entities billed the Client between $4,000 and $6,000 per month, representing 80 hours per month of maintenance work. The git commit history of the simple-schedular-web repository — a cryptographically-chained record that cannot be retroactively altered — establishes the following:'),
  bullet('Four (4) months had ZERO commits to the repository: February, June, July, and December 2025. The Client was billed approximately $16,000 across these four months despite no recorded engineering activity.'),
  bullet('An additional six (6) months had fewer than 10 hours of calibrated engineering effort, despite full 80-hour-month billings.'),
  bullet('Total delivered effort across the 26-month window: 574 senior-engineer hours.'),
  bullet('Total represented effort across the 26-month window: 2,080 hours (80 × 26).'),
  bullet('Unexplained gap: 1,506 hours, valued at $150,600 at the contracted $100/hour rate.'),
  body('This is not a minor accounting discrepancy. The gap between represented and delivered effort is 72% of the total billed. No reasonable interpretation of "maintenance" — including server administration, customer support, or meeting time — accounts for a gap of this magnitude.'),
  h2('4. Failure to Apply Routine Security Patches'),
  body('Across the entire 29-month commit history, not a single dependency-security patch has been applied to the application. The dependency lockfile still shows Django 3.2 (end-of-life April 2024), Pillow 9.0.1 (CVE-2023-50447 unpatched since January 2024), PyJWT 1.7.1 (CVE-2022-29217 unpatched since May 2022), and additional CVE-affected packages. A maintenance retainer that does not apply security patches is not a maintenance retainer.'),
  h1('II.  Damages Demanded'),
  body('The Client demands restitution and damages in the following itemized amounts:'),
  mktable(
    ['Claim', 'Amount Demanded'],
    [
      ['Maintenance overpayment (1,506 unaccounted hours × $100/hr)', '$150,600'],
      ['Software build clawback for delivery of unmerchantable product (allocable portion of build cost)', '$50,000 minimum'],
      ['Damages for negligent infliction of CVE exposure on the marketing website (where applicable to Your Entities through the maintenance retainer)', 'Reserved pending determination of scope'],
      [{ text: 'TOTAL DEMANDED — OFFSHORE BUILD / DEVPIPE', bold: true }, { text: '$200,600 minimum', bold: true, color: COLORS.red }],
    ],
    [5500, 3500]
  ),
  spacer(160),
  body('This figure does not include punitive damages, costs, fees, or any additional damages available under applicable statutory authority. The Client expressly reserves the right to pursue all such additional damages in litigation, including but not limited to claims for gross negligence which carry enhanced damages under Ohio and federal law.'),
  h1('III.  Cure Period'),
  body('The Client demands the following cure within twenty-one (21) calendar days from the date this letter is received:'),
  numb('Acknowledgment in writing of receipt of this letter.'),
  numb('Payment of the minimum demand amount ($200,600) by wire transfer, OR a written, good-faith counter-proposal accompanied by supporting documentation (including timesheets, deliverable records, and contractor invoices) that justifies any reduction.'),
  numb('Cessation of all further billing to the Client. The Client has already terminated the Master Services Agreement effective May 1, 2026 (see separate Notice of Termination).'),
  numb('Production of the records identified in the Notice of Litigation Hold previously served on You.'),
  body('If You fail to cure within this twenty-one (21) day period, the Client will proceed without further notice to file a civil complaint, naming as defendants Offshore Build Group LLC, DevPipe LLC, and You individually as the operator of those entities.'),
  h1('IV.  Personal Liability Notice'),
  body('Because Offshore Build Group LLC and DevPipe LLC are operating through Delaware and New Jersey registered entities while the actual labor was performed in Pakistan, and because the entities appear to have minimal U.S. assets, the Client may pursue veil-piercing arguments to reach You personally. Such arguments are particularly viable where the entities have been used to perpetuate fraud (including billing for services not rendered) or where the corporate form has been employed to conceal the offshore nature of the labor while charging premium U.S. rates. You are personally on notice that such claims may be brought.'),
  h1('V.  Additional Notices'),
  h2('A. Litigation Hold'),
  body('The litigation-hold notice previously served on You remains in full force. Particular emphasis is placed on preservation of: (a) the complete git repository in all branches and forks; (b) all Stripe billing records (accounts acct_REDACTED_A and acct_REDACTED_B); (c) all internal communications regarding the Example Booking Co. engagement; and (d) all timesheet, contractor, and payroll records for any individual who billed time on Example Booking Co. matters.'),
  h2('B. Communications'),
  body('All communications regarding this matter should be in writing and directed to the Client at the address above, or, once retained, to the Client\'s legal counsel.'),
  h2('C. International Service'),
  body('Notwithstanding the offshore operation of Your business, both Offshore Build Group LLC and DevPipe LLC are U.S.-registered entities subject to U.S. jurisdiction. The Client has identified the registered agents for both entities and will effect service in the United States. Reliance on international service-of-process delays as a defensive tactic is not anticipated to be a viable strategy.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Demand Letter (DevPipe/Offshore Build) — CONFIDENTIAL');

// =================================================================
// DOC 5: TERMINATION NOTICE — ADA
// =================================================================
const doc5 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND CERTIFIED MAIL — RETURN RECEIPT REQUESTED', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Robert J. Hartwell, Managing Director'),
  body('Acme Digital Agency, LLC'),
  body('Northstar Holdings Inc.'),
  body('[REDACTED AGENCY ADDRESS — Lakewood, OH]'),
  body('Via email: robert@acmedigitalagency.example; robert@ada.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   FORMAL NOTICE OF TERMINATION FOR CAUSE — Effective May 1, 2026'),
  bodyBold('         Reference: Original Proposal Dated November 22, 2021, and All Successor or Affiliated Agreements'),
  spacer(240),
  body('Mr. Hartwell:'),
  spacer(80),
  body('This letter constitutes formal written notice that Example Booking Co. LLC (the "Client") has terminated, effective May 1, 2026, all contractual relationships with Acme Digital Agency, LLC ("ADA"), Northstar Holdings Inc., and any and all affiliated entities (collectively, the "ADA Entities"). This termination is for cause, predicated on the material breaches identified in the Client\'s Forensic Findings Notice and Formal Demand for Cure, both previously served on You.'),
  h1('I.  Effective Date and Scope of Termination'),
  body('The effective termination date is May 1, 2026. This date precedes the issuance of this written notice because the Client\'s decision to terminate was communicated to ADA informally on or about that date through cessation of contact and discontinuation of further service usage. This letter formalizes that termination in writing.'),
  body('The termination applies to all services and agreements between the Client and the ADA Entities, including without limitation:'),
  bullet('The original proposal dated November 22, 2021 titled "Example Booking Co. — Scheduling Mobile App Creation & Web App Update" and any amendments, supplements, change orders, or successor agreements thereto.'),
  bullet('The recurring monthly service line items: "Summit Website Support and Hosting" ($149.99/month), "Virtual Assistant — Part-Time" ($1,100.00/month), "Social Media Management — Silver" ($549.99/month), "GSuite (legacy)" and "Google Workspace (legacy)" pass-through charges ($12.00/month), and any other recurring service whether or not explicitly enumerated.'),
  bullet('Any subcontracting arrangement under which the ADA Entities directed the Client to make payments to Offshore Build Group LLC, DevPipe LLC, or any other third party.'),
  h1('II.  Cause for Termination'),
  body('Termination is for cause based on material breaches established by the Client\'s forensic investigation, including without limitation:'),
  numb('Billing for services not rendered — specifically, the Virtual Assistant service line for periods during which no virtual assistant services were actually provided.'),
  numb('Apparent double-billing for website hosting that was actually provided by GoHighLevel and paid for separately by the Client.'),
  numb('Failure to perform contracted website maintenance, including the failure to apply security patches to known publicly-disclosed CVE-affected components for periods exceeding 365 days.'),
  numb('Failure to deliver the software product contracted under the November 22, 2021 proposal within the contractually-specified 120-working-day timeline, or at any time in the subsequent 1,640+ calendar days.'),
  numb('Delivery of social media management services at a quality level far below the industry-standard for the contracted price point, as documented in the ADA Entities\' own quarterly Account Reports.'),
  body('Each of the above constitutes a material breach independently sufficient to support termination for cause. Their accumulation over the course of the 53-month engagement establishes a pattern.'),
  h1('III.  Effect of Termination'),
  body('Effective May 1, 2026 and continuing thereafter:'),
  numb('All authorizations for the ADA Entities to charge any payment method belonging to the Client or Example Booking Co. LLC are revoked. Any charges submitted after May 1, 2026 are unauthorized and will be disputed with the issuing financial institution.'),
  numb('All authorizations for the ADA Entities to access, modify, or maintain any of the Client\'s digital properties — including the WordPress installation at examplebooking.example, any associated hosting accounts, any associated DNS records, any associated email accounts, any associated CRM accounts, and any associated cloud-storage accounts — are revoked.'),
  numb('The ADA Entities are directed to immediately remove all ADA personnel administrative access (including but not limited to access by Robert J. Hartwell, Diana Reeves, Greg Sutton, Helen Brooks, and any other ADA employee or contractor) from any system belonging to the Client. The Client has separately and concurrently changed administrative passwords on all systems known to have had ADA access, but the ADA Entities remain affirmatively obligated to cease all access immediately.'),
  numb('Any data, credentials, source code, documentation, or other materials belonging to or licensed to the Client and currently in the ADA Entities\' possession must be returned or destroyed (with written certification of destruction) within thirty (30) calendar days of the date of this letter.'),
  h1('IV.  ADA Terms of Service Notice-Period Provisions Are Inapplicable'),
  body('The Client is aware that ADA\'s Terms of Service contains a 30-day-notice provision for cancellation of subscription services. That provision is inapplicable to a termination for cause based on material breach and/or fraud. Under Ohio law (and the law of most jurisdictions), a notice-period requirement in a contract does not apply where the party invoking it is the breaching party and the breach itself constitutes the cause for termination. The Client expressly invokes termination for cause and is not bound by any notice-period requirement.'),
  body('To the extent ADA contends otherwise, the Client preserves all rights to challenge such contention in any subsequent proceeding.'),
  h1('V.  Continuing Obligations'),
  body('Notwithstanding the termination, the following obligations of the ADA Entities survive:'),
  bullet('All confidentiality obligations regarding the Client\'s business information.'),
  bullet('All record-preservation obligations under the previously-served litigation hold notice.'),
  bullet('All obligations to return or destroy Client materials as identified in Section III.'),
  bullet('All representations, warranties, and indemnification obligations under the original November 22, 2021 proposal.'),
  h1('VI.  Effect on Damages Claims'),
  body('This termination notice is without prejudice to any damages, restitution, or other claims that the Client has against the ADA Entities. Such claims are the subject of the separate Formal Demand for Cure and are expressly preserved by this termination notice.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Notice of Termination for Cause (ADA) — CONFIDENTIAL');

// =================================================================
// DOC 6: TERMINATION NOTICE — OFFSHORE BUILD / DEVPIPE
// =================================================================
const doc6 = buildDoc([
  ...senderBlock(),
  para('VIA EMAIL AND INTERNATIONAL CERTIFIED MAIL', { run: { size: 20, bold: true, color: COLORS.red }, spacing: { after: 240 } }),
  body('Mr. Sameer Khan'),
  body('Offshore Build Group LLC / DevPipe LLC'),
  body('[REDACTED SUBCONTRACTOR ADDRESS — NJ]'),
  body('Via email: sameer@devpipe.example; contact@devpipe.example'),
  spacer(240),
  para(DATE, { run: { size: 22 } }),
  spacer(200),
  bodyBold('Re:   FORMAL NOTICE OF TERMINATION FOR CAUSE — Effective May 1, 2026'),
  bodyBold('         Reference: Master Services Agreement Dated November 1, 2023, and All Successor or Affiliated Agreements'),
  spacer(240),
  body('Mr. Offshore Build:'),
  spacer(80),
  body('This letter constitutes formal written notice that Example Booking Co. LLC (the "Client") has terminated, effective May 1, 2026, all contractual relationships with Offshore Build Group LLC, DevPipe LLC, and any and all affiliated entities (collectively, the "DevPipe Entities"). This termination is for cause, predicated on the material breaches identified in the Client\'s Forensic Findings Notice and Formal Demand for Cure, both previously served on You.'),
  h1('I.  Effective Date and Scope of Termination'),
  body('The effective termination date is May 1, 2026. This date precedes the issuance of this written notice because the Client\'s decision to terminate was communicated to You informally on or about that date through cessation of contact and discontinuation of further service usage. This letter formalizes that termination in writing.'),
  body('The termination applies to all services and agreements between the Client and the DevPipe Entities, including without limitation:'),
  bullet('The Master Services Agreement dated November 1, 2023 ("OFFSHORE BUILD GROUP LLC Service Agreement") and any amendments, supplements, change orders, or successor agreements thereto.'),
  bullet('The recurring monthly "Platinum Maintenance" service originally invoiced at $6,000.00 per month and subsequently reduced to $4,000.00 per month.'),
  bullet('All discrete project work, bug-fix engagements, feature-build engagements, and ad-hoc invoices.'),
  bullet('Any successor agreement under which the DevPipe Entities purported to assume the contractual obligations originally held by Offshore Build Group LLC.'),
  h1('II.  Cause for Termination'),
  body('Termination is for cause based on material breaches established by the Client\'s forensic investigation, including without limitation:'),
  numb('Delivery of software that is not fit for its intended commercial purpose (overall quality score 3.1 out of 10), including thirteen (13) Critical security vulnerabilities, six features that crash on every attempted use, and a complete absence of automated testing.'),
  numb('Delivery of software containing an active production "web shell" (django-webshell) that constitutes a malware-equivalent security backdoor.'),
  numb('Delivery of software in which all customer-uploaded files and database backups are configured for public read access on Amazon S3.'),
  numb('Delivery of software with hardcoded credentials, including the HighLevel OAuth2 client secret.'),
  numb('Billing for 80 hours per month of maintenance work while delivering an average of approximately 22 hours per month of work as documented by the cryptographically-chained git history of the simple-schedular-web repository.'),
  numb('Billing for four full months (February, June, July, and December 2025) during which zero commits were made to the repository.'),
  numb('Failure to apply routine security patches to known CVE-affected dependencies (including Pillow CVE-2023-50447, PyJWT CVE-2022-29217, and the Django 3.2 framework itself) across the entire 26-month maintenance window.'),
  body('Each of the above constitutes a material breach independently sufficient to support termination for cause.'),
  h1('III.  Effect of Termination'),
  body('Effective May 1, 2026 and continuing thereafter:'),
  numb('All authorizations for the DevPipe Entities to charge any payment method belonging to the Client or Example Booking Co. LLC are revoked. Any charges submitted after May 1, 2026 are unauthorized and will be disputed with the issuing financial institution.'),
  numb('All authorizations for the DevPipe Entities to access, modify, or maintain any of the Client\'s digital properties — including the application servers, databases, source code repositories, cloud-storage accounts, third-party integrations (including HighLevel CRM), and any associated email accounts — are revoked.'),
  numb('The DevPipe Entities are directed to immediately remove all administrative access by DevPipe personnel from any system belonging to the Client. The Client has separately and concurrently rotated administrative credentials, but the DevPipe Entities remain affirmatively obligated to cease all access immediately.'),
  numb('Any source code, documentation, database backups, customer data, credentials, design files, or other materials belonging to or licensed to the Client and currently in the DevPipe Entities\' possession must be returned, in a usable form, within thirty (30) calendar days of the date of this letter. The DevPipe Entities are further obligated to certify in writing the destruction of any retained copies after such return.'),
  numb('The DevPipe Entities shall not solicit or contact any customer, employee, or business associate of the Client identified through the engagement, including without limitation any individual whose personal information was processed by the Example Booking Co. application.'),
  h1('IV.  Source Code Custody'),
  body('The Client owns, as work-for-hire under the Master Services Agreement, all source code produced for the Example Booking Co. application. The complete git repository must be transferred to the Client (or maintained accessible to the Client) without alteration. The Client has already preserved a complete zipped copy of the repository as of the termination date. Any subsequent alteration, deletion, or restriction of access to the repository will be treated as additional grounds for damages and as potential spoliation of evidence.'),
  h1('V.  Continuing Obligations'),
  body('Notwithstanding the termination, the following obligations of the DevPipe Entities survive:'),
  bullet('All confidentiality obligations regarding the Client\'s business information and customer data.'),
  bullet('All record-preservation obligations under the previously-served litigation hold notice.'),
  bullet('All obligations to return or destroy Client materials as identified in Sections III and IV.'),
  bullet('All representations, warranties, and indemnification obligations under the November 1, 2023 Master Services Agreement.'),
  bullet('All obligations under the data-protection provisions of applicable U.S. state law (including Maryland and Ohio law) regarding any personally identifiable information of the Client\'s customers that was processed during the engagement.'),
  h1('VI.  Effect on Damages Claims'),
  body('This termination notice is without prejudice to any damages, restitution, or other claims that the Client has against the DevPipe Entities or against You personally. Such claims are the subject of the separate Formal Demand for Cure and are expressly preserved by this termination notice.'),
  ...sigBlock(DATE),
  ...reserveRights(),
], 'Example Booking Co. LLC — Notice of Termination for Cause (DevPipe/Offshore Build) — CONFIDENTIAL');

// =================================================================
// COVER / INSTRUCTIONS DOCUMENT
// =================================================================
const cover = buildDoc([
  para('PRE-LITIGATION DOCUMENT PACKAGE', { run: { size: 36, bold: true, color: COLORS.primary }, alignment: AlignmentType.CENTER, spacing: { before: 800, after: 240 } }),
  para('Example Booking Co. LLC v. ADA / DevPipe', { run: { size: 26, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('Six-Document Pre-Litigation Pack', { run: { size: 22, italics: true }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  spacer(400),
  h1('IMPORTANT — Read Before Use'),
  body('This package contains six legal documents prepared in templated form for use by Example Booking Co. LLC. Two strongly-recommended best practices govern their use:'),
  numb('Review with retained counsel BEFORE sending. While the documents are drafted conservatively and within established U.S. legal norms, every demand letter benefits from review by counsel licensed in the relevant jurisdiction (Ohio for ADA matters; relevant venue for DevPipe matters). Counsel may wish to adjust dollar amounts, deadlines, or specific language based on factors not visible to a templated package.'),
  numb('Service via certified mail with return receipt (in addition to email) is strongly recommended. Demand letters served only by email are easier for defendants to claim non-receipt of. Certified mail creates a Postal Service-issued record of service.'),
  h1('Document Inventory and Recommended Sequence'),
  body('The six documents are intended to be served in the following sequence:'),
  mktable(
    ['#', 'Document', 'Recipient', 'When to Send'],
    [
      ['1', '01_Findings_Notice_ADA.docx/.pdf', 'ADA / Robert Hartwell', 'Day 0 — pre-demand notice. Establishes the evidentiary record and provides 7 days to retain counsel before formal demand.'],
      ['2', '02_Findings_Notice_DevPipe.docx/.pdf', 'DevPipe / Sameer Khan', 'Day 0 — same logic.'],
      ['3', '03_Demand_Letter_ADA.docx/.pdf', 'ADA / Robert Hartwell', 'Day 7 — formal Notice of Material Breach and Demand for Cure. 14-day cure period.'],
      ['4', '04_Demand_Letter_DevPipe.docx/.pdf', 'DevPipe / Sameer Khan', 'Day 7 — same logic. 21-day cure period (extra time for international response).'],
      ['5', '05_Termination_Notice_ADA.docx/.pdf', 'ADA / Robert Hartwell', 'Day 0 OR after demand expires — formalizes the May 1, 2026 termination in writing.'],
      ['6', '06_Termination_Notice_DevPipe.docx/.pdf', 'DevPipe / Sameer Khan', 'Day 0 OR after demand expires.'],
    ],
    [600, 4600, 2200, 1600]
  ),
  spacer(160),
  h1('Strategy Notes'),
  bullet('The Findings Notices (1 and 2) are pre-demand "shot across the bow" letters that establish a paper trail showing the defendants had notice of the evidence and an opportunity to engage in pre-litigation resolution. They strengthen any subsequent litigation by making it harder for defendants to claim surprise or unfairness.'),
  bullet('The Demand Letters (3 and 4) are the formal legal demands. They cite specific contract clauses, dollar amounts, and Ohio statutory authority. They set deadlines (14 days for ADA, 21 days for DevPipe). If not satisfied, the next step is filing a civil complaint.'),
  bullet('The Termination Notices (5 and 6) formalize the May 1, 2026 termination in writing. They can be sent concurrently with the Findings Notices, or with the Demand Letters, or separately. Sending them on Day 0 has the advantage of immediately revoking any further authorization to access the Client\'s systems.'),
  bullet('Why a 14-day vs 21-day deadline split: ADA is domestically located and able to retain counsel quickly. DevPipe operates from Pakistan and may require additional time to brief U.S. counsel. The longer DevPipe deadline preempts a "we didn\'t have time" defense.'),
  bullet('The "intimidating but legally safe" tone is achieved through: (a) precise legal terminology, (b) specific dollar amounts backed by the forensic record, (c) explicit citation of Ohio statutory authority, (d) explicit litigation-hold language, and (e) reservation of rights for further action. The package avoids: extra-legal threats, threats of public disclosure, threats of criminal prosecution, and any language that could be construed as extortion.'),
  h1('After Service'),
  bullet('Track receipts. Save the certified-mail return receipts. Save the email-delivery receipts. Document the date of receipt for each recipient.'),
  bullet('Do not engage in informal communication. If a defendant calls, emails, or attempts to set up a meeting outside of the formal channels, do not engage. Refer them to the formal written process described in the letters.'),
  bullet('Watch for evidence destruction. If any defendant takes down a website, deletes a social media account, alters a git repository, or otherwise removes evidence after receiving the litigation-hold notice, document it immediately. Spoliation of evidence is itself sanctionable.'),
  bullet('Block ongoing charges. Dispute any post-May-1-2026 charges with the issuing card or bank. Reference the Termination Notice as the basis.'),
  bullet('Engage counsel before the cure deadlines expire. Even if the demand letter is sent without counsel, counsel must be engaged before filing the subsequent complaint.'),
  h1('Recommended Counsel Profile'),
  bullet('Ohio commercial litigator (specifically Cuyahoga County experience preferred, since the existing Hartwell v. Whitfield case is there and ADA is registered there).'),
  bullet('Experience in software-development disputes, breach-of-contract cases, and Ohio Consumer Sales Practices Act claims.'),
  bullet('Available to take the case on contingency or hybrid contingency-plus-hourly, given the strength of the documentary record.'),
  bullet('Willingness to subpoena offshore Stripe records and pursue veil-piercing claims against the DevPipe/Offshore Build entities.'),
  spacer(400),
  hr(),
  para('Date of Package Preparation: ' + DATE, { run: { size: 22, italics: true, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER }),
], 'Pre-Litigation Document Package — Cover and Instructions');

// =================================================================
// WRITE ALL DOCS
// =================================================================
Promise.all([
  writeDoc(cover, '00_Cover_and_Instructions.docx'),
  writeDoc(doc1, '01_Findings_Notice_ADA.docx'),
  writeDoc(doc2, '02_Findings_Notice_DevPipe.docx'),
  writeDoc(doc3, '03_Demand_Letter_ADA.docx'),
  writeDoc(doc4, '04_Demand_Letter_DevPipe.docx'),
  writeDoc(doc5, '05_Termination_Notice_ADA.docx'),
  writeDoc(doc6, '06_Termination_Notice_DevPipe.docx'),
]).then(() => console.log('All 7 documents written'));
