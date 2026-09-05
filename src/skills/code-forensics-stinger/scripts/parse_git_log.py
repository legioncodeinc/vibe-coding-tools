#!/usr/bin/env python3
"""
parse_git_log.py — Parse a git log into per-commit records with calibrated hour estimates.

First, in the repo:
    git log --all --pretty=format:'%H|%ai|%an|%ae|%s' --shortstat > /tmp/git_log.txt

Then:
    python parse_git_log.py \
        --input /tmp/git_log.txt \
        --out forensic-output/_intermediate/

Outputs:
    commits.json — per-commit records with est_hours
    git_by_month.json — monthly rollup
"""
import argparse, re, json, os
from collections import defaultdict

def estimate_hours(commit):
    """1 hour per 30 LOC, with category multipliers."""
    subject = commit['subject'].lower()
    net = commit['insertions'] + commit['deletions']
    if subject.startswith(('merge pull request', 'merge branch', 'merge remote')):
        return 0.1
    if commit['files_changed'] <= 2 and net <= 5:
        return 0.25
    multiplier = 1.0
    if 'migration' in subject: multiplier *= 1.5
    if 'model' in subject or 'schema' in subject: multiplier *= 1.5
    if 'test' in subject: multiplier *= 0.7
    if 'config' in subject or 'docker' in subject or 'requirement' in subject: multiplier *= 0.8
    if 'rename' in subject or 'typo' in subject or 'comment' in subject or 'readme' in subject:
        multiplier *= 0.3
    hours = max(0.25, (net / 30.0) * multiplier)
    return min(hours, 16.0)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    
    with open(args.input) as f:
        text = f.read()
    
    commits = []
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        if '|' in line and re.match(r'^[a-f0-9]{40}\|', line):
            parts = line.split('|', 4)
            if len(parts) == 5:
                c = {
                    'hash': parts[0], 'date': parts[1], 'author': parts[2],
                    'email': parts[3], 'subject': parts[4],
                    'files_changed': 0, 'insertions': 0, 'deletions': 0,
                }
                if i+1 < len(lines):
                    stats = lines[i+1].strip()
                    m = re.search(r'(\d+) files? changed', stats)
                    if m: c['files_changed'] = int(m.group(1))
                    m = re.search(r'(\d+) insertions?\(\+\)', stats)
                    if m: c['insertions'] = int(m.group(1))
                    m = re.search(r'(\d+) deletions?\(-\)', stats)
                    if m: c['deletions'] = int(m.group(1))
                    if c['files_changed'] > 0: i += 1
                commits.append(c)
        i += 1
    
    for c in commits:
        c['est_hours'] = round(estimate_hours(c), 2)
    
    print(f"Parsed {len(commits)} commits")
    print(f"Date range: {commits[-1]['date']} → {commits[0]['date']}" if commits else "No commits")
    
    by_month = defaultdict(lambda: {'commits': 0, 'insertions': 0, 'deletions': 0, 'hours': 0.0})
    for c in commits:
        ym = c['date'][:7]
        by_month[ym]['commits'] += 1
        by_month[ym]['insertions'] += c['insertions']
        by_month[ym]['deletions'] += c['deletions']
        by_month[ym]['hours'] += c['est_hours']
    
    total_hrs = sum(c['est_hours'] for c in commits)
    print(f"\nTotal estimated hours: {total_hrs:.1f}")
    print(f"At $100/hr: ${total_hrs*100:,.0f}")
    print(f"\nMonth   Commits  +LOC   -LOC   Hrs")
    for ym in sorted(by_month):
        m = by_month[ym]
        print(f"{ym}    {m['commits']:5d}  {m['insertions']:6d}  {m['deletions']:6d}  {m['hours']:6.1f}")
    
    with open(os.path.join(args.out, 'commits.json'), 'w') as f:
        json.dump(commits, f, indent=2)
    with open(os.path.join(args.out, 'git_by_month.json'), 'w') as f:
        json.dump(dict(by_month), f, indent=2)

if __name__ == '__main__':
    main()
