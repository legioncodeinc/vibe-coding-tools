#!/usr/bin/env python3
"""
parse_invoices.py — Parse PDF and email-body invoices from ADA and DevPipe/Offshore Build.

Usage:
    python parse_invoices.py \
        --processed-json forensic-output/_intermediate/processed.json \
        --pdf-dir forensic-output/invoices/devpipe/ \
        --out forensic-output/_intermediate/

Outputs:
    _intermediate/ada_invoices.json
    _intermediate/devpipe_invoices.json
    _intermediate/invoice_texts.json (raw text from each PDF)
"""
import argparse, os, json, re
from datetime import datetime
import pdfplumber

def parse_ada_from_emails(processed_path):
    """Parse ADA invoices from email bodies (Customer Invoice #NNNN emails)."""
    data = json.load(open(processed_path))
    msgs = data['have_date']
    invoices = []
    for m in msgs:
        frm = m['_from_email']
        subj = m.get('subject', '') or ''
        if frm not in ('admin@acmedigitalagency.example', 'robert@acmedigitalagency.example'):
            continue
        if 'invoice' not in subj.lower() or 'customer invoice' not in subj.lower():
            continue
        body = m.get('_body', '') or ''
        inv_num = None
        m_match = re.search(r'Invoice\s+#?(\d{4,})', body)
        if m_match: inv_num = m_match.group(1)
        amount = None
        a_match = re.search(r'Amount Due:\s*\$([\d,]+\.\d{2})', body)
        if a_match: amount = float(a_match.group(1).replace(',', ''))
        issued = None
        d_match = re.search(r'invoice has been generated on \w+, ([A-Z][a-z]+ \d+\w*, \d{4})', body)
        if d_match:
            try:
                ds = d_match.group(1).replace('st','').replace('nd','').replace('rd','').replace('th','')
                issued = datetime.strptime(ds, '%B %d, %Y').strftime('%Y-%m-%d')
            except Exception: pass
        items = []
        items_match = re.search(r'Invoice Items\s*(.+?)(?:Sub Total|Subtotal|------)', body, re.DOTALL | re.IGNORECASE)
        if items_match:
            for line in items_match.group(1).split('\n'):
                line = line.strip()
                if not line: continue
                li = re.match(r'^(.+?)\s+\$([\d,]+\.\d{2})\s*USD\s*$', line)
                if li:
                    items.append({'description': li.group(1).strip(), 'amount': float(li.group(2).replace(',', ''))})
        if inv_num:
            invoices.append({
                'invoice_number': inv_num, 'vendor': 'ADA / Northstar Holdings',
                'issued': issued or m['_dt'][:10], 'amount': amount, 'items': items,
                'subject': subj, 'date_received': m['_dt'][:10],
                'message_id': m.get('_id', ''),
            })
    return invoices

def parse_devpipe_pdfs(pdf_dir):
    """Parse DevPipe/Offshore Build PDF invoices."""
    invoices = []
    # First extract raw text from each PDF (for debugging too)
    all_texts = {}
    for fname in sorted(os.listdir(pdf_dir)):
        if not (fname.lower().startswith(('invoice-', 'receipt-')) and fname.endswith('.pdf')):
            continue
        fp = os.path.join(pdf_dir, fname)
        try:
            with pdfplumber.open(fp) as pdf:
                text = '\n'.join((p.extract_text() or '') for p in pdf.pages)
                all_texts[fname] = text
        except Exception as e:
            print(f"ERROR {fname}: {e}")
            continue
    
    # Dedupe: prefer files without _1, _2 suffixes
    def base_inv(f):
        m = re.match(r'(Invoice|Receipt)-([A-Z0-9]+-[\d]+)', f, re.IGNORECASE)
        return m.group(2) if m else None
    groups = {}
    for f in all_texts:
        b = base_inv(f)
        if b:
            groups.setdefault(b, []).append(f)
    canonical = []
    for b, fs in groups.items():
        canonical.append(sorted(fs, key=len)[0])
    
    for fname in canonical:
        text = all_texts[fname]
        is_receipt = 'receipt number' in text.lower()
        inv_match = re.search(r'Invoice number\s+([A-Z0-9]+\s\d+)', text)
        inv_num = inv_match.group(1).replace(' ', '-') if inv_match else None
        rec_match = re.search(r'Receipt number\s+([\d\- ]+)', text)
        rec_num = rec_match.group(1).strip().replace(' ', '-') if rec_match else None
        
        issued = None
        m1 = re.search(r'Date of issue\s+(\w+ \d+,\s*\d{4})', text)
        if m1:
            try: issued = datetime.strptime(m1.group(1).replace('  ',' '), '%B %d, %Y').strftime('%Y-%m-%d')
            except Exception: pass
        paid_date = None
        m2 = re.search(r'Date paid\s+(\w+ \d+,\s*\d{4})', text)
        if m2:
            try: paid_date = datetime.strptime(m2.group(1), '%B %d, %Y').strftime('%Y-%m-%d')
            except Exception: pass
        
        vendor = 'DevPipe LLC'
        if 'offshore-build software solutions' in text.lower():
            vendor = 'Offshore Build Group LLC'
        
        total = None
        t_match = re.search(r'Amount due\s+\$([\d,]+\.\d{2})\s*USD', text)
        if t_match: total = float(t_match.group(1).replace(',', ''))
        if not total:
            t_match = re.search(r'Amount paid\s+\$([\d,]+\.\d{2})', text)
            if t_match: total = float(t_match.group(1).replace(',', ''))
        
        items = []
        sec = re.search(r'Description Qty Unit price Amount\s*\n(.+?)Subtotal', text, re.DOTALL)
        if sec:
            buf = ''
            for line in sec.group(1).split('\n'):
                line = line.strip()
                if not line: continue
                buf = (buf + ' ' + line).strip() if buf else line
                m = re.search(r'^(.+?)\s+(\d+)\s+\$([\d,]+\.\d{2})\s+\$([\d,]+\.\d{2})\s*$', buf)
                if m:
                    items.append({
                        'description': m.group(1).strip(),
                        'qty': int(m.group(2)),
                        'unit_price': float(m.group(3).replace(',', '')),
                        'amount': float(m.group(4).replace(',', '')),
                    })
                    buf = ''
        
        invoices.append({
            'pdf_file': fname, 'invoice_number': inv_num, 'receipt_number': rec_num,
            'vendor': vendor, 'is_receipt': is_receipt, 'issued': issued, 'paid_date': paid_date,
            'total': total, 'items': items,
        })
    invoices.sort(key=lambda inv: inv['issued'] or '9999')
    return invoices, all_texts

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--processed-json', required=True)
    ap.add_argument('--pdf-dir', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    
    os.makedirs(args.out, exist_ok=True)
    
    print("Parsing ADA invoices from email bodies...")
    ada = parse_ada_from_emails(args.processed_json)
    print(f"  Parsed {len(ada)} ADA invoices")
    with open(os.path.join(args.out, 'ada_invoices.json'), 'w') as f:
        json.dump(ada, f, indent=2, default=str)
    
    print("Parsing DevPipe PDF invoices...")
    val, texts = parse_devpipe_pdfs(args.pdf_dir)
    print(f"  Parsed {len(val)} DevPipe/Offshore Build invoices")
    with open(os.path.join(args.out, 'devpipe_invoices.json'), 'w') as f:
        json.dump(val, f, indent=2, default=str)
    with open(os.path.join(args.out, 'invoice_texts.json'), 'w') as f:
        json.dump(texts, f, indent=2)
    
    total_ada = sum(inv['amount'] or 0 for inv in ada)
    total_val = sum(inv['total'] or 0 for inv in val if not inv['is_receipt'])
    print(f"\nTotal ADA documented: ${total_ada:,.2f}")
    print(f"Total DevPipe documented: ${total_val:,.2f}")

if __name__ == '__main__':
    main()
