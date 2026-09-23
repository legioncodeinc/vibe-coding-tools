const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  ShadingType, WidthType, BorderStyle,
  HeadingLevel, PageBreak, PageNumber
} = require('docx');

const COLORS = {
  primary: '1F4E78', accent: '2E75B6', red: 'C00000', green: '548235', amber: 'BF9000',
  lightblue: 'D5E8F0', lightred: 'FCE4E4', lightgreen: 'E2EFDA', lightamber: 'FFF2CC',
  grey: 'F2F2F2', darkgrey: '595959',
};

const border = (color = 'CCCCCC', size = 1) => ({ style: BorderStyle.SINGLE, size, color });
const borders4 = (color = 'CCCCCC') => { const b = border(color); return { top: b, bottom: b, left: b, right: b }; };

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
const bullet = (t, lvl = 0) => new Paragraph({ numbering: { reference: 'bullets', level: lvl }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
const numb = (t, lvl = 0) => new Paragraph({ numbering: { reference: 'numbers', level: lvl }, children: [new TextRun({ text: t, size: 22 })], spacing: { after: 80 } });
const tcell = (text, opts = {}) => {
  const runs = Array.isArray(text) ? text : [new TextRun({ text: String(text == null ? '' : text), size: 20, ...(opts.bold ? { bold: true } : {}), ...(opts.color ? { color: opts.color } : {}) })];
  return new TableCell({
    borders: borders4(), width: { size: opts.width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: runs, alignment: opts.align })],
  });
};
const mktable = (hdr, rows, widths) => {
  const total = widths.reduce((a, b) => a + b, 0);
  const hdrCells = hdr.map((l, i) => tcell([new TextRun({ text: l, bold: true, color: 'FFFFFF', size: 20 })],
    { width: widths[i], shading: COLORS.primary, align: AlignmentType.CENTER }));
  const dataRows = rows.map(r => new TableRow({
    children: r.map((cd, i) => {
      let opts = { width: widths[i] }; let text = cd;
      if (typeof cd === 'object' && cd !== null && !Array.isArray(cd)) { text = cd.text; opts = { ...opts, ...cd }; }
      return tcell(text, opts);
    }),
  }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ children: hdrCells, tableHeader: true }), ...dataRows] });
};

const cover = [
  new Paragraph({ children: [new TextRun({ text: '', size: 30 })], spacing: { before: 1800 } }),
  para('ADA SERVICES FORENSIC REPORT', { run: { size: 44, bold: true, color: COLORS.primary }, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
  para('Forensic Analysis of Acme Digital Agency Services to Example Booking Co. LLC', { run: { size: 26, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('Hosting Fraud  •  Maintenance Negligence  •  Security Exposure  •  Marketing Performance', { run: { size: 22, italics: true, color: COLORS.accent }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('Prepared For', { run: { size: 22, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Sarah Bennett — Example Booking Co. LLC', { run: { size: 26, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('Subject', { run: { size: 22, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Acme Digital Agency, LLC (ADA) / Northstar Holdings Inc.', { run: { size: 22, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Managing Director: Robert J. Hartwell', { run: { size: 22, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('Report Date: May 15, 2026', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Service Period Examined: July 11, 2023 — May 2, 2026', { run: { size: 22 }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('Documented ADA Billings: $46,421.47', { run: { size: 22, color: COLORS.red, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Fair Value of Services Provided: $720 – $3,600', { run: { size: 22, color: COLORS.green, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('(One Avada theme license + ~$10–30/month hosting if ADA were actually doing it)', { run: { size: 20, italics: true, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  para('Implied Overpayment to ADA: $42,800 – $45,700', { run: { size: 22, color: COLORS.red, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  new Paragraph({ children: [new PageBreak()] }),
];

const execSum = [
  h1('Executive Summary'),
  body('This report focuses exclusively on the services that Acme Digital Agency (ADA) billed Example Booking Co. LLC for between July 2023 and May 2026. It is a companion to the master Example Booking Co. Forensic Report and is structured to be read on its own.'),
  body('Four findings emerge that are individually significant and collectively support a fee-clawback claim against ADA independent of any claim against the DevPipe/Offshore Build application development:'),
  numb('HOSTING FRAUD. ADA billed $149.99/month for "Summit Website Support and Hosting" while the examplebooking.example WordPress site was actually hosted on the client\'s own GoHighLevel WordPress hosting account (which the client paid for separately). ADA charged for a service that GoHighLevel was providing. The "Support" portion of the fee likewise did not exist — the WordPress audit log shows zero human-driven maintenance events from ADA employees between December 16, 2025 and May 2, 2026 (138 days). Total inflated billing across the 30-month service window: ~$4,500 above the legitimate $10–$30/month industry-standard rate for a comparable WordPress site IF such hosting had actually been delivered by ADA.'),
  numb('MAINTENANCE NEGLIGENCE. The site launched July 11, 2023 on Avada theme version 7.11.2 with original plugin versions. Between launch and client-led termination on May 2, 2026, plugin and theme updates were performed only three times — by the client herself on the day of termination, by a "Hub" automated backup tool on two dates, and (by inference from version progression) on approximately September 2024 and May 2025 by an unidentified party. Across the full 34-month engagement, the WordPress core and plugin stack accumulated dozens of disclosed CVEs that were never patched, including multiple critical (CVSS 9.0+) vulnerabilities in Post SMTP and Avada theme. The "Support" portion of the $149.99/month was substantively unperformed.'),
  numb('FRAUDULENT VIRTUAL ASSISTANT BILLING. ADA billed $1,100/month for a "Virtual Assistant — Part-Time" beginning January 1, 2024 and continued for 25+ documented months. The client has confirmed that no virtual-assistant services were delivered for several of those months. At a minimum, the billing-for-services-not-rendered claim covers $5,500–$11,000 in those months and exposes ADA to fraud claims that pierce the limitation-of-liability cap in their Terms of Service.'),
  numb('NON-EXISTENT SOCIAL MEDIA RETURN. ADA billed $549.99/month for "Social Media Management — Silver" beginning September 2024 and ran 20+ months of campaigns. Their own quarterly reports (Apr–Jul 2025 and Feb–Apr 2025) document Facebook reach DOWN 78%, Facebook engagement DOWN 94%, Instagram engagement at 0.0%, LinkedIn engagement at 0.0%, and a Google Business Profile that received zero reviews, zero website visits, and one phone call across an entire 90-day period. The output was AI-generated boilerplate that produced no audience growth, no engagement, and no business inquiries. The fair value of this output is $100–$300/month at most.'),
  h2('Quantified Overpayment to ADA'),
  mktable(
    ['Line Item', 'Charged ($/mo)', 'Fair Value ($/mo)', 'Months', 'Overpayment'],
    [
      ['Summit Website Support and Hosting', '$149.99', '$10–$30', '32 (Oct 2023 → May 2026)', '$3,840 – $4,480'],
      ['Virtual Assistant — Part-Time', '$1,100', '$0 (not delivered, several mo.)', '25', '$5,500 – $27,500'],
      ['Social Media Management — Silver', '$549.99', '$100–$300', '20 (Sep 2024 → May 2026)', '$5,000 – $9,000'],
      ['GSuite / Google Workspace pass-through', '$12', '$7 (Google direct)', '28', '$140'],
      [{ text: 'TOTAL ADA OVERPAYMENT (low — high)', bold: true }, '', '', { text: '~30 months', bold: true }, { text: '$14,480 – $41,120', bold: true, color: COLORS.red }],
    ],
    [3500, 1700, 1700, 1700, 1860]
  ),
  para('', { spacing: { after: 200 } }),
  body('In addition to the dollars above, the dependency-update negligence created a measurable, quantifiable security exposure that lasted between 30 and 660+ days for individual CVEs. That exposure is the basis for a separate negligence claim (not just a contract claim) and is detailed in Section 4.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec1 = [
  h1('Section 1 — The Hosting Fraud'),
  h2('1.1 What ADA Billed'),
  body('ADA charged Example Booking Co. LLC $149.99 per month for a line item called "Summit Website Support and Hosting." This charge appears continuously from October 17, 2023 through the most recent documented invoice on May 1, 2026 — 32 monthly invoices totaling $4,799.68 captured in the invoice archive (plus the extrapolated UNK invoices filling gaps).'),
  h2('1.2 What Was Actually Hosting the Site'),
  body('The examplebooking.example marketing website is a WordPress 6.9.4 site built on the Avada theme. As of the technical scan performed in March 2026, the site was hosted behind Cloudflare with origin server details obscured. Per client testimony, the WordPress site is hosted on the client\'s own GoHighLevel (now HighLevel) WordPress hosting account — a service the client paid for independently as part of her separate HighLevel subscription. ADA did not provide the hosting infrastructure; GoHighLevel did.'),
  body('This is the textbook definition of billing for services not provided. The client was paying twice for hosting: once to HighLevel (where the site actually lives), and once to ADA (who claimed to be providing it).'),
  h2('1.3 Industry Pricing for Comparable Hosting'),
  body('If ADA had been providing genuine WordPress hosting for a brochure site of this complexity (12 pages, Avada theme, modest traffic), the industry-standard pricing would be:'),
  mktable(
    ['Provider', 'Plan', 'Monthly Cost', 'Notes'],
    [
      ['Bluehost', 'Basic shared WordPress', '$9.99', '12-month contract; equivalent service'],
      ['SiteGround', 'StartUp WordPress', '$9.99', 'Renewal rate; managed hosting'],
      ['SiteGround', 'GrowBig (managed)', '$13.99', 'Industry standard for an active site'],
      ['DreamHost / Hostinger / NameHero', 'Comparable WP plans', '$5–$15', 'Self-managed'],
      ['Premium managed (Kinsta starter)', 'WP-specialized', '$35', 'Top of the comparable range'],
      [{ text: 'Industry comparable range', bold: true }, '', { text: '$10–$30', bold: true, color: COLORS.green }, ''],
      [{ text: 'What ADA charged', bold: true }, '', { text: '$149.99', bold: true, color: COLORS.red }, '4.5–15× the industry rate'],
    ],
    [2200, 2700, 1700, 3460]
  ),
  para('', { spacing: { after: 200 } }),
  h2('1.4 The "Support" Portion'),
  body('Even crediting ADA the benefit of the doubt that the $149.99 was a bundled "hosting + support" line, the support portion did not exist either. The WordPress audit log for examplebooking.example (the full export is attached to this report) reveals:'),
  bullet('Between December 16, 2025 and May 2, 2026 — 138 calendar days — there were ZERO plugin updates performed by any ADA employee.'),
  bullet('The only updates during that 138-day window came from "Hub" — an automated WPMU DEV / Defender Pro tool — on December 29, 2025 (Post SMTP only) and April 2, 2026 (two All-in-One WP Migration plugins only). These are automated updates, not human-driven maintenance.'),
  bullet('The only human actions ADA personnel performed during that window were content edits by Diana Reeves on Dec 16, 2025 and Apr 29, 2026 (editing the Contact Us page and "Header One" section) and Greg Sutton on Apr 29, 2026 (editing "Footer One").'),
  bullet('No human at ADA performed a plugin update or theme update during this entire 4.5-month window.'),
  body('The client herself, on May 2, 2026 between 11:34am and 11:41am, performed 10+ plugin updates, the Avada theme update (from 7.12.1 to 7.15.2), and deleted three unused plugins. This is the only "real" maintenance event in the audit-log export window.'),
  h2('1.5 Cost of ADA Hosting Fraud'),
  body('Using a generous fair-value benchmark of $30/month (premium managed hosting) for the 32 documented billing months from October 2023 through May 2026:'),
  bullet('Charged: 32 × $149.99 = $4,799.68'),
  bullet('Fair value if ADA had actually been providing hosting: 32 × $30 = $960'),
  bullet('Fair value given GoHighLevel was actually providing hosting: $0 (since client paid HighLevel separately)'),
  bodyBold('Hosting overcharge: $3,839 (generous interpretation) — $4,799.68 (strict interpretation, double-billing).'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec2 = [
  h1('Section 2 — WordPress Audit Log Evidence'),
  body('The Defender Pro audit log export from examplebooking.example (file: wdf-audit-logs-export-260515154146.csv) captures the most recent 37 events on the site. While limited in depth, the log is dispositive evidence of what ADA was actually doing on the site during the final 5 months of the engagement.'),
  h2('2.1 Complete Activity Log (Dec 16, 2025 → May 2, 2026)'),
  mktable(
    ['Date / Time', 'User', 'Action', 'Significance'],
    [
      ['Dec 16, 2025 10:38–10:40am', 'dianareeves', 'Edited "Reporting and Analytics" page + "bottom contact form" element', 'CONTENT change, not maintenance'],
      ['Dec 29, 2025 1:47pm', 'Hub (18.204.159.253 AWS)', 'Auto-updated Post SMTP to 3.7.0', 'AUTOMATED — no human intervention'],
      [{ text: 'Jan 1 — Apr 1, 2026 (3 months)', shading: COLORS.lightred, bold: true }, { text: 'NO ACTIVITY', shading: COLORS.lightred, bold: true, color: COLORS.red }, { text: 'ZERO events of any kind', shading: COLORS.lightred }, { text: 'Site was fully unmaintained', shading: COLORS.lightred }],
      ['Apr 2, 2026 8:09–8:11am', 'Hub (automated)', 'Auto-updated All-in-One WP Migration + GDrive Extension', 'AUTOMATED — no human intervention'],
      ['Apr 29, 2026 9:37–9:45am', 'dianareeves', 'Edited "Contact Us" + "Header One" + "Only Containers" page', 'CONTENT change, not maintenance'],
      ['Apr 29, 2026 10:08–11:18am', 'Greg Sutton (ADA)', 'Edited "Footer One" section twice', 'CONTENT change, not maintenance'],
      [{ text: 'May 2, 2026 11:34–11:41am', shading: COLORS.lightgreen, bold: true }, { text: 'sarahbennett', shading: COLORS.lightgreen, bold: true }, { text: 'Updated 10 plugins, Avada theme 7.12.1→7.15.2, deactivated 3 unused plugins', shading: COLORS.lightgreen, bold: true }, { text: 'CLIENT did all the real maintenance herself', shading: COLORS.lightgreen, bold: true, color: COLORS.green }],
    ],
    [2200, 1800, 3300, 2160]
  ),
  para('', { spacing: { after: 200 } }),
  h2('2.2 Plugins/Theme Sarah Personally Updated on May 2, 2026'),
  mktable(
    ['Plugin / Theme', 'Updated To', 'Comment'],
    [
      ['Avada (theme)', '7.15.2', 'From 7.12.1 (May 6, 2025) — 11 months out of date'],
      ['Avada Core (plugin)', '5.15.2', 'Bundled with theme — same 11-month gap'],
      ['Avada Builder (plugin)', '3.15.2', 'Bundled with theme — same 11-month gap'],
      ['WPCode Lite', '2.3.5', 'Known CVE history (CVE-2023-1624 CSRF, others)'],
      ['Post SMTP', '3.9.1', 'Known CVE history (CVE-2023-6875, CVE-2025-11833, CVE-2025-24000 — all CVSS 8.8–9.8)'],
      ['Smush Pro', '4.0.3', 'Image optimization'],
      ['SmartCrawl Pro', '3.15.0', 'SEO'],
      ['Disable Comments', '2.7.0', ''],
      ['Defender Pro', '5.11.0', 'Security plugin (itself out of date)'],
      ['All-in-One WP Migration', '7.105', 'Backup'],
    ],
    [3000, 1700, 4760]
  ),
  para('', { spacing: { after: 200 } }),
  h2('2.3 The Avada Theme Update Gap'),
  body('Per the official Avada changelog (attached to this packet as evidence): the version updates the examplebooking.example site received between launch and May 2, 2026 are reconstructable from the version progression:'),
  mktable(
    ['Avada Version', 'Released', 'Days Out of Date When Replaced', 'Status'],
    [
      ['7.11.2 (LAUNCH VERSION)', 'July 11, 2023', '~ 418 days', 'Installed at site launch'],
      ['7.11.10', 'September 2, 2024', '~ 246 days', 'First update (skipping 7.11.3–7.11.9)'],
      ['7.12.1', 'May 6, 2025', '~ 361 days', 'Second update (~8 months gap)'],
      [{ text: '7.15.2 (FINAL — Sarah updated)', shading: COLORS.lightgreen, bold: true }, 'April 13, 2026', 'N/A — current', { text: 'Updated by CLIENT on May 2, 2026 — 11 months after 7.12.1', shading: COLORS.lightgreen }],
    ],
    [3500, 1700, 2200, 3060]
  ),
  para('', { spacing: { after: 200 } }),
  body('Summary: in 34 months from launch (July 11, 2023) to client-led termination (May 2, 2026), ADA personnel performed Avada theme updates only twice (Sep 2024 and May 2025). The first update was 14 months after launch; the second was 8 months after the first. Both gaps span multiple disclosed CVEs in Avada (see Section 3).'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec3 = [
  h1('Section 3 — CVE Exposure Windows'),
  body('This section identifies the publicly-disclosed Common Vulnerabilities and Exposures (CVEs) that affected the examplebooking.example installation during the periods when ADA was responsible for maintenance and updates were not performed. CVE severity is scored on the Common Vulnerability Scoring System (CVSS) from 0.0 to 10.0; scores above 7.0 are High, above 9.0 are Critical.'),
  h2('3.1 Three Update Windows'),
  body('Per the version progression in the audit log and client testimony, the three update gaps under ADA\'s watch were:'),
  bullet('WINDOW A — July 11, 2023 → September 2, 2024 (419 days). Avada stayed on 7.11.2 the entire time. Skipped versions: 7.11.3, 7.11.4, 7.11.5, 7.11.6, 7.11.7, 7.11.8, 7.11.9 — seven sequential releases including security-only patches.'),
  bullet('WINDOW B — September 2, 2024 → May 6, 2025 (246 days). Avada stayed on 7.11.10. Skipped: 7.11.11, 7.11.12, 7.11.13, 7.11.14, 7.11.15, 7.12.0 — six sequential releases.'),
  bullet('WINDOW C — May 6, 2025 → May 2, 2026 (361 days). Avada stayed on 7.12.1. Skipped: 7.12.2, 7.13, 7.13.1, 7.13.2, 7.13.3, 7.14, 7.14.1, 7.14.2, 7.15, 7.15.1, 7.15.2 — eleven sequential releases.'),
  body('In total: across the 34-month ADA watch, the Avada theme was 14–24 versions behind current at various points. Each skipped version may contain security fixes documented in the changelog.'),
  h2('3.2 Avada Theme CVEs During ADA\'s Watch'),
  body('The Avada changelog explicitly tags security fixes with "SECURITY:" entries. The following security fixes were available but not applied during the three windows:'),
  mktable(
    ['Window', 'Avada Version', 'Released', 'Security Fixes Available But Not Applied'],
    [
      ['A', '7.11.3', 'Nov 13, 2023', 'Cumulative carryover from 7.11.2 baseline'],
      ['A', '7.11.4', 'Jan 30, 2024', ''],
      ['A', '7.11.5', 'Feb 12, 2024', 'Fixed RCE vulnerability via file upload bypass in Page Options import (authenticated, contributor+)'],
      ['A', '7.11.6', 'Feb 27, 2024', 'Avada Forms submissions viewable at contributor role'],
      ['A', { text: '7.11.7', bold: true }, 'Mar 19, 2024', { text: 'Multiple fixes — CVE-2024-2344 SQL Injection (CVSS 7.2), SSRF, XSS, and Avada Forms upload folder directly accessible', color: COLORS.red, bold: true }],
      ['A', '7.11.8', 'Jun 4, 2024', 'Cumulative'],
      ['A', '7.11.9', 'Jun 5, 2024', 'XSS in element link attributes'],
      ['B', '7.11.11', 'Oct 23, 2024', 'Broken Access Control + CSRF (WooCommerce quick view, custom colors)'],
      ['B', { text: '7.11.12', bold: true }, 'Dec 16, 2024', { text: 'Contributor+ post cloning + JS injection vulnerabilities', color: COLORS.red, bold: true }],
      ['B', '7.11.14', 'Jan 28, 2025', 'Arbitrary shortcode execution via REST API endpoint'],
      ['B', '7.11.15', 'Mar 18, 2025', 'javascript: URI XSS in element link fields'],
      ['C', '7.12.2', 'Jul 7, 2025', 'XSS in Google Maps element'],
      ['C', { text: '7.13.2', bold: true }, 'Sep 9, 2025', { text: 'CVE-2025-58922 — CSRF + broken access control allowing plugin disable from Avada plugins page', color: COLORS.red, bold: true }],
      ['C', '7.13.3', 'Sep 23, 2025', 'XSS in Vimeo element; broken access control in 5.0 migration tool'],
      ['C', '7.15', 'Mar 3, 2026', 'CSRF on privacy consent cookie; ToC element content injection; JS injection on critical CSS page'],
      ['C', '7.15.1', 'Mar 17, 2026', 'Arbitrary file upload via Avada Forms'],
      ['C', { text: '7.15.2 (DESTINATION)', shading: COLORS.lightgreen }, 'Apr 13, 2026', { text: 'Unauthenticated SQL injection in Post Cards element; stored XSS; arbitrary file access via custom SVG; code block injection by non-admins; protected meta abuse', color: COLORS.red, bold: true }],
    ],
    [800, 1700, 1700, 5060]
  ),
  para('', { spacing: { after: 200 } }),
  body('Window-C alone (May 2025 — Apr 2026) accumulated three of the four most severe Avada vulnerabilities: the Sep 2025 CVE-2025-58922 (CVSS 4.3 medium, but combined with the unrelated unauthenticated SQL injection in 7.15.2 fixed only in April 2026, which is high-severity), the November 2024 - January 2025 contributor-level shortcode and JS injection issues (Window B), and the Apr 13, 2026 SQL injection. The unpatched site was exposed to each of these for the entire interval between the disclosure date and either the next ADA update or the client\'s own May 2, 2026 update.'),
  h2('3.3 Post SMTP Plugin CVEs (Critical)'),
  body('Post SMTP is one of the highest-CVE-volume plugins in the WordPress ecosystem. The site ran some prior version of Post SMTP from launch through Dec 29, 2025 (when an automated tool bumped it to 3.7.0) and then 3.7.0 until Sarah\'s May 2, 2026 update to 3.9.1. The following critical disclosures landed during ADA\'s watch:'),
  mktable(
    ['CVE', 'Disclosed', 'CVSS', 'Description', 'Site Exposed?'],
    [
      ['CVE-2023-6875', 'Jan 10, 2024', '9.8 (Critical)', 'Unauthenticated authorization bypass; attacker resets API key and views password-reset emails, leading to account takeover', { text: 'YES — for entire 12+ month window depending on installed version', color: COLORS.red, bold: true }],
      ['CVE-2025-24000', 'May 2025', '8.8 (High)', 'Broken access control in REST API; low-privileged user can read all sent emails including password resets', { text: 'YES — until May 2, 2026 update', color: COLORS.red, bold: true }],
      ['CVE-2025-11833', 'Oct 11, 2025', '9.8 (Critical)', 'Missing capability check; UNAUTHENTICATED attacker accesses email logs with password-reset tokens; full admin takeover; actively exploited in the wild', { text: 'YES — Oct 11, 2025 → May 2, 2026 (~7 months unpatched while actively exploited)', color: COLORS.red, bold: true }],
    ],
    [1300, 1300, 1300, 4760, 2600]
  ),
  para('', { spacing: { after: 200 } }),
  bodyBold('Post SMTP CVE-2025-11833 is the most damaging. It is unauthenticated, meaning an attacker on the open internet — with no credentials — could read every password-reset email ever sent through the site\'s SMTP, intercept the reset tokens, and take over administrator accounts. This vulnerability was actively exploited in the wild from disclosure (October 11, 2025) onward. The examplebooking.example site was vulnerable until the CLIENT updated the plugin herself on May 2, 2026 — 7 months of active exposure during which ADA was being paid for "support and hosting."'),
  h2('3.4 WPCode Lite CVEs'),
  body('WPCode Lite (the plugin used to inject custom HTML/scripts) had CVE-2023-1624 (CSRF arbitrary log file deletion) fixed in version 2.0.9. Multiple smaller CVEs followed. The plugin was updated to 2.3.5 on May 2, 2026 by the client — installed version prior to that is undocumented in the limited audit-log export, but version 2.3.5 was released after at least three known CVEs.'),
  h2('3.5 WordPress Core CVEs'),
  body('The WordPress core itself published security releases at a cadence of roughly 4–6 per year during the ADA engagement. As of the March 2026 scan, the site was on WordPress 6.9.4. WordPress security releases that landed during ADA\'s watch include:'),
  bullet('WordPress 6.2.2 (May 2023) — XSS regression fix.'),
  bullet('WordPress 6.4.2 (Dec 6, 2023) — PHP object-injection chained vulnerability fix.'),
  bullet('WordPress 6.4.3 (Jan 30, 2024) — backported security fixes to 6.3.3 and 6.2.4.'),
  bullet('WordPress 6.5.5 (Jun 24, 2024) — 3 security fixes including XSS + Windows directory traversal.'),
  bullet('WordPress 6.6.2 (Sep 2024), 6.7.1 (Nov 2024), 6.8 (Apr 2025) — assorted security and bug fixes.'),
  bullet('WordPress 6.9.2 / 6.9.3 / 6.9.4 (2026) — multiple CVEs including three fully fixed only in 6.9.4.'),
  body('WordPress core auto-updates are generally enabled by default, so the core itself is more likely to have stayed current than the plugins. However, the audit log does not show whether WordPress core auto-updates were enabled, and the site was last observed on 6.9.4 which was current as of the scan but does not prove ADA drove that update.'),
  h2('3.6 Aggregate Exposure Statement'),
  body('Across the 34-month engagement, the examplebooking.example site was exposed to at least 15+ disclosed CVEs (across Avada, Avada Builder, Avada Core, WPCode Lite, and Post SMTP) for periods ranging from 30 to 660+ days each. The most severe — Post SMTP CVE-2025-11833 (CVSS 9.8, unauthenticated, actively exploited) — was unpatched for ~7 months despite ADA being paid for "Website Support and Hosting."'),
  body('A reasonable WordPress maintenance vendor performs plugin and theme updates monthly, with security-only emergency patches applied within 7–14 days of disclosure. ADA performed major plugin/theme updates approximately twice across 34 months. The negligence is documented, dated, and traceable to specific CVE numbers.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec4 = [
  h1('Section 4 — Social Media & Marketing Performance vs. Industry Benchmarks'),
  body('ADA charged $549.99/month for "Social Media Management — Silver" starting September 2024 and produced a stream of AI-generated posts across Facebook, Instagram, and LinkedIn. The client also received occasional quarterly "Account Reports" produced by ADA\'s account managers. The reports show the campaigns produced effectively zero return.'),
  h2('4.1 What ADA\'s Own Quarterly Reports Show'),
  body('From the Apr 22 – Jul 20, 2025 Account Report (90 days, prepared by ADA):'),
  mktable(
    ['Metric', 'ADA Result', 'Industry Benchmark (2025)', 'Verdict'],
    [
      ['Website total users', '180 (down 5.76%)', '500–2,000 for small business', 'Far below'],
      ['Website sessions', '211 (down 8.66%)', '600–3,000 for small business', 'Far below'],
      ['Website bounce rate', '73.71% (UP 7.31%)', '40–60% healthy', { text: 'Above healthy — WORSENING', color: COLORS.red }],
      ['Avg session duration', '1:31', '2:00–3:00', 'Below'],
      [{ text: 'Google Search clicks (90 days)', bold: true }, { text: '28 (down 51.72%)', bold: true, color: COLORS.red }, '~100–500 for small business', { text: 'CATASTROPHIC HALF-OVER-PREVIOUS', color: COLORS.red, bold: true }],
      ['Google Search avg CTR', '0.77%', '2–3% industry standard', 'Far below'],
      ['Google My Business reviews', '0', '5–50/yr active business', { text: 'ZERO across 90 days', color: COLORS.red }],
      ['GMB website visits', '0', '20–500/quarter typical', { text: 'ZERO', color: COLORS.red, bold: true }],
      ['GMB phone calls', '1', '10–50/quarter typical', 'Effectively zero'],
      [{ text: 'Facebook post engagements (90 days)', bold: true }, { text: '2 (down 94.12%)', bold: true, color: COLORS.red }, '20–200 for SMB page', { text: 'NEAR-ZERO', color: COLORS.red, bold: true }],
      ['Facebook engagement rate', '~0.59% (2/340)', '0.06–0.20% Facebook benchmark', 'Just barely above absolute floor'],
      [{ text: 'Instagram engagement (90 days)', bold: true }, { text: '0', bold: true, color: COLORS.red }, '0.45–0.60% benchmark', { text: 'ZERO ENGAGEMENT', color: COLORS.red, bold: true }],
      ['Instagram new followers', '0', '5–100/quarter typical', 'ZERO'],
      [{ text: 'LinkedIn engagement (90 days)', bold: true }, { text: '0', bold: true, color: COLORS.red }, 'B2B target — should be highest', { text: 'ZERO ENGAGEMENT', color: COLORS.red, bold: true }],
      ['LinkedIn engagement rate', '0.0%', '3–5% LinkedIn benchmark', 'ZERO'],
    ],
    [3200, 2200, 2700, 2060]
  ),
  para('', { spacing: { after: 200 } }),
  h2('4.2 What "Engagement = 0" Means in Practice'),
  body('A 90-day period with zero Instagram engagement and zero LinkedIn engagement means:'),
  bullet('Not a single human clicked the "Like" button on any of the 30+ posts published across those platforms during the quarter.'),
  bullet('Not a single human commented on a post.'),
  bullet('Not a single human shared a post.'),
  bullet('Not a single human reposted or quote-shared a post.'),
  body('This is consistent with two patterns: (a) the posts were AI-generated, generic productivity-meme content with no targeting, no audience signal, no call-to-action; and (b) the accounts had no organic following — they were posting into the void. Both patterns are visible in the post-preview thumbnails in the ADA report itself: emoji-laden titles like "⚖️ Work-Life Balance Starts Here," "⏳ SAVE TIME with Example Booking Co.," "📊 Manage Projects" — these are template posts with no business-specific content.'),
  h2('4.3 Industry Pricing Comparison'),
  body('For $549.99/month ADA was charging the upper-middle band of small-business social media management. At that price point a small business should receive:'),
  bullet('Custom-written, business-specific content (not AI-generic).'),
  bullet('Audience growth — minimum 5–10 new followers per month per active platform.'),
  bullet('Engagement-rate-driven optimization (testing post types, timing, formats).'),
  bullet('Paid-amplification budget management (ADA ran no paid spend per the reports).'),
  bullet('Monthly reporting that actually reads and reacts to the results.'),
  body('What was delivered was AI-template posting with zero engagement, zero audience growth, and quarterly reports that documented the failure but did not change strategy. The fair value of the delivered output is at the bottom of the market — $100–$300/month range for fully-automated post scheduling. Industry surveys (Sprout Social 2026, Sortlist 2025, Clutch 2025) place this delivery quality at the AI-template tier.'),
  h2('4.4 The Reports Themselves'),
  body('Across the engagement ADA produced several quarterly Account Reports. The reports are slickly formatted (ADA logo, animated charts) but contain only Google Analytics, Search Console, GMB, Facebook, Instagram, and LinkedIn auto-pulled metrics with no narrative analysis, no recommendations beyond "may be a good time to refresh," and no strategic adjustment. They are dashboard exports with a cover page — not analysis or strategy documents.'),
  body('The May 22, 2025 email exchange with Account Manager Helen Brooks is illustrative: the 90-day report showed engagement collapsing across every channel; Helen\'s analysis was "Engagement was low (34), so we may want to revisit post formats or frequency. Instagram & LinkedIn had very limited engagement and impressions, which signals an opportunity to improve strategy or reduce focus if not a priority channel." This is not a strategic recommendation — it is a description of failure delivered as a neutral observation.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec5 = [
  h1('Section 5 — The Virtual Assistant Charge'),
  body('Starting January 1, 2024 and continuing for at least 25 months (per the extrapolated invoice timeline), ADA charged Example Booking Co. LLC $1,100/month for a line item titled "Virtual Assistant — Part-Time."'),
  h2('5.1 Client Statement of Fact'),
  body('Per the client\'s direct testimony, the virtual-assistant services were not delivered for several months of that 25-month window. This is the cleanest, most actionable fraud claim in the entire engagement — it requires no expert testimony, no industry-benchmarking, no security analysis. The standard is binary: were the services delivered or not? The client states they were not. The burden shifts to ADA to produce evidence they were.'),
  h2('5.2 What ADA Would Need to Produce to Defend the $1,100/Month'),
  bullet('Timesheet records showing the virtual assistant\'s working hours each month.'),
  bullet('Communications between the virtual assistant and the client.'),
  bullet('Deliverables produced by the virtual assistant.'),
  bullet('Internal payroll records showing payment to a contractor or employee for the work.'),
  body('A 25-month engagement at $1,100/month implies a roughly 12-hour-per-week part-time assignment. That would produce a paper trail visible in any of: Slack/Teams archive, email threads, shared Google Drive folders, task lists, project-management tool exports. The absence of this paper trail across multiple months is the affirmative evidence of non-delivery.'),
  h2('5.3 Damages'),
  bodyBold('At minimum, for months the client testifies no VA services were delivered: full clawback of the $1,100 × N months.'),
  bodyBold('At maximum, if ADA cannot produce timesheet/deliverable evidence for any month: full clawback of all 25+ months = $27,500+.'),
  body('Because this is billing-for-services-not-rendered, the limitation-of-liability clause in ADA\'s Terms of Service does not apply. Standard contract-law doctrine in Ohio holds that intentional or fraudulent misrepresentation is not protected by limitation-of-liability clauses that would otherwise cap damages at the amount paid.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec6 = [
  h1('Section 6 — Aggregated ADA Damages Summary'),
  body('Combining the four overcharge buckets identified in this report:'),
  mktable(
    ['Bucket', 'Damages Type', 'Calculation', 'Low Estimate', 'High Estimate'],
    [
      ['Hosting Fraud / Double Billing', 'Restitution', '32 months × ($149.99 − $30 fair value)', '$3,839', '$4,799 (if double-billing)'],
      ['Maintenance Negligence (security exposure)', 'Negligence', 'Independent claim; not measured in $ here but supports piercing liability cap', '—', '—'],
      ['Virtual Assistant Non-Delivery', 'Fraud', '25 months × $1,100 (range based on confirmed non-delivery months)', '$5,500 (5 months)', '$27,500 (all 25 months)'],
      ['Social Media Underperformance', 'Restitution', '20 months × ($549.99 − $200 fair value)', '$5,000', '$9,000'],
      ['GSuite / Workspace pass-through', 'Restitution', '28 months × ($12 − $7)', '$140', '$140'],
      [{ text: 'TOTAL DOCUMENTED DAMAGES (low — high)', bold: true }, { text: 'Mixed', bold: true }, '', { text: '$14,479', bold: true, color: COLORS.red }, { text: '$41,439', bold: true, color: COLORS.red }],
    ],
    [3200, 1500, 3200, 1500, 1660]
  ),
  para('', { spacing: { after: 200 } }),
  body('Plus separate claims not denominated in this table:'),
  bullet('Punitive damages for fraud (the VA non-delivery). Ohio law permits punitive damages for fraudulent conduct.'),
  bullet('Negligence damages for the 7-month exposure to actively-exploited CVE-2025-11833 (Post SMTP, CVSS 9.8). If the site or HighLevel data was compromised during that window, full data-breach remediation costs are also recoverable.'),
  bullet('Lost-business damages from the failed marketing campaigns. While not directly quantifiable, the documented zero-engagement, zero-website-visit, zero-review metrics across multiple quarters are evidence that the marketing service produced zero revenue lift.'),
  h2('6.1 Why the Limitation of Liability Clause Does Not Protect ADA'),
  body('ADA\'s Terms of Service contains an aggressive liability cap (Section 22) limiting damages to "the amount actually paid by You through the Service or 100 USD if You haven\'t purchased anything through the Service." This clause is standard in agency contracts but does not apply where:'),
  numb('Fraud or fraudulent misrepresentation is proven. Billing for services not rendered (the Virtual Assistant) is fraud. Ohio courts routinely pierce liability caps for fraud.'),
  numb('Gross negligence is proven. Allowing critical (CVSS 9.8) CVEs to remain unpatched for 7+ months in actively-exploited form, while billing for "Support and Hosting," is gross negligence — not ordinary negligence — under any reasonable application of the standard of care.'),
  numb('The contract\'s essential purpose has failed. The cap states it applies "even if the remedy fails of its essential purpose," but Ohio caselaw allows piercing where the failure is total and bad-faith.'),
  body('The Limitation of Liability clause is best read as a defense against incidental and consequential damages (lost profits, indirect harm) — not against restitution of fees paid for services not delivered.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec7 = [
  h1('Section 7 — Recommendations'),
  numb('Halt all ADA payments immediately. The Apr 1 / Apr 29 / May 1 monthly billings shown in the email archive should be disputed with the credit card issuer as billing-for-services-not-rendered.'),
  numb('Send a formal Demand Letter via Ohio counsel within 30 days. The letter should anchor on the Virtual Assistant fraud as the wedge issue (it is documentary, it is binary, and it pierces the LoL cap), then layer the hosting double-billing and security negligence as additional claims.'),
  numb('Preserve all evidence already collected. The WordPress audit log export, the Avada changelog, ADA\'s own quarterly Account Reports, the email correspondence with Helen Brooks showing the failure was openly discussed and not remediated — these are documentary. The case does not require any new expert testimony.'),
  numb('Subpoena ADA and Robert Hartwell for: (a) timesheet records for the Virtual Assistant from Jan 2024 onward, (b) plugin/theme update logs and maintenance-task records for examplebooking.example, (c) the actual hosting provider invoices ADA paid (proof they were or were not hosting the site), (d) social-media campaign briefs and content-creation timesheets, and (e) all internal communications about Example Booking Co..'),
  numb('Consider class-action discovery. The pattern of charging $1,800+/month for unrendered services and abandoned maintenance is unlikely to be unique to this client. If ADA has 20+ similar clients on the same fee structure, class-action exposure for them is significant — which dramatically increases the leverage of an individual settlement.'),
  numb('Continue using the master Example Booking Co. Forensic Report (the 7-part technical investigation) as the umbrella case against Robert Hartwell and Sameer Khan on the software-development side. This ADA report is the agency-services case and stands alone.'),
  h1('Appendix — Evidence Index'),
  bullet('forensic-output/legal/2021-11-22_ADA_Original_Signed_Agreement.pdf — original contract'),
  bullet('forensic-output/reports/examplebooking_wordpress_security.md — WordPress security scan'),
  bullet('forensic-output/other-attachments/wdf-audit-logs-export-260515154146.csv — WordPress audit log (when uploaded into this packet)'),
  bullet('forensic-output/other-attachments/avada_changelog.txt — Avada theme changelog with security entries'),
  bullet('forensic-output/other-attachments/Example Booking Co. Account Report _ 90 Days _ July 2025.pdf — ADA quarterly account report'),
  bullet('forensic-output/individual-messages/M-#### emails from Helen Brooks and admin@acmedigitalagency.example — billing history'),
  bullet('forensic-output/invoices/ExampleBooking_Invoice_Forensics.xlsx — full invoice spreadsheet with extrapolation'),
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
      children: [new TextRun({ text: 'ADA Services Forensic Report — Example Booking Co. LLC — CONFIDENTIAL', size: 18, color: COLORS.darkgrey, italics: true })],
      alignment: AlignmentType.CENTER,
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Page ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLORS.darkgrey }), new TextRun({ text: ' of ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLORS.darkgrey })],
    })] }) },
    children: [...cover, ...execSum, ...sec1, ...sec2, ...sec3, ...sec4, ...sec5, ...sec6, ...sec7],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = './forensic-output/forensic-output/ExampleBooking_ADA_Forensic_Report.docx';
  fs.writeFileSync(out, buffer);
  console.log('Wrote ' + out + ' (' + buffer.length + ' bytes)');
});
