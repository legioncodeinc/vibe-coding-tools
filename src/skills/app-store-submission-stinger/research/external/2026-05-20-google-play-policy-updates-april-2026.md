---
source_url: https://support.google.com/googleplay/android-developer/answer/16926792
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: google-play-policy
stinger: app-store-submission-stinger
---

# Policy Announcement: April 15, 2026 | Google Play Console Help

## Summary
Official Google Play policy announcement dated April 15, 2026, introducing three new and updated policies with compliance deadlines in late 2026. Covers: (1) Contacts Permissions policy requiring use of Android Contact Picker for broad contact access; (2) Location Permissions policy introducing a location button as minimum scope for precise location; (3) Account Transfer policy mandating the official transfer workflow in Play Console. Also includes clarifications to Photo/Video permissions, Age-Restricted Content, and Health/Fitness data policies for Android 16.

## Key quotations / statistics
- **Contacts Permissions (effective October 28, 2026):** "Apps that don't need broad access must use the Android Contact Picker, a more secure, easy-to-integrate alternative that minimizes data collection and improves user safety."
- **Location Permissions (effective October 28, 2026):** "We're introducing the location button as the recommended minimum scope for precise location in line with our user data and sensitive permissions requirements."
- **Account Transfer (effective May 27, 2026):** "Transferring account ownership through unofficial means is prohibited and includes, but is not limited to: Buying, leasing and selling accounts obtained through illegitimate means on third-party marketplaces."
- **Geofencing:** "We're removing geofencing as an approved foreground services use case. Developers can instead use the Geofence API for this use case."
- **Health data (Android 16):** "Newly supported Health Connect data types, including high-sensitivity categories like Menstrual Cycle Phases, Alcohol Consumption, and Symptoms. Additionally, clarified prohibited use cases to forbid the use of sensitive health data for determining employment or insurance eligibility, or for unauthorized social sharing."
- **Prediction markets pilot:** "Apps that wish to provide real-money functionalities for prediction markets must enroll in this pilot and meet its requirements by June 1, 2026."

## Annotations for stinger-forge
- This is primary source material for `guides/02-compliance-checklist.md`'s Android section. The October 28, 2026 deadlines for contacts and location are actionable compliance blockers that should appear in a dated compliance calendar.
- The geofencing change (removed as approved foreground services use case) is a breaking change for location-based apps: stinger-forge should surface this prominently.
- The health data policy update for Android 16 is especially important for healthcare and wellness apps; flag in the children's/sensitive-category section.
- Age-Restricted Content clarification: dating/matchmaking as an incidental feature no longer requires Restrict Minor Access if alternative age-gating is implemented: this resolves an edge case that trips up social apps.
