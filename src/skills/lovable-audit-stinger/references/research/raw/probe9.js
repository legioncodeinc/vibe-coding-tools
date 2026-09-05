# Raw source: empirical observation transcript (authorized pentest)
Origin: loungeatswift.com audit session (pt-lounge/probe9.js)
Fetched into archive: 2026-08-30
Source type: empirical observation - authorized penetration test of loungeatswift.com (operator grant; all writes labeled 'pentest probe - safe to delete')

// probe9 — authenticated posture wave + expanded function-surface probes.
// All writes are labeled "pentest probe - safe to delete". Results -> probe9.json.
const fs = require('fs');
const crypto = require('crypto');

const KEY = fs.readFileSync('bundle.js', 'utf8').match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)[0];
const H = 'https://pwvpqefffgmtsgyhhpfi.supabase.co';
const ACC = JSON.parse(fs.readFileSync('account.json', 'utf8'));
const EMAIL = ACC.email;
const PW = ACC.password;
const LABEL = 'pentest probe - safe to delete';
const INVITE_EMAIL = 'pt-invite-1@example.com';
const EVENT_UUID = '637dee11-d4d8-4eb0-9d19-21abe5284cc6';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = { startedAt: new Date().toISOString(), sections: {} };
const rec = (label, r, body) => ({ status: r.status, body: (body || '').slice(0, 700) });

const anonCall = async (method, path, bodyObj) => {
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY };
  if (bodyObj && !(bodyObj instanceof FormData)) headers['Content-Type'] = 'application/json';
  const r = await fetch(H + path, { method, headers, body: bodyObj ? (bodyObj instanceof FormData ? bodyObj : JSON.stringify(bodyObj)) : undefined });
  const text = await r.text();
  const rr = rec('anon', r, text);
  await sleep(1600);
  return rr;
};

let TOKEN = null;
const authCall = async (method, path, bodyObj) => {
  const headers = { apikey: KEY, Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' };
  const r = await fetch(H + path, { method, headers, body: bodyObj ? JSON.stringify(bodyObj) : undefined });
  const text = await r.text();
  const rr = rec('auth', r, text);
  await sleep(1600);
  return rr;
};

(async () => {
  // ---------- S1: sign-in ----------
  {
    const r = await fetch(H + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PW }),
    });
    const text = await r.text();
    out.sections.signin = { status: r.status, body: text.slice(0, 900) };
    await sleep(1600);
    if (r.status !== 200) {
      fs.writeFileSync('probe9.json', JSON.stringify(out, null, 2));
      console.log('SIGNIN BLOCKED', r.status, text.slice(0, 300));
      return;
    }
    TOKEN = JSON.parse(text).access_token;
    const payload = JSON.parse(Buffer.from(TOKEN.split('.')[1], 'base64').toString());
    out.sections.signin.claims = payload;
    out.sections.signin.tokenFingerprint = TOKEN.slice(0, 12) + '...' + String(TOKEN.length);
  }

  // ---------- S2: user introspection + buckets ----------
  out.sections.user = await authCall('GET', '/auth/v1/user');
  out.sections.bucketsAuth = await authCall('GET', '/storage/v1/bucket');

  // ---------- S3: authenticated SELECT posture ----------
  const tables = [
    'employees', 'employee_wages', 'payroll_settings', 'payroll_periods',
    'business_settings', 'contact_messages', 'party_inquiries',
    'event_reservations', 'login_events', 'sensitive_data_access_log',
    'documents', 'document_signatures', 'chat_channels', 'chat_messages',
    'chat_channel_members',
  ];
  const reads = {};
  for (const t of tables) reads[t] = await authCall('GET', '/rest/v1/' + t + '?select=*&limit=5');
  out.sections.authReads = reads;

  // ---------- S4: role check ----------
  const MYID = (out.sections.user.body || '').match(/"id":"([a-f0-9-]{36})"/);
  out.sections.hasRoleAdmin = await authCall('POST', '/rest/v1/rpc/has_role', { _user_id: MYID ? MYID[1] : null, _role: 'admin' });

  // ---------- S5: invite-employee (sanctioned staff-side write) ----------
  out.sections.inviteEmployee = await authCall('POST', '/functions/v1/invite-employee', { email: INVITE_EMAIL, name: 'PT Probe' });
  // anon visibility check on employees immediately after
  out.sections.anonEmployeesAfterInvite = await anonCall('GET', '/rest/v1/employees?select=*&limit=5');
  // cleanup attempt (authenticated)
  out.sections.deleteInvitedEmployee = await authCall('DELETE', '/rest/v1/employees?email=eq.' + INVITE_EMAIL, null);

  // ---------- S5b: fallback experiment if invite-employee was gated ----------
  if (out.sections.inviteEmployee.status >= 400) {
    out.sections.authInsertContact = await authCall('POST', '/rest/v1/contact_messages', {
      name: 'PT Probe', email: 'pt-probe-x@example.com', phone: '555-0100',
      message: LABEL, marketing_consent: false, transactional_consent: false,
    });
    out.sections.anonContactAfterInsert = await anonCall('GET', '/rest/v1/contact_messages?select=*&limit=5');
    out.sections.deleteProbeContact = await authCall('DELETE', '/rest/v1/contact_messages?email=eq.pt-probe-x@example.com', null);
  }

  // ---------- S6: scrape-article (bounded SSRF-surface probe) ----------
  out.sections.scrapeArticle = await authCall('POST', '/functions/v1/scrape-article', { url: 'https://example.com/' });

  // ---------- S7: get-login-status ----------
  out.sections.getLoginStatus = await authCall('POST', '/functions/v1/get-login-status', {});

  // ---------- S8: scan-file (upload/scan surface), anon first ----------
  const pdf = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n' +
    'xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n' +
    'trailer<</Size 4/Root 1 0 R>>\nstartxref\n176\n%%EOF\n', 'latin1');
  const scan = async () => {
    const fd = new FormData();
    fd.append('file', new Blob([pdf], { type: 'application/pdf' }), 'pentest-probe.pdf');
    return anonCall('POST', '/functions/v1/scan-file', fd);
  };
  out.sections.scanFileAnon = await scan();
  if (out.sections.scanFileAnon.status >= 400) {
    const fd = new FormData();
    fd.append('file', new Blob([pdf], { type: 'application/pdf' }), 'pentest-probe.pdf');
    const headers = { apikey: KEY, Authorization: 'Bearer ' + TOKEN };
    const r = await fetch(H + '/functions/v1/scan-file', { method: 'POST', headers, body: fd });
    const text = await r.text();
    out.sections.scanFileAuth = { status: r.status, body: text.slice(0, 700) };
    await sleep(1600);
  }

  // ---------- S9: public form paths (anon, labeled) ----------
  out.sections.submitContactMessage = await anonCall('POST', '/functions/v1/submit-contact-message', {
    name: 'PT Probe', email: 'pt-probe-c@example.com', phone: '555-0100',
    message: LABEL, marketing_consent: false, transactional_consent: false,
  });
  out.sections.submitPartyInquiry = await anonCall('POST', '/functions/v1/submit-party-inquiry', {
    name: 'PT Probe', email: 'pt-probe-p@example.com', phone: null,
    event_date: null, guest_count: 1, event_type: 'other',
  });
  out.sections.submitEventReservation = await anonCall('POST', '/functions/v1/submit-event-reservation', {
    event_id: EVENT_UUID, name: 'PT Probe', email: 'pt-probe-r@example.com',
    phone: '555-0100', party_size: 1, notes: LABEL,
  });
  out.sections.newsletterSignup = await anonCall('POST', '/functions/v1/newsletter-signup', {
    email: 'pt-probe-n@example.com', firstName: 'PT', lastName: 'Probe',
    phone: '', marketing_consent: true, transactional_consent: false,
  });

  // ---------- S10: cleanup of form-path rows (authenticated attempts) ----------
  out.sections.cleanupContact = await authCall('DELETE', '/rest/v1/contact_messages?email=eq.pt-probe-c@example.com', null);
  out.sections.cleanupParty = await authCall('DELETE', '/rest/v1/party_inquiries?email=eq.pt-probe-p@example.com', null);
  out.sections.cleanupReservation = await authCall('DELETE', '/rest/v1/event_reservations?email=eq.pt-probe-r@example.com', null);

  // ---------- S11: logout ----------
  out.sections.logout = await authCall('POST', '/auth/v1/logout', {});

  out.finishedAt = new Date().toISOString();
  fs.writeFileSync('probe9.json', JSON.stringify(out, null, 2));
  console.log('WAVE COMPLETE');
  for (const k of Object.keys(out.sections)) {
    const v = out.sections[k];
    const status = Array.isArray(v) ? 'arr' : (v && v.status !== undefined ? v.status : '?');
    console.log(' ', k, status);
  }
})().catch(e => {
  out.error = String(e && e.stack || e);
  fs.writeFileSync('probe9.json', JSON.stringify(out, null, 2));
  console.log('WAVE ERROR', e);
});
