#!/usr/bin/env python3
"""
extrapolate_recurring.py — Apply the first-and-last-observed extrapolation rule to recurring invoices.

For each (vendor, item, price) bucket:
  1. Find first observed invoice
  2. Find last observed invoice
  3. Generate one monthly invoice for every missing month between (inclusive)
  4. Number them UNK-001, UNK-002, ... globally

Usage:
    python extrapolate_recurring.py \
        --ada forensic-output/_intermediate/ada_invoices.json \
        --devpipe forensic-output/_intermediate/devpipe_invoices.json \
        --out forensic-output/_intermediate/extrapolated.json \
        [--extend-final-cycle YYYY-MM-DD]

The --extend-final-cycle flag adds ONE more synthetic invoice for the Platinum Maintenance series
at the specified date (Example Booking Co.: --extend-final-cycle 2026-04-02).
"""
import argparse, json, re, calendar
from datetime import datetime
from collections import defaultdict

RECUR_PATTERNS = re.compile(r'\b(monthly|hosting|workspace|gsuite|assistant|social media management|silver|subscription|platinum)\b', re.I)

def clean_item_desc(desc):
    desc = re.sub(r'\s*\(\d{1,2}/\d{1,2}/\d{4}\s*-\s*\d{1,2}/\d{1,2}/\d{4}\)\s*', '', desc or '')
    desc = re.sub(r'\s+\w{3}\s+\d{1,2}\s*[\-–]\s*\w{3}\s+\d{1,2},?\s+\d{4}', '', desc)
    return desc.strip()

def is_recurring(desc):
    return bool(RECUR_PATTERNS.search(desc))

def monthly_dates(start_str, end_str, day_of_month=None):
    start = datetime.strptime(start_str, '%Y-%m-%d')
    end = datetime.strptime(end_str, '%Y-%m-%d')
    if day_of_month is None: day_of_month = start.day
    dates = []
    y, m = start.year, start.month
    while (y, m) <= (end.year, end.month):
        max_day = calendar.monthrange(y, m)[1]
        actual_day = min(day_of_month, max_day)
        dates.append(datetime(y, m, actual_day).strftime('%Y-%m-%d'))
        if m == 12: y += 1; m = 1
        else: m += 1
    return dates

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ada', required=True)
    ap.add_argument('--devpipe', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--extend-final-cycle', help='ISO date YYYY-MM-DD for an extra Platinum Maintenance cycle')
    args = ap.parse_args()
    
    ada = json.load(open(args.ada))
    val = json.load(open(args.devpipe))
    
    flat = []
    for inv in ada:
        for it in inv['items']:
            flat.append({
                'date': inv['issued'] or inv['date_received'],
                'vendor': inv['vendor'],
                'item': clean_item_desc(it['description']),
                'amount': it['amount'],
                'invoice': inv['invoice_number'],
            })
    for inv in val:
        if inv['is_receipt']: continue
        for it in inv['items']:
            flat.append({
                'date': inv['issued'],
                'vendor': inv['vendor'],
                'item': clean_item_desc(it['description']),
                'amount': it['amount'],
                'invoice': inv['invoice_number'] or f"PDF:{inv['pdf_file']}",
            })
    
    groups = defaultdict(list)
    for r in flat:
        if not is_recurring(r['item']): continue
        groups[(r['vendor'], r['item'], r['amount'])].append(r)
    
    print(f"Recurring buckets: {len(groups)}")
    
    unk_counter = 1
    extrapolated = []
    for (vendor, item, amount), occs in groups.items():
        occs_sorted = sorted(occs, key=lambda x: x['date'])
        first = occs_sorted[0]['date']
        last = occs_sorted[-1]['date']
        expected = monthly_dates(first, last)
        existing_ym = {d['date'][:7] for d in occs_sorted}
        for d in expected:
            ym = d[:7]
            if ym in existing_ym: continue
            extrapolated.append({
                'date': d, 'vendor': vendor, 'item': item, 'amount': amount,
                'invoice': f'UNK-{unk_counter:03d}', 'qty': 1,
                'is_extrapolated': True,
                'reason': f'Extrapolated: continuous monthly billing between observed {first} and {last}',
            })
            unk_counter += 1
        print(f"  {vendor[:25]:25s} | {item[:40]:40s} | ${amount:8.2f} | first {first} | last {last} | obs {len(occs_sorted)}")
    
    # Optional: extend the Platinum Maintenance series by one more cycle
    if args.extend_final_cycle:
        platinum = [k for k in groups if 'platinum' in k[1].lower()]
        if platinum:
            pk = platinum[0]
            extrapolated.append({
                'date': args.extend_final_cycle, 'vendor': pk[0], 'item': pk[1], 'amount': pk[2],
                'invoice': f'UNK-{unk_counter:03d}', 'qty': 1,
                'is_extrapolated': True,
                'reason': f'Extrapolated: final cycle per user direction (extends past last documented)',
            })
            unk_counter += 1
            print(f"  Added final Platinum cycle at {args.extend_final_cycle}")
    
    print(f"\nTotal UNK invoices: {len(extrapolated)}")
    print(f"Total UNK value: ${sum(e['amount'] for e in extrapolated):,.2f}")
    
    with open(args.out, 'w') as f:
        json.dump(extrapolated, f, indent=2)

if __name__ == '__main__':
    main()
