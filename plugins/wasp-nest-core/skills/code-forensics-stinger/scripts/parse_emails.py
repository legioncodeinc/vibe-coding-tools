#!/usr/bin/env python3
"""
parse_emails.py — Parse a Gmail .eml archive into individual message + thread markdown files.

Usage:
    python parse_emails.py \
        --input-dirs /path/to/investigation-dump /path/to/attachments \
        --out /path/to/forensic-output

Outputs:
    forensic-output/individual-messages/M-####-{sender}.md
    forensic-output/threads/T-####-{subject-slug}.md
    forensic-output/_intermediate/processed.json
    forensic-output/_intermediate/manifest.json
    forensic-output/_intermediate/email-meta.json (top senders, date range, Stripe accounts)
"""
import argparse, os, json, re, email, email.policy, hashlib
from collections import defaultdict, Counter
from datetime import datetime
from email.utils import parsedate_to_datetime
from bs4 import BeautifulSoup

def walk_msg(msg, depth=0):
    """Recursively walk a MIME structure yielding leaf messages."""
    ct = msg.get_content_type()
    if ct == 'message/rfc822':
        for sub in msg.iter_parts():
            yield from walk_msg(sub, depth + 1)
        return
    subj = msg.get('Subject', '')
    frm = msg.get('From', '')
    if frm or subj:
        to = msg.get('To', '')
        cc = msg.get('Cc', '')
        bcc = msg.get('Bcc', '')
        date = msg.get('Date', '')
        mid = msg.get('Message-ID', '')
        body_text, body_html, attachments = '', '', []
        try:
            for part in msg.walk():
                pct = part.get_content_type()
                disp = part.get('Content-Disposition') or ''
                if pct == 'text/plain' and 'attachment' not in disp.lower():
                    try:
                        body_text += (part.get_content() if hasattr(part, 'get_content')
                                      else (part.get_payload(decode=True) or b'').decode('utf-8', 'replace'))
                    except Exception:
                        pass
                elif pct == 'text/html' and 'attachment' not in disp.lower():
                    try:
                        body_html += (part.get_content() if hasattr(part, 'get_content')
                                      else (part.get_payload(decode=True) or b'').decode('utf-8', 'replace'))
                    except Exception:
                        pass
                elif 'attachment' in disp.lower() or part.get_filename():
                    fn = part.get_filename()
                    if fn:
                        payload = part.get_payload(decode=True) or b''
                        attachments.append({'filename': fn, 'content_type': pct, 'size': len(payload)})
        except Exception:
            pass
        yield {
            'subject': subj, 'from': frm, 'to': to, 'cc': cc, 'bcc': bcc,
            'date': date, 'message_id': mid,
            'body_text': body_text, 'body_html': body_html,
            'attachments': attachments, 'depth': depth,
        }
    if msg.is_multipart():
        for sub in msg.iter_parts():
            yield from walk_msg(sub, depth + 1)

def html_to_text(html):
    if not html: return ''
    try:
        soup = BeautifulSoup(html, 'html.parser')
        for s in soup(['script', 'style']):
            s.decompose()
        text = soup.get_text(separator='\n')
        text = re.sub(r'\n[ \t]+', '\n', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()
    except Exception:
        return ''

def get_email_addr(addr):
    if not addr: return ''
    m = re.search(r'[\w.+-]+@[\w.-]+', addr)
    return m.group(0).lower() if m else ''

def sanitize_for_filename(addr):
    if not addr: return 'unknown'
    addr = addr.lower().replace('.', '-')
    return re.sub(r'[^a-z0-9@\-]', '', addr)

def make_summary(m):
    body = m.get('_body', '') or ''
    subj = m.get('subject', '') or ''
    body_lower = body.lower()
    if 'invoice' in subj.lower() or 'invoice' in body_lower[:500]:
        inv_match = re.search(r'(?:invoice|#)[ \-#]*([A-Z0-9]+\-[\d]+|[A-Z0-9]{6,})', body, re.IGNORECASE)
        amt_match = re.search(r'\$\s*([\d,]+\.\d{2})', body)
        details = []
        if inv_match: details.append(f"Invoice #{inv_match.group(1)}")
        if amt_match: details.append(f"${amt_match.group(1)}")
        return f"Invoice notification: {', '.join(details) if details else 'see body'}"
    if 'meeting' in subj.lower() or 'invitation' in subj.lower():
        return f"Calendar meeting invitation: {subj}"
    if 'standup' in subj.lower(): return "Weekly standup meeting invitation/update."
    if 'estimation' in subj.lower(): return "Project estimation/scoping discussion."
    if 'receipt' in subj.lower(): return "Payment receipt notification."
    if 'contract' in subj.lower() or 'agreement' in subj.lower(): return "Legal/contractual document."
    if 'performance' in subj.lower() or 'account report' in body_lower[:500]: return "Performance review or account report."
    if 'spreadsheet shared' in subj.lower(): return "Shared Google spreadsheet notification."
    lines = [l.strip() for l in body.split('\n') if l.strip()]
    for l in lines[:10]:
        if len(l) > 30 and not l.startswith(('http', '<', 'On ', '>', '*')):
            return l[:200] + ('...' if len(l) > 200 else '')
    return subj or '(no content)'

def process_dir(input_dir, accumulator):
    """Walk a directory of .eml files."""
    for fname in sorted(os.listdir(input_dir)):
        if not fname.endswith('.eml'): continue
        fp = os.path.join(input_dir, fname)
        try:
            with open(fp, 'rb') as f:
                msg = email.message_from_binary_file(f, policy=email.policy.default)
            for parsed in walk_msg(msg):
                parsed['source_file'] = fname
                accumulator.append(parsed)
        except Exception as e:
            print(f"  ERROR parsing {fname}: {e}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input-dirs', nargs='+', required=True)
    ap.add_argument('--out', required=True, help='forensic-output root directory')
    args = ap.parse_args()

    out_root = args.out
    interim = os.path.join(out_root, '_intermediate')
    indiv = os.path.join(out_root, 'individual-messages')
    threads = os.path.join(out_root, 'threads')
    for d in [interim, indiv, threads]:
        os.makedirs(d, exist_ok=True)

    # Step 1: Walk all input dirs and accumulate raw messages
    raw = []
    for d in args.input_dirs:
        if os.path.isdir(d):
            print(f"Processing {d}")
            process_dir(d, raw)
        else:
            print(f"Skipping (not a directory): {d}")
    print(f"Total raw messages: {len(raw)}")

    # Step 2: Dedupe by Message-ID, then by content hash
    seen, unique = set(), []
    for m in raw:
        mid = (m.get('message_id') or '').strip()
        if mid:
            key = mid
        else:
            body = (m.get('body_text') or '') or (m.get('body_html') or '')
            key = hashlib.md5(f"{m.get('subject','')[:100]}|{m.get('from','')}|{m.get('date','')}|{body[:200]}".encode('utf-8','replace')).hexdigest()
        if key in seen: continue
        seen.add(key)
        unique.append(m)
    print(f"After dedup: {len(unique)}")

    # Step 3: Parse dates, enrich
    for m in unique:
        try:
            dt = parsedate_to_datetime(m.get('date', ''))
            m['_dt'] = dt.isoformat() if dt else None
        except Exception:
            m['_dt'] = None
        m['_from_email'] = get_email_addr(m.get('from', ''))
        m['_subject_clean'] = re.sub(r'^(Re:|Fwd?:|RE:|FWD?:)\s*', '', (m.get('subject') or '').strip(), flags=re.IGNORECASE)
        body = (m.get('body_text') or '').strip()
        if not body or len(body) < 50:
            body = html_to_text(m.get('body_html', ''))
        m['_body'] = body
        m['_summary'] = make_summary(m)

    have_date = sorted([m for m in unique if m['_dt']], key=lambda m: m['_dt'])
    no_date = [m for m in unique if not m['_dt']]
    print(f"With valid date: {len(have_date)}; without: {len(no_date)}")

    # Step 4: Assign M-#### IDs and emit individual files
    for i, m in enumerate(have_date, 1):
        m['_id'] = f"M-{i:04d}"
        sender = sanitize_for_filename(m['_from_email'])
        fpath = os.path.join(indiv, f"{m['_id']}-{sender}.md")
        dt = m['_dt']
        try:
            d_obj = datetime.fromisoformat(dt)
            d_str = d_obj.strftime('%Y-%m-%d')
            t_str = d_obj.strftime('%H:%M:%S')
            tz = d_obj.strftime('%z') or 'UTC'
        except Exception:
            d_str, t_str, tz = dt[:10], dt[11:19], 'UTC'
        atts = m.get('attachments') or []
        att_str = '; '.join(a.get('filename', '') for a in atts) if atts else '(none)'
        body_out = m['_body'][:30000] + ('\n\n[... truncated ...]' if len(m['_body']) > 30000 else '')
        headmatter = f"""---
id: {m['_id']}
from: {(m.get('from','')).replace(chr(10),' ').strip()}
to: {(m.get('to','')).replace(chr(10),' ').strip()}
cc: {(m.get('cc','')).replace(chr(10),' ').strip()}
bcc: {(m.get('bcc','')).replace(chr(10),' ').strip()}
date: {d_str}
time: {t_str}
timezone: {tz}
subject: {(m.get('subject') or '').replace(chr(10),' ').strip()}
attachments: {att_str}
summary: |
  {m['_summary'].replace(chr(10),' ')}
---

# {(m.get('subject') or '(no subject)').strip()}

**From:** {m.get('from','')}  
**To:** {m.get('to','')}  
**Date:** {d_str} {t_str} {tz}

---

{body_out}
"""
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(headmatter)
    print(f"Wrote {len(have_date)} individual message files")

    # Step 5: Build threads
    by_subject = defaultdict(list)
    for m in have_date:
        key = m['_subject_clean'].strip().lower() or f"_no_subject_{m['_id']}"
        by_subject[key].append(m)
    multi = {k: v for k, v in by_subject.items() if len(v) >= 2}
    sorted_threads = sorted(multi.items(), key=lambda kv: min(m['_dt'] for m in kv[1]))
    for idx, (key, tmsgs) in enumerate(sorted_threads, 1):
        tid = f"T-{idx:04d}"
        tmsgs.sort(key=lambda m: m['_dt'])
        first = tmsgs[0]
        subj = first.get('subject', '').strip() or '(no subject)'
        subj_slug = re.sub(r'[^a-zA-Z0-9\-_]+', '-', subj).strip('-')[:60]
        fpath = os.path.join(threads, f"{tid}-{subj_slug}.md")
        participants = sorted({m['_from_email'] for m in tmsgs if m['_from_email']})
        first_dt, last_dt = first['_dt'][:10], tmsgs[-1]['_dt'][:10]
        mids = [m['_id'] for m in tmsgs]
        summary = f"Thread of {len(tmsgs)} messages between {', '.join(participants)} from {first_dt} to {last_dt}. Topic: {first['_summary']}"
        lines = [
            '---', f'id: {tid}', f'subject: {subj.replace(chr(10)," ").strip()}',
            f'first_date: {first_dt}', f'last_date: {last_dt}',
            f'message_count: {len(tmsgs)}', f'participants: {", ".join(participants)}',
            f'message_ids: {", ".join(mids)}', 'summary: |',
            f'  {summary.replace(chr(10)," ")}', '---', '',
            f'# Thread: {subj}', '', f'**Participants:** {", ".join(participants)}  ',
            f'**Date range:** {first_dt} to {last_dt}  ',
            f'**Messages:** {len(tmsgs)}', '', '---', '',
        ]
        for m in tmsgs:
            try:
                d_obj = datetime.fromisoformat(m['_dt'])
                d_str = d_obj.strftime('%Y-%m-%d %H:%M:%S %z')
            except Exception:
                d_str = m['_dt']
            body = m.get('_body', '') or '(no body)'
            if len(body) > 8000: body = body[:8000] + '\n\n[... truncated ...]'
            lines.extend([
                f"## {m['_id']} — {d_str}",
                f"**From:** {m.get('from','')}  ",
                f"**To:** {m.get('to','')}  ",
                f"**CC:** {m.get('cc','')}  " if m.get('cc') else '',
                '', body, '', '---', '',
            ])
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(l for l in lines if l is not None))
    print(f"Wrote {len(sorted_threads)} thread files")

    # Step 6: Save intermediate JSON
    with open(os.path.join(interim, 'processed.json'), 'w') as f:
        json.dump({'have_date': have_date, 'no_date': no_date}, f, indent=2, default=str)
    
    # Step 7: Email metadata summary
    senders = Counter(m['_from_email'] for m in have_date)
    stripe_accounts = set()
    for m in have_date:
        body = m.get('_body', '')
        for sa in re.findall(r'acct_[A-Za-z0-9]{16,}', body):
            stripe_accounts.add(sa)
    meta = {
        'total_messages': len(have_date),
        'date_range': [have_date[0]['_dt'][:10], have_date[-1]['_dt'][:10]] if have_date else None,
        'top_senders': [{'email': e, 'count': c} for e, c in senders.most_common(20)],
        'stripe_account_ids_observed': sorted(stripe_accounts),
        'thread_count': len(sorted_threads),
    }
    with open(os.path.join(interim, 'email-meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)
    print("Email metadata:")
    print(json.dumps(meta, indent=2))

if __name__ == '__main__':
    main()
