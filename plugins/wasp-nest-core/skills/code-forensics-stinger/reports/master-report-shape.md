# Master Report Shape

This folder is where the final master report and supporting deliverables land when the Angel completes a case. The `scripts/build_master_report.js` Node builder writes `{ProjectName}_Forensic_Report.docx` into a case's `forensic-output/` folder, then LibreOffice headless converts it to PDF.

The expected output structure (this is what "done" looks like for a case):

```
forensic-output/
├── {ProjectName}_Forensic_Report.docx
├── {ProjectName}_Forensic_Report.pdf
├── {ProjectName}_Agency_Forensic_Report.docx
├── {ProjectName}_Agency_Forensic_Report.pdf
├── {ProjectName}_Attorney_Legal_Memo.docx
├── {ProjectName}_Attorney_Legal_Memo.pdf
├── {ProjectName}_Plain_Language_Report.docx
├── {ProjectName}_Plain_Language_Report.pdf
├── invoices/
│   └── {ProjectName}_Invoice_Forensics.xlsx
├── pre-litigation-pack/
│   ├── 00_Cover_and_Instructions.docx/.pdf
│   ├── 01_Findings_Notice_{Defendant1}.docx/.pdf
│   ├── 02_Findings_Notice_{Defendant2}.docx/.pdf
│   ├── 03_Demand_Letter_{Defendant1}.docx/.pdf
│   ├── 04_Demand_Letter_{Defendant2}.docx/.pdf
│   ├── 05_Termination_Notice_{Defendant1}.docx/.pdf
│   └── 06_Termination_Notice_{Defendant2}.docx/.pdf
├── individual-messages/   (M-#### markdown files)
├── threads/               (T-#### markdown files)
├── legal/                 (original contracts, MSAs)
├── invoices/{defendant1}/ (raw PDFs and .eml files)
├── invoices/{defendant2}/
├── other-attachments/     (videos, performance reports)
├── reports/               (third-party technical audits)
├── case-facts.json
└── README.md
```

Plus a final `{ProjectName}_Forensic_Packet_{YYYYMMDD}.zip` at the parent directory level for delivery.

## Past runs

This folder is also where summaries of completed runs accumulate over time. When a case finishes, drop a one-page summary here named `{ProjectName}_{YYYYMMDD}_summary.md` capturing:

- Final headline numbers (documented + extrapolated, damages range)
- The 3 most powerful findings
- Lessons learned that should be folded back into the next iteration of the Stinger

The Example Booking Co. V3 summary serves as the first entry. Future cases (Pioneer AMS, etc.) will add their own.

For the structure of the actual master report (what each section contains), see `templates/reports/master-report-skeleton.md`.
