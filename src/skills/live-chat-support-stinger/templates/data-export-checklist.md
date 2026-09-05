# Template: Day-1 Data Export Setup Checklist

Complete this checklist when onboarding a new support platform. Keep the completed copy in your internal docs.

---

**Platform:** _______________  
**Date onboarded:** _______________  
**Completed by:** _______________

---

## Section 1: Export path verification

- [ ] Tested manual conversation export. Format: _____ (CSV / JSON)
- [ ] Export includes: full message bodies [ ] contact records [ ] notes [ ]
- [ ] Export method is self-service (no support ticket needed): Yes / No
- [ ] Export documentation link: _____

## Section 2: Continuous / automated export

- [ ] Set up continuous export (Intercom S3, scheduled API script, or webhook stream): Yes / No / Not available
- [ ] Export destination: _____ (S3 bucket / internal database / file storage)
- [ ] Test export ran successfully on: _____

## Section 3: GDPR Article 20 procedure

- [ ] Written the internal SOP: "When a customer submits a GDPR portability request, here's how to export their data within 30 days."
- [ ] SOP location: _____
- [ ] Responsible person: _____

## Section 4: GDPR deletion test

- [ ] Created a test contact with sample data.
- [ ] Initiated deletion of test contact.
- [ ] Confirmed contact and all associated conversations are deleted.
- [ ] Confirmed deletion is reflected in any continuous export destination.

## Section 5: Retention policy

- [ ] Active conversation retention: _____ (e.g., indefinite / 3 years)
- [ ] Archive policy: _____ (e.g., export to cold storage after 2 years)
- [ ] Platform auto-deletion settings reviewed: Yes / No

## Section 6: Legal / compliance notification

- [ ] Forwarded "data held by support platform" summary to legal/compliance team.
- [ ] Privacy policy updated to mention support platform data (if required): Yes / No / N/A

---

## Platform-specific notes

_Add any platform-specific export quirks, limitations, or required configurations here._
