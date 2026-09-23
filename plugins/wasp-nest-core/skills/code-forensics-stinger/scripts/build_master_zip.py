#!/usr/bin/env python3
"""
build_master_zip.py — Bundle the entire forensic-output/ folder into a single zip.

Usage:
    python build_master_zip.py \
        --src forensic-output \
        --project-name "Example Booking Co." \
        --out-dir /path/to/parent
"""
import argparse, os, zipfile
from datetime import datetime

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True, help='forensic-output directory')
    ap.add_argument('--project-name', required=True)
    ap.add_argument('--out-dir', required=True)
    args = ap.parse_args()
    
    slug = args.project_name.replace(' ', '_')
    date_stamp = datetime.now().strftime("%Y%m%d_%H%M")
    out_path = os.path.join(args.out_dir, f"{slug}_Forensic_Packet_{date_stamp}.zip")
    
    skip_patterns = ['.~lock.', '.tmp']
    def skip(name):
        for p in skip_patterns:
            if p in name: return True
        if name.startswith('lu') and name.endswith('.tmp'): return True
        return False
    
    count = 0
    bytes_total = 0
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, dirs, files in os.walk(args.src):
            dirs.sort(); files.sort()
            for f in files:
                if skip(f): continue
                full = os.path.join(root, f)
                arc = os.path.join(f'{slug}_Forensic_Packet', os.path.relpath(full, os.path.dirname(args.src)))
                try:
                    size = os.path.getsize(full)
                    zf.write(full, arc)
                    count += 1
                    bytes_total += size
                except Exception as e:
                    print(f"Skip {full}: {e}")
    print(f"Wrote {out_path}")
    print(f"Files: {count}; uncompressed: {bytes_total/1024/1024:.1f} MB; compressed: {os.path.getsize(out_path)/1024/1024:.1f} MB")

if __name__ == '__main__':
    main()
