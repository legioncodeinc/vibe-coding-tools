# Task Mining (Celonis product documentation)

- **URL:** https://docs.celonis.com/en/task-mining.html
- **Fetched:** 2026-08-17
- **Source type:** official-docs (vendor product documentation)
- **Why archived:** The commercial definition of task mining, what data a production task
  mining product captures, and the privacy controls a vendor considers mandatory when
  capturing desktop activity. The privacy section is the directly transferable part: it is
  the same consent and redaction problem a capture-based skill suggester has.

## What task mining is, quoted

> "Task Mining is the process of capturing and analyzing how users interact with software
> applications and web pages."

The stated purpose: understand how specific tasks are performed, and identify process
inefficiencies and automation opportunities.

## What is captured

- Interactions with software applications such as Microsoft Office, Google Sheets and Adobe
  Acrobat.
- Optionally, screenshots of user desktops, and data captured from websites.

The documentation reviewed does not state whether keystrokes, window titles, or OCR are
captured. Treat that as unresolved rather than as a negative finding.

## How tasks are identified from the raw event stream

The documentation reviewed does not address this. Named as a gap.

## Privacy and anonymization controls, quoted

> "Advanced privacy features ensure only relevant user interaction data is captured,
> sensitive data is hidden and only approved individuals can view this information."

Additional stated controls:

- Organizations have full control over which potentially sensitive data is sent to the
  platform and which data is redacted and pseudonymized before sending.
- Users must consent to the capture of Task Mining data and can manually turn data capture
  off at any time.
- Applications and URLs can be allowlisted or denylisted.

## Relationship to process mining, quoted

> "Process Mining extracts business data from transactional systems, Task Mining generates
> detailed data from user actions"

Together these are described as providing the most detailed view possible of a process.
The division is the useful part: transactional systems show the process that a system
recorded, desktop capture shows the work that happened around it.
