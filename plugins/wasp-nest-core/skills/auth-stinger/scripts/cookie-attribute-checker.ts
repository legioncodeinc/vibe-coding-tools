#!/usr/bin/env -S npx tsx
/**
 * cookie-attribute-checker.ts
 *
 * Hits a sign-in URL, observes the Set-Cookie response header(s), and
 * verifies session cookies have the right attributes per
 * templates/session-cookie-config.ts and guides/10-session-storage.md.
 *
 * USAGE
 *   npx tsx scripts/cookie-attribute-checker.ts \
 *     --url https://app.example.com/api/auth/sign-in \
 *     --method POST \
 *     --body '{"email":"test@example.com","password":"..."}' \
 *     --expect-name "__Host-session"
 *
 * EXIT CODES
 *   0 — all session cookies pass
 *   1 — at least one cookie has missing/wrong attribute
 *
 * Cite: guides/10-session-storage.md, OWASP Session Management Cheat Sheet,
 * RFC 6265bis.
 */

interface Args {
  url: string;
  method: 'GET' | 'POST';
  body?: string;
  expectName?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1] ?? '';
  }
  return {
    url: args.url,
    method: (args.method as 'GET' | 'POST') ?? 'POST',
    body: args.body,
    expectName: args['expect-name'],
  };
}

interface ParsedCookie {
  name: string;
  value: string;
  attrs: Record<string, string | true>;
  raw: string;
}

function parseSetCookie(line: string): ParsedCookie {
  const [first, ...rest] = line.split(';').map((s) => s.trim());
  const eq = first.indexOf('=');
  const name = first.slice(0, eq);
  const value = first.slice(eq + 1);
  const attrs: Record<string, string | true> = {};
  for (const part of rest) {
    const i = part.indexOf('=');
    if (i === -1) attrs[part.toLowerCase()] = true;
    else attrs[part.slice(0, i).toLowerCase()] = part.slice(i + 1);
  }
  return { name, value, attrs, raw: line };
}

function lintCookie(c: ParsedCookie): { findings: string[]; severity: 'pass' | 'must-fix' | 'should-refactor' } {
  const findings: string[] = [];
  let worst: 'pass' | 'should-refactor' | 'must-fix' = 'pass';
  const escalate = (s: 'should-refactor' | 'must-fix') => {
    if (s === 'must-fix' || worst === 'pass') worst = s;
  };

  if (!c.attrs.httponly) {
    findings.push('MUST-FIX: missing HttpOnly');
    escalate('must-fix');
  }
  if (!c.attrs.secure) {
    findings.push('MUST-FIX: missing Secure');
    escalate('must-fix');
  }
  if (!c.attrs.samesite) {
    findings.push('MUST-FIX: missing SameSite (defaults vary by browser; be explicit)');
    escalate('must-fix');
  } else {
    const ss = String(c.attrs.samesite).toLowerCase();
    if (!['lax', 'strict', 'none'].includes(ss)) {
      findings.push(`MUST-FIX: invalid SameSite=${ss}`);
      escalate('must-fix');
    }
    if (ss === 'none' && !c.attrs.secure) {
      findings.push('MUST-FIX: SameSite=None requires Secure');
      escalate('must-fix');
    }
  }
  if (!c.attrs.path) {
    findings.push('SHOULD-REFACTOR: explicit Path=/ recommended');
    escalate('should-refactor');
  }
  if (c.name.startsWith('__Host-')) {
    if (c.attrs.domain) {
      findings.push('MUST-FIX: __Host- prefix forbids Domain attribute');
      escalate('must-fix');
    }
    if (c.attrs.path !== '/') {
      findings.push('MUST-FIX: __Host- prefix requires Path=/');
      escalate('must-fix');
    }
    if (!c.attrs.secure) {
      findings.push('MUST-FIX: __Host- prefix requires Secure');
      escalate('must-fix');
    }
  }
  if (!c.attrs['max-age'] && !c.attrs.expires) {
    findings.push('SHOULD-REFACTOR: explicit Max-Age (or Expires) recommended; otherwise this is a session cookie');
    escalate('should-refactor');
  }

  return { findings, severity: worst };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    console.error('Missing --url');
    process.exit(2);
  }

  const res = await fetch(args.url, {
    method: args.method,
    headers: args.body ? { 'content-type': 'application/json' } : undefined,
    body: args.body,
    redirect: 'manual',
  });

  // Both Node 18+ and undici expose getSetCookie().
  const setCookies =
    typeof (res.headers as any).getSetCookie === 'function'
      ? (res.headers as any).getSetCookie()
      : res.headers.get('set-cookie')?.split(/, (?=[A-Za-z])/g) ?? [];

  if (setCookies.length === 0) {
    console.error('No Set-Cookie headers in response.');
    process.exit(1);
  }

  let failed = false;
  for (const raw of setCookies) {
    const c = parseSetCookie(raw);
    if (args.expectName && c.name !== args.expectName) continue;
    const { findings, severity } = lintCookie(c);
    console.log(`Cookie: ${c.name}`);
    if (findings.length === 0) {
      console.log('  PASS');
    } else {
      findings.forEach((f) => console.log('  ' + f));
      if (severity === 'must-fix') failed = true;
    }
    console.log('');
  }

  if (failed) {
    console.error('At least one cookie failed must-fix checks.');
    process.exit(1);
  }
  console.log('All cookies passed.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
