# Example: Rejection Recovery: Guideline 2.1 (Binary Quality)

*Demonstrates: rejection diagnosis, two-interpretation protocol, remediation, successful resubmission*
*Guides referenced: `guides/03-rejection-playbook.md`, `guides/00-principles.md`*

---

## Scenario

**App:** "NutriLog", a meal tracking app with barcode scanning
**Platform:** iOS
**Submission history:** First submission, rejected
**Rejection received:** Day 4 after submission

---

## The rejection notice

```
Guideline 2.1 - Performance - App Completeness

We discovered one or more bugs in your app when reviewed on iPhone running iOS 18.3.1.

Specifically, tapping the barcode scanner button on the main logging screen causes the 
app to crash.

Next Steps

Please review the details below, resolve the issues, and resubmit your app for review.

Please ensure you have thoroughly tested your submission for iOS 18.3.1 on the devices 
listed above. If we misunderstood the intended behavior of your app, please reply to 
this message in Resolution Center to provide information on how this feature is 
intended to work.
```

---

## Step 1: Do NOT re-submit yet

Two interpretations of this rejection:

**Interpretation A:** There is a genuine crash in the barcode scanner on iOS 18.3.1 that was not present in testing.

**Interpretation B:** The reviewer encountered a permission flow issue: the first time the camera permission dialog appears, the app crashed or the scanner view dismissed unexpectedly. This is distinct from a "crash" in the crash log sense.

---

## Step 2: Reproduce the issue

Developer opens NutriLog on:
- iPhone 15 Pro (iOS 18.3.1), fresh install, no prior permissions granted

**Result:** On first tap of barcode scanner:
1. `AVCaptureSession` permission dialog appears
2. User dismisses without granting permission
3. App attempts to initialize `AVCaptureSession` before the permission result callback
4. App crashes (EXC_CRASH)

This is **Interpretation B**: a permission callback race condition, not a general barcode scanner crash.

The crash was not caught in testing because the test device had camera permission already granted from a prior development build.

---

## Step 3: Fix

```swift
// BEFORE (crashes on first launch if permission not yet granted)
func setupCaptureSession() {
    captureSession = AVCaptureSession()
    guard let camera = AVCaptureDevice.default(for: .video) else { return }
    // ... continues without checking authorization
}

// AFTER (check authorization before attempting session setup)
func setupCaptureSession() {
    let authStatus = AVCaptureDevice.authorizationStatus(for: .video)
    switch authStatus {
    case .authorized:
        startCaptureSession()
    case .notDetermined:
        AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
            if granted {
                DispatchQueue.main.async { self?.startCaptureSession() }
            } else {
                DispatchQueue.main.async { self?.showPermissionDeniedAlert() }
            }
        }
    case .denied, .restricted:
        showPermissionDeniedAlert()
    @unknown default:
        break
    }
}
```

---

## Step 4: Reply to review team before re-submitting

In Resolution Center, reply:

```
Hi App Review Team,

Thank you for the detailed report. We reproduced the issue on iOS 18.3.1:

The crash occurs on the very first launch when the camera permission has not yet been 
granted. Our AVCaptureSession initialization was not guarded against the 
`.notDetermined` authorization state — the session attempted to start before the user 
responded to the permission dialog.

We have fixed the authorization state check in our camera setup flow. The fix:
1. Checks `AVCaptureDevice.authorizationStatus` before starting the session
2. Requests permission asynchronously and only starts the session after authorization
3. Shows a graceful "Camera access needed" alert when permission is denied

We will upload the fix and resubmit within 24 hours. The attached video (capture-fix.mp4)
shows the corrected flow on a fresh install on iPhone 15 Pro iOS 18.3.1.

Thank you,
NutriLog Dev Team
```

---

## Step 5: Resubmit

New build uploaded. Submission requeued.

Timeline: 1 business day (update review)

---

## Result: Approved

NutriLog approved on second submission. Total time from original submission to approval: 6 business days (4 days review + 1 day fix + 1 day re-review).

---

## What the two-interpretation protocol prevented

If the developer had assumed Interpretation A (general crash) and spent 2 days adding defensive null checks throughout the barcode scanner feature, they would have:
1. Uploaded a build that still crashed on first launch
2. Received a second rejection for the same issue
3. Lost an additional 4-5 days

The two-interpretation protocol cost 2 hours of targeted testing and saved approximately 1 week of delays.
