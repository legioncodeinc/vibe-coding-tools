# Template: Scheduled Maintenance Window

*Incident type: Scheduled Maintenance*
*Send 7 days, 24 hours, and 1 hour before the window start*

---

**[SCHEDULED MAINTENANCE] [Component name] - [Brief description]**

We have scheduled maintenance on [component/feature] for **[DATE] from [START TIME] to [END TIME] UTC**.

**What to expect during this window:**
- [Describe impact: "Service will be in read-only mode" / "API response times may be elevated" / "Logins will be unavailable"]
- [Any specific restrictions: "No new deployments can be created during this window"]

**What you need to do:** [Either "No action required" OR specific preparation steps.]

If the maintenance completes before [END TIME] UTC, we will post a resolution notice and the window will close early. If we need to extend beyond [END TIME] UTC, we will notify you immediately.

Status updates will be posted at **[your status page URL]**.

---

<!-- Fill-in guide:
- Window sizing rule: Announce a window 50-100% longer than your expected completion time.
  If the migration takes 1 hour, announce 1.5-2 hours. Completing early is a positive surprise.
- [DATE]: Use the format "Wednesday, May 21, 2026", not just "05/21/26"
- [START TIME] to [END TIME] UTC: Always include UTC. Include local times for major geographies if your user base is concentrated.
- [What to expect]: Be specific about degradation level:
  DEGRADED = slower, some features unavailable
  READ-ONLY = no writes accepted
  UNAVAILABLE = fully down
- Send this 7 days before as the initial announcement.
  Resend 24 hours before as a reminder. 
  Send a final reminder 1 hour before.
-->
