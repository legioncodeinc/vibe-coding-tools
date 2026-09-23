const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, AlignmentType, LevelFormat, ShadingType, WidthType, BorderStyle, HeadingLevel, PageBreak, PageNumber } = require('docx');

const COLORS = { primary: '1F4E78', accent: '2E75B6', red: 'C00000', green: '548235', amber: 'BF9000', lightblue: 'D5E8F0', lightred: 'FCE4E4', lightgreen: 'E2EFDA', lightamber: 'FFF2CC', grey: 'F2F2F2', darkgrey: '595959' };

const border = (c='CCCCCC') => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const borders4 = (c='CCCCCC') => { const b=border(c); return { top: b, bottom: b, left: b, right: b }; };

const para = (text, opts = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [new TextRun({ text: text || '', ...(opts.run || {}) })],
  spacing: opts.spacing || { after: 160 }, alignment: opts.alignment, heading: opts.heading,
  ...(opts.numbering ? { numbering: opts.numbering } : {}),
  ...(opts.pageBreakBefore ? { pageBreakBefore: true } : {}),
});
const h1 = (t) => para(t, { heading: HeadingLevel.HEADING_1, run: { size: 36, bold: true, color: COLORS.primary }, spacing: { before: 400, after: 200 } });
const h2 = (t) => para(t, { heading: HeadingLevel.HEADING_2, run: { size: 30, bold: true, color: COLORS.primary }, spacing: { before: 300, after: 160 } });
const h3 = (t) => para(t, { heading: HeadingLevel.HEADING_3, run: { size: 26, bold: true, color: COLORS.accent }, spacing: { before: 240, after: 140 } });
const body = (t) => para(t, { run: { size: 24 } });
const bodyBold = (t) => para(t, { run: { size: 24, bold: true } });
const callout = (t, color = COLORS.lightblue) => new Paragraph({
  children: [new TextRun({ text: t, size: 24, italics: true })],
  spacing: { before: 120, after: 160 },
  shading: { fill: color, type: ShadingType.CLEAR },
  border: { top: border(COLORS.accent), bottom: border(COLORS.accent), left: border(COLORS.accent), right: border(COLORS.accent) },
});
const analogyBox = (heading, body_text) => new Paragraph({
  children: [
    new TextRun({ text: `${heading}\n`, size: 24, bold: true, color: COLORS.amber }),
    new TextRun({ text: body_text, size: 24 }),
  ],
  spacing: { before: 120, after: 160 },
  shading: { fill: COLORS.lightamber, type: ShadingType.CLEAR },
});
const bullet = (t, l=0) => new Paragraph({ numbering: { reference: 'bullets', level: l }, children: [new TextRun({ text: t, size: 24 })], spacing: { after: 100 } });
const numb = (t, l=0) => new Paragraph({ numbering: { reference: 'numbers', level: l }, children: [new TextRun({ text: t, size: 24 })], spacing: { after: 100 } });
const tcell = (text, opts={}) => {
  const runs = Array.isArray(text) ? text : [new TextRun({ text: String(text==null?'':text), size: 22, ...(opts.bold?{bold:true}:{}), ...(opts.color?{color:opts.color}:{}) })];
  return new TableCell({ borders: borders4(), width: { size: opts.width, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined, children: [new Paragraph({ children: runs, alignment: opts.align })] });
};
const mktable = (hdr, rows, widths) => {
  const total = widths.reduce((a,b)=>a+b,0);
  const hdrCells = hdr.map((l, i) => tcell([new TextRun({ text: l, bold: true, color: 'FFFFFF', size: 22 })], { width: widths[i], shading: COLORS.primary, align: AlignmentType.CENTER }));
  const dataRows = rows.map(r => new TableRow({ children: r.map((cd, i) => { let opts={width:widths[i]}; let text=cd; if (typeof cd === 'object' && cd !== null && !Array.isArray(cd)) { text=cd.text; opts={...opts, ...cd}; } return tcell(text, opts); }) }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ children: hdrCells, tableHeader: true }), ...dataRows] });
};

const cover = [
  new Paragraph({ children: [new TextRun({ text: '', size: 30 })], spacing: { before: 1800 } }),
  para('WHAT HAPPENED WITH YOUR APP', { run: { size: 48, bold: true, color: COLORS.primary }, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
  para('A Plain-English Explanation of the Example Booking Co. Investigation', { run: { size: 28, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('Prepared for:', { run: { size: 24, color: COLORS.darkgrey }, alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
  para('Sarah Bennett', { run: { size: 30, bold: true }, alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  para('This is the same story as the big technical reports — but written so you can read it without needing a computer background. We use everyday comparisons (like a contractor building your house) to explain what happened. Anywhere there is a hard word, we explain it.', { run: { size: 24, italics: true }, alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  para('Date: May 15, 2026', { run: { size: 22 }, alignment: AlignmentType.CENTER }),
  new Paragraph({ children: [new PageBreak()] }),
];

const intro = [
  h1('The Short Version'),
  body('You hired a company called Acme Digital Agency (ADA) in November 2021 to build you a scheduling app for your cleaning business. The original price was $32,329 and they promised to finish in about six months.'),
  body('What actually happened over the next four and a half years:'),
  bullet('They did not build the app themselves. They hired a different company called Initial Build Vendor. That company made an app that didn\'t work.'),
  bullet('Instead of giving you your money back, ADA told you to hire ANOTHER developer (Sameer Khan, in Pakistan) to rebuild it from scratch — and pay him too.'),
  bullet('You ended up paying somewhere between $160,000 and $224,000 over the four and a half years — that\'s 5 to 7 times the original price.'),
  bullet('What you actually received is a half-working app that is dangerous to use, plus four years of "maintenance" and "marketing" bills for services that mostly weren\'t happening.'),
  body('In short: you paid for a finished, safe, professional app and a working marketing campaign. You did NOT get either one. The technical investigation can prove this with specific evidence that can be shown to a judge.'),
  callout('The good news: the evidence is unusually clear. The bad news: there is a lot of it, and it all points in the same direction. This document explains the most important pieces in language anyone can follow.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const houseAnalogy = [
  h1('The House Analogy'),
  body('Throughout this document we will compare your situation to hiring a contractor to build a house. The comparison is not perfect, but it makes the technical pieces much easier to follow.'),
  analogyBox('Picture this:', 'You hired a contractor to build a 3-bedroom house for $33,000. He promised you 6 months. Four years later, here is what you actually got:'),
  bullet('A house with only 13 of the 28 rooms you asked for finished.'),
  bullet('6 of the rooms have walls but no doors — you literally cannot get into them.'),
  bullet('The contractor left the front door unlocked AND a master key under the doormat.'),
  bullet('All your family photos and tax records (the customer files) were left outside in the front yard where anyone walking by can take them.'),
  bullet('The contractor never let an electrical inspector or building inspector come look at any of the work.'),
  bullet('When the foundation started to crack, the contractor said "it\'s fine" and kept charging you $4,000–$6,000 a month for "maintenance" — but never actually fixed anything.'),
  bullet('Meanwhile his "decorator" (the marketing person) was charging you $550/month to put flyers on your front lawn that nobody ever read.'),
  bullet('And he was billing you for a "housekeeper" he never sent.'),
  bullet('And he was charging you for "water service" even though the city water company was already supplying your water and you were paying them directly.'),
  body('That is what happened to you. Each item on that list maps to a specific finding in the technical investigation. The rest of this document goes through each one.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec1 = [
  h1('Part 1: The App (Half-Built)'),
  h2('What you were promised'),
  body('The original contract said ADA would build you a scheduling app that worked on websites AND on mobile phones (iPhone and Android). The app would have 29 different features split across four kinds of users:'),
  bullet('Cleaners (your employees who do the actual cleaning).'),
  bullet('Clients (the customers who book the cleanings).'),
  bullet('Team Admins (managers).'),
  bullet('Super Admins (you).'),
  h2('What you got'),
  body('A team of independent computer experts went through the app feature by feature in March 2026. Here is what they found:'),
  mktable(
    ['Promised Feature', 'Status'],
    [
      ['Customer can book an appointment online', { text: 'BROKEN — crashes every time', color: COLORS.red, bold: true }],
      ['New employees get a welcome email with their login', { text: 'BROKEN — no email is sent', color: COLORS.red, bold: true }],
      ['Recurring appointments (weekly cleanings) keep generating future dates', { text: 'BROKEN — will silently stop working', color: COLORS.red, bold: true }],
      ['Customer info syncs with the HighLevel CRM', { text: 'BROKEN — sync fails silently', color: COLORS.red, bold: true }],
      ['Customers get a reminder email before their appointment', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['Customers can pay through the app', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['You can generate invoices', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['You can see reports on your business performance', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['iPhone app', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['Android app', { text: 'MISSING — never built', color: COLORS.red, bold: true }],
      ['Calendar showing the day/week/month', { text: 'WORKS', color: COLORS.green, bold: true }],
      ['You can create appointments as an admin', { text: 'WORKS', color: COLORS.green, bold: true }],
      ['Employees can check in and out of appointments', { text: 'WORKS', color: COLORS.green, bold: true }],
      ['Photo upload at appointment', { text: 'WORKS', color: COLORS.green, bold: true }],
    ],
    [5500, 3500]
  ),
  para('', { spacing: { after: 200 } }),
  body('Overall: 13 of 28 features work. 6 crash every time. 9 are partly working. The rest are completely missing.'),
  h2('The "Time Bomb"'),
  callout('The most dangerous bug is hiding in plain sight. When you create a weekly recurring cleaning appointment, the app makes the next 2 years of appointments at once. Then a daily background process is supposed to add one more month every day. But the developer wrote that background process wrong — it only runs once a year. So your customers\' weekly cleanings will SILENTLY start disappearing from the calendar after about two years. Nobody will be told. The cleanings just won\'t show up anymore.'),
  analogyBox('What this means for you:', 'Imagine your appointment book had pages that quietly disappeared while you weren\'t looking. You\'d miss appointments. Customers would be furious. You\'d have no idea why it was happening. That is the time bomb.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec2 = [
  h1('Part 2: Security (Front Door Unlocked)'),
  body('This is the section that should scare you the most. The app has 13 critical security problems — meaning a teenager with internet access could break in and steal your customer data. Here are the worst three explained in plain English.'),
  h2('1. The Master Key Was Left Under the Doormat'),
  body('In the app, there is something called a "web shell." This is software that gives a person with admin access (i.e., you and your staff) a way to type computer commands and run them on the server. Think of it as a control panel for your entire app.'),
  analogyBox('The house analogy:', 'Imagine someone broke into your office. Even a low-skilled thief would only get whatever was in your office. But if you left the master key to the ENTIRE BUILDING in your office desk drawer — now that thief can get into every room, the basement, the safe, the back office where you keep tax records. The web shell is that master key.'),
  body('Web shells are commonly used by professional hackers AFTER they break in, to keep coming back. Your developer installed one BEFORE delivering the app. This is so dangerous that one cybersecurity expert called it "malware-equivalent." It should never exist on a website that real customers use.'),
  body('Fix time: 15 minutes. Removing one line of code. The developer never did it.'),
  h2('2. Your Customers\' Photos Were Left in the Front Yard'),
  body('When your cleaners upload photos at an appointment, those photos are stored on a service called Amazon S3 (think of it like Dropbox for businesses). Your developer set those photos to "public-read."'),
  analogyBox('What "public-read" means:', 'If I know the link to the photo, I can download it. No password. No login. No "are you allowed to see this?" check. Just like if you put photos of your customers in a public box on the sidewalk with a sign saying "Take One." All your customer photos. All your customer documents. All your database backups.'),
  body('Fix time: 1–2 hours. Changing the setting from "public-read" to "private." The developer never did it.'),
  h2('3. Anyone Could Create a Manager Account With No Login'),
  body('There is a part of the app called a "webhook endpoint." Normally these are protected — you have to prove who you are before using them. But one of the webhook endpoints in your app has no protection at all. Anyone on the open internet, with no login, can send a single message to that endpoint and create a new admin (manager) account.'),
  body('Worse: the password for that new account is a HARDCODED, GUESSABLE password ("TempPass123@"). So an attacker can: (1) create the admin account from anywhere in the world without a login, then (2) immediately log in with the password they already know.'),
  analogyBox('The house analogy:', 'Imagine the back gate of your house has a doorbell that, when pressed, makes a brand new spare key for the front door — AND the key is the same every time. Anyone walking by can press the doorbell, get a key, and walk in the front door.'),
  body('Fix time: 30 minutes. Adding a security check. The developer never did it.'),
  h2('Why this matters even if nobody has hacked you yet'),
  body('Each of these problems is a "ticking clock" — every day they exist is another day a hacker MIGHT find them. The longer they exist, the higher the chance you eventually get attacked. And the kicker: under most state laws, including Maryland (where you operate) and Ohio (where ADA operates), if customer data leaks, YOU are legally responsible for notifying affected customers and may face fines. The contractor who left the door unlocked doesn\'t pay — you do.'),
  callout('Bottom line: any one of these three problems alone would be considered serious negligence. All three of them together, plus 10 more like them, is what is called "gross negligence." Gross negligence is legally meaningful — it changes which damages can be recovered in a lawsuit.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec3 = [
  h1('Part 3: The Maintenance Fee (You Were Paying for Nothing)'),
  body('Starting in early 2024, Sameer (the Pakistan developer) charged you $4,000 to $6,000 every month for "Platinum Maintenance." The bills claimed he was spending 80 hours a month maintaining your app.'),
  body('80 hours a month is about half of a full-time job. That is a LOT of time. So we asked: where did all those hours go?'),
  h2('The git log — the smoking gun'),
  body('Every change a developer makes to an app gets recorded automatically in a system called "git." Git creates a permanent record with the date, the person, and exactly how many lines of code were added or removed. This record cannot be faked — it\'s mathematically locked.'),
  body('We have the complete git record for your app. Here is what it says about Sameer\'s claimed 80 hours per month:'),
  mktable(
    ['Month', 'Bills said work was done?', 'Git says work was done?', 'Reality'],
    [
      ['February 2025', 'YES — $4,000 charged', 'ZERO commits, ZERO changes', { text: 'IDLE', color: COLORS.red, bold: true }],
      ['June 2025', 'YES — $4,000 charged', 'ZERO commits, ZERO changes', { text: 'IDLE', color: COLORS.red, bold: true }],
      ['July 2025', 'YES — $4,000 charged', 'ZERO commits, ZERO changes', { text: 'IDLE', color: COLORS.red, bold: true }],
      ['December 2025', 'YES — $4,000 charged', 'ZERO commits, ZERO changes', { text: 'IDLE', color: COLORS.red, bold: true }],
      ['Six other months', 'YES — $4,000 charged each', 'Less than 10 hours work', { text: 'Almost nothing', color: COLORS.red, bold: true }],
    ],
    [2200, 2400, 2800, 1600]
  ),
  para('', { spacing: { after: 200 } }),
  body('Four months had ZERO work happen. Six more months had less than 10 hours. Total claimed across the 26-month maintenance window: 2,080 hours. Total actually delivered per git: 574 hours.'),
  bodyBold('That is 1,506 hours of work that you were billed for but that did not happen. At $100/hour that is $150,600 of pure overcharge.'),
  analogyBox('The house analogy:', 'You\'re paying a contractor $4,000 a month to maintain your house. Four times across two years, the security camera footage shows nobody arrived at your house at all that month. Six more months show somebody coming for 30 minutes and leaving. But every single month, the bill said 80 hours of work. Where did those 80 hours go? They didn\'t happen.'),
  h2('What real maintenance should look like'),
  body('For an app like yours, normal maintenance is about 20–30 hours per month and costs $2,000–$3,000. That covers things like:'),
  bullet('Applying security updates to the building blocks (we call them "libraries") your app is built on.'),
  bullet('Checking that backups are working.'),
  bullet('Watching for unusual activity.'),
  bullet('Updating the framework (Django) when new safe versions come out.'),
  body('Almost NONE of this happened. The framework your app is built on — Django version 3.2 — reached end-of-life in April 2024. End-of-life means: no more security updates, ever. A maintained app would have been upgraded to Django 4.2 (which is supported until 2026) or Django 5.1. Your app stayed on the unsupported version for the entire engagement.'),
  callout('To put it plainly: Sameer was billing you for premium maintenance while NOT doing the most basic maintenance. He was being paid to keep the building blocks of your app up to date, and he never did.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec4 = [
  h1('Part 4: ADA (The Marketing & Hosting Bills)'),
  body('Separate from the app development, ADA was charging you about $1,812 every month for three things:'),
  bullet('$149.99 — "Summit Website Support and Hosting" for your examplebooking.example website.'),
  bullet('$1,100 — "Virtual Assistant — Part-Time."'),
  bullet('$549.99 — "Social Media Management — Silver."'),
  bullet('Plus $12/month for a Google Workspace email account.'),
  body('Let\'s look at each one.'),
  h2('1. The Hosting Bill — You Were Paying TWICE'),
  body('ADA charged you $149.99/month to "host" your examplebooking.example website. Hosting is where the website actually lives — like paying rent on the physical building where your store is located.'),
  body('Here is the problem: your website is actually living in YOUR OWN GoHighLevel account — a service you already pay for separately. GoHighLevel hosts your website. ADA was charging you for hosting that GoHighLevel was actually providing.'),
  analogyBox('The house analogy:', 'Imagine you rent an apartment from Landlord A. You pay Landlord A every month. Now imagine Landlord B also sends you a "rent" bill every month for the same apartment. You\'re paying twice for one apartment, and Landlord B isn\'t doing anything.'),
  body('Over 32 months of these double bills, you paid ADA about $4,800 for hosting that GoHighLevel was actually providing.'),
  body('On top of that, the "Support" portion was supposed to include keeping your website up to date — applying security patches when new ones come out. We have the audit log for your WordPress site (a list of every change anyone made). Between December 16, 2025 and May 2, 2026 — 138 days — ADA personnel made ZERO security updates to your site. The only updates during that period were from an automatic robot. And the only "real" updates in the entire period were done by YOU yourself on May 2, 2026 when you took back control.'),
  h2('2. The Virtual Assistant — Where Was She?'),
  body('Starting January 2024, ADA billed you $1,100/month for a "Virtual Assistant — Part-Time." That continued for over two years.'),
  body('Per your own statement: there were many months when no virtual assistant ever contacted you. No emails. No tasks. No work product. Nothing.'),
  bodyBold('Billing for a service that was not delivered is fraud. It is the cleanest possible case to prove because the standard is so simple: either she did the work, or she didn\'t.'),
  body('Damages on this one item alone: somewhere between $5,500 (5 months of confirmed no-service) and $27,500 (the full 25-month run).'),
  analogyBox('The house analogy:', 'Imagine your contractor said "I\'m sending a housekeeper over every week. That\'s $250 a week." You pay him. The housekeeper never shows up. You ask him about it. He keeps billing. After a year you ask again. Still no housekeeper, still bills. This is exactly what happened with the VA.'),
  h2('3. Social Media — The Posts Nobody Saw'),
  body('ADA charged you $549.99/month for "Social Media Management — Silver." For 20 months. That is about $11,000 total.'),
  body('Here is what ADA\'s own quarterly report (April-July 2025) says they accomplished:'),
  mktable(
    ['Platform', 'What you got across 90 days'],
    [
      ['Instagram', { text: 'ZERO likes, ZERO comments, ZERO new followers across all posts', color: COLORS.red, bold: true }],
      ['LinkedIn', { text: 'ZERO engagement, ZERO new followers (the audience is hospital/healthcare workers)', color: COLORS.red, bold: true }],
      ['Facebook', { text: '2 engagements on 340 posts — about 1 in 170 posts got even one click', color: COLORS.red, bold: true }],
      ['Google My Business', { text: 'ZERO reviews, ZERO website visits, ONE phone call', color: COLORS.red, bold: true }],
      ['Google Search clicks', { text: '28 clicks total — DOWN 51% from the previous 90 days', color: COLORS.red, bold: true }],
    ],
    [3000, 6000]
  ),
  para('', { spacing: { after: 200 } }),
  body('The posts themselves were clearly AI-generated boilerplate — titles like "⚖️ Work-Life Balance Starts Here" and "📊 Manage Projects with Example Booking Co." with emoji-laden, generic content that has no specific business message. Industry standard for social media management at this price point is custom-written, business-specific content, audience growth, and engagement-driven optimization. You got none of that.'),
  analogyBox('The house analogy:', 'You paid a guy $550 a month to put flyers on people\'s doors advertising your business. He used the same generic flyer with cartoon stick figures and posted it on doors of houses that didn\'t exist on streets nobody walks down. After two years and $11,000, no human ever called your business because of one of those flyers. The guy kept billing you and sent you a report every 90 days showing that the flyers had been mailed (he still got paid by the mailing service) but the report didn\'t mention that nobody had ever called.'),
  callout('That is the social media campaign in plain English. They were posting. The posts existed. But they reached almost nobody, engaged literally zero people on some platforms, and produced zero phone calls to your business across an entire quarter.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec5 = [
  h1('Part 5: What This Means In Dollars'),
  body('Let\'s add it all up. Here is what you paid and what each piece was actually worth.'),
  h2('What you paid'),
  bodyBold('Total documented + estimated: $132,000 across 53 months (about $2,500/month average across the engagement).'),
  bodyBold('Your own number: $160,000 to $224,000 (the gap is the $6,000/month Platinum Maintenance era we don\'t have records for, and the Initial Build Vendor build payments before 2023).'),
  h2('What it was actually worth'),
  body('Here is the fair value of each piece, based on what comparable services cost in the market:'),
  mktable(
    ['What you paid for', 'What it was worth', 'Overpayment'],
    [
      ['App build (delivered scope, current quality)', '$54,000 – $80,000', '$0 (if low) to $80,000+ (if high)'],
      ['App maintenance (26 months)', '$52,000 – $78,000 fair value', '$26,000 – $74,000 overpaid'],
      ['ADA hosting (32 months)', '$320 – $960 fair value', '$3,840 – $4,800 overpaid'],
      ['ADA Virtual Assistant', '$0 (not delivered, several months)', '$5,500 – $27,500 fraud'],
      ['ADA social media', '$2,000 – $6,000 fair value', '$5,000 – $9,000 overpaid'],
      [{ text: 'TOTAL CASH OVERPAYMENT', bold: true }, '', { text: '$40,340 – $195,300+', bold: true, color: COLORS.red }],
    ],
    [3500, 2800, 2700]
  ),
  para('', { spacing: { after: 200 } }),
  callout('That\'s the dollar story. Realistically: between $80,000 and $180,000 of what you paid was overpayment that you have a strong legal case to claw back. That doesn\'t include punitive damages (extra money a court might award because of the fraud) or attorney\'s fees.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec6 = [
  h1('Part 6: What Happens Now'),
  body('Here are the next steps in plain language.'),
  h2('What you have already done (good)'),
  bullet('You stopped paying. As of May 1, 2026, no more money should leave your account to ADA or to Sameer Khan / DevPipe.'),
  bullet('You took control of your WordPress site and updated all the security patches yourself on May 2, 2026.'),
  bullet('You ordered the technical investigation — what you\'re reading is the result.'),
  h2('What needs to happen next'),
  numb('Hire a commercial litigation attorney in Ohio (specifically in the Cuyahoga County area where ADA is located). The "Attorney Legal Memo" document in your folder is designed for that attorney to read on day one of the engagement.'),
  numb('The attorney will likely start with a "demand letter" — a formal letter that says "we know what you did, here is the evidence, here is what we want." Many cases settle at this stage without ever going to court.'),
  numb('If a demand letter doesn\'t resolve it, the next step is filing a lawsuit. The attorney handles all of this. Your job is to stay available to answer questions and keep paying the bills.'),
  numb('Preserve your evidence. Don\'t delete any emails. Don\'t delete the WordPress site. Don\'t delete anything related to ADA, Robert Hartwell, Sameer Khan, DevPipe, or Offshore Build Group. The attorney will tell you specifically what to keep — assume "everything" until told otherwise.'),
  numb('Block their access. If ADA personnel still have admin access to your WordPress site, your HighLevel CRM, your Google Workspace, or your domain registrar — change those passwords today. Get new passwords from your IT person or generate them yourself.'),
  h2('What to expect'),
  bullet('Timeline: most commercial cases like this take 6–18 months from filing to settlement. Some go faster. Some go slower.'),
  bullet('Cost: a commercial litigator on contingency (where they take a percentage of what they recover) typically takes 33–40%. On hourly billing, expect $300–$600/hour. Many will discuss alternative arrangements given the strength of this case.'),
  bullet('Outcome: the realistic outcome here is settlement — they pay you somewhere in the $100,000–$250,000 range in exchange for you dropping the lawsuit. A trial outcome could be higher (with treble damages and attorney\'s fees) but takes much longer and is riskier.'),
  h2('What NOT to do'),
  bullet('Do NOT contact Robert Hartwell, Sameer Khan, or anyone at ADA or DevPipe directly. Every conversation should go through your attorney. Anything you say can be used against you in court.'),
  bullet('Do NOT post about this on social media. Saying anything publicly about a fraud case can trigger defamation claims (even when what you\'re saying is true). The attorney will tell you when you can talk about it publicly.'),
  bullet('Do NOT delete any communication, no matter how trivial. Save every email. Every text. Every voicemail. If you think it might be irrelevant, save it anyway — let the attorney decide.'),
  bullet('Do NOT pay any more bills from ADA or Sameer. If they send a bill, forward it to your attorney.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const sec7 = [
  h1('Part 7: The Hardest Part — How This Happened to Begin With'),
  body('You may be asking yourself: how did this go on for over four years? You\'re not unintelligent. You weren\'t being careless. So how did this happen?'),
  body('Here is the honest answer.'),
  bullet('You hired ADA because they presented themselves as a US-based premium agency. Their website, their phone number, their pricing — all looked legitimate.'),
  bullet('When the first build (Initial Build Vendor) failed, ADA did not own the failure. Instead they introduced you to "the next guy" — Sameer — and framed him as the solution. Most people, when their contractor says "I have a fix, but it costs more," go along with it. That\'s human nature.'),
  bullet('Once you were paying Sameer directly, ADA stopped being a contractor on the hook and became a middleman who could not be reached for the technical problems. They kept getting paid for marketing and hosting, but the technical decisions were now between you and a developer 12 time zones away.'),
  bullet('When the rebuild produced a half-working app with strange behavior, both vendors had reason to deflect blame onto the other. Each time you reported a bug, you were sent in a circle.'),
  bullet('Their billing structure — small monthly amounts ($1,800 + $4,000 — $6,000) — does not look like a giant scam. It looks like normal business expenses. The total only becomes obvious when you add up four years of monthly bills.'),
  bullet('When you finally questioned the maintenance fee, Sameer dropped it from $6,000 to $4,000 — a 33% drop. That is not a normal pricing adjustment. That is a confession that the price was inflated to begin with, but framed as "compromise."'),
  bullet('And the technical pieces — the broken features, the security holes, the missing tests — are invisible to anyone without specific computer-engineering training. You had no way to verify any of this without ordering the independent audit.'),
  callout('This is a sophisticated, multi-year fraud pattern. It worked for years because each individual piece was just a little bit wrong — small enough not to obviously trip an alarm, but persistent enough to add up. The pattern is the fraud. Each individual bill, looked at alone, seems plausible. The pattern only becomes obvious in hindsight.'),
  body('You did nothing wrong in trusting them initially. The breakdown of that trust is on them, not on you. And the legal system exists precisely for situations like this where one party has a major information advantage over the other.'),
  body('What matters now is the evidence trail you\'ve preserved, the steps you\'re about to take, and the recovery process. The next 6–18 months are about getting your money back and protecting other small business owners from the same trap.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const closeUp = [
  h1('Part 8: One Last Thing — The Bright Side'),
  body('You may not realize this, but here are some genuinely positive things:'),
  bullet('Most fraud victims never document anything. You did. The evidence packet your attorney has is one of the cleanest fraud records they\'ll see all year.'),
  bullet('Most victims never take back control. You did, on May 2, 2026, when you updated the WordPress site yourself and stopped the bleeding.'),
  bullet('Most victims hire one specialist and trust the report. You commissioned an entire forensic investigation across nine technical domains plus invoice forensics plus a CVE timeline plus marketing analysis. That comprehensiveness is unusual and powerful.'),
  bullet('You have a working scheduling application as a starting point. It needs serious work to be safe and complete, but the core business logic for recurring appointments and team management is well-built. A future engineer can salvage this — you do not have to start from zero.'),
  bullet('Robert Hartwell is already being sued by his business partner (James Whitfield, Cuyahoga County Case CV-XX-XXXXXX). That means ADA is already paying lawyers, already financially strained, already distracted. Your case lands at the worst possible time for them and the best possible time for you.'),
  bullet('Your case is strong enough that many commercial litigators will take it on contingency — meaning you don\'t pay legal fees up front. You only pay if they recover money.'),
  callout('You\'ve been through a long and frustrating ordeal. The evidence is now collected. The story is now told in language a judge will understand. The next step is handing all of this to an attorney and letting the legal system do what it\'s built to do.'),
  para('', { spacing: { after: 300 } }),
  para('— End of Plain-Language Report —', { run: { size: 26, bold: true, color: COLORS.primary }, alignment: AlignmentType.CENTER }),
  para('', { spacing: { after: 200 } }),
  para('If you have questions about anything in this document, write them down and bring them to your attorney. Every question you have is a legitimate question.', { run: { size: 22, italics: true }, alignment: AlignmentType.CENTER }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font: 'Arial', color: COLORS.primary }, paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: COLORS.accent }, paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 2 } },
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
      children: [new TextRun({ text: 'Plain Language Report — Example Booking Co. Investigation', size: 18, color: COLORS.darkgrey, italics: true })],
      alignment: AlignmentType.CENTER,
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Page ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLORS.darkgrey }), new TextRun({ text: ' of ', size: 18, color: COLORS.darkgrey }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLORS.darkgrey })],
    })] }) },
    children: [...cover, ...intro, ...houseAnalogy, ...sec1, ...sec2, ...sec3, ...sec4, ...sec5, ...sec6, ...sec7, ...closeUp],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = './forensic-output/forensic-output/ExampleBooking_Plain_Language_Report.docx';
  fs.writeFileSync(out, buffer);
  console.log('Wrote ' + out + ' (' + buffer.length + ' bytes)');
});
