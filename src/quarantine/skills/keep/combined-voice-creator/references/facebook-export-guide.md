# Facebook Data Export Guide

How to walk the user through exporting their Facebook data so it can be mined for their
voice skill. Follow this in order. Use the AskUserQuestion tool at every decision point
listed below, with the recommended answer as the FIRST option. Show the user the matching
screenshot from `../assets/` at each step so they can follow along visually.

## Step 1 - Initiate the export

Send the user to:

https://accountscenter.facebook.com/info_and_permissions/dyi/?entry_point=download_your_information&target_id

Walk them through the flow with the screenshots:

1. **Create export** - On the "Export your information" dialog, click **Create export**.
   Screenshot: `../assets/fb-export-step-01-create-export.png`
2. **Choose a profile** - Select their main **Facebook** profile (not Instagram, Meta, or
   Threads profiles).
   Screenshot: `../assets/fb-export-step-02-choose-profile.png`
3. **Choose where to export** - Select **Export to device**.
   Screenshot: `../assets/fb-export-step-03-export-to-device.png`
4. **Confirm your export screen** - Click **Customize information**.
   Screenshot: `../assets/fb-export-step-04-customize-information.png`
5. **Choose specific info to export** - Ask via AskUserQuestion which data to include
   (multiSelect). Options and guidance:
   - **Posts** (REQUIRED - the core voice corpus)
   - **Messages** (optional, recommended - adds DM/casual register)
   - **Profile information** (optional, recommended - adds biography guardrail facts)
   Everything else stays unchecked. Then Save.
   Screenshots: `../assets/fb-export-step-05-select-posts-messages.png` and
   `../assets/fb-export-step-06-profile-information.png`
6. **Back on the Confirm screen** - set the remaining three options, then Start export.
   Screenshot: `../assets/fb-export-step-07-format-and-quality.png`
   - **Date range**: ask via AskUserQuestion - "Last 6 months (Recommended for active
     posters)" or "Last year (better if you post a few times a week or less)".
   - **Format**: **JSON**. Not HTML. JSON is what the processing scripts parse. This is
     the single most common mistake - confirm it explicitly.
   - **Media quality**: **Lower**. Media gets deleted during processing anyway; a smaller
     zip uploads faster.

## Step 2 - Wait (async)

Facebook takes roughly 2-3 hours to build the export (sometimes minutes for small
accounts, up to a day for huge ones). The user gets a notification and an email when it's
ready. They only have FOUR DAYS to download it before it expires.

Tell the user to come back to this conversation (or start a new one and re-invoke this
skill) once they have the file. If they have Littlebird data or other work to do, proceed
with that in the meantime.

## Step 3 - Download and upload

1. Download the export .zip from the same Accounts Center page (or the notification).
2. Upload the .zip directly into Claude Cowork (drag and drop into the chat).

Then continue with `facebook-data-processing.md`.
