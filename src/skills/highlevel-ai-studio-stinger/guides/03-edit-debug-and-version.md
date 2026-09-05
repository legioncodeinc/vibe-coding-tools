# Edit, debug, and version an AI Studio project

Choose the smallest editing mode that can make the requested change.

## 1. Select the editing mode

| Change | Preferred mode |
|---|---|
| Broad page, route, content, or behavior change | Conversational prompt |
| Precise text, button, icon, image, spacing, color, border, shadow, or container change | Visual Edits |
| TypeScript, JSX, CSS, JSON, component, route, or build repair | Code Editor |

AI Studio currently exposes all three modes, with different save and usage behavior. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-visual-edits.md], [../references/research/raw/ai-studio-code-editor.md]

## 2. Make conversational changes narrowly

Name the route and section, state what must remain unchanged, and ask for a change summary. Use one major concern per prompt when the result needs precise review. Each AI-generated change creates a version. [../references/research/raw/ai-studio-overview.md]

## 3. Use Visual Edits for deterministic polish

1. Open the project.
2. Select `Visual Edits` in the lower-left prompt area.
3. Click the target element or double-click text for inline editing.
4. Adjust the contextual controls or select one or more elements and send a targeted prompt.
5. Review the preview.
6. Select `Save` to apply the change or `Discard` to abandon it.

Direct Visual Edit controls do not invoke the AI model or consume tokens. A prompt does. Leaving Visual Edits without saving discards the changes. [../references/research/raw/ai-studio-visual-edits.md]

## 4. Use the Code Editor for direct control

1. Open the project and select `Code`.
2. Use the file tree, current-file Find and Replace, or global project search to locate the smallest responsible file.
3. Edit only the requested behavior.
4. Select `Save`.
5. Confirm the live preview refreshes and the build succeeds.
6. If the build fails, open `Details`, read the exact error, and either make a bounded repair or use `Try to fix`.
7. Re-test affected routes and interactions.

The CodeMirror editor supports TypeScript, JSX, CSS, JSON, and other text files used by the project. It detects routes, warns about unsaved changes, and creates a version on each save. [../references/research/raw/ai-studio-code-editor.md]

## 5. Use version history as a release control

Before a risky change, open Version History and bookmark the accepted version. After a change, compare the preview with the accepted state. Restore an earlier version when the new result regresses behavior or design. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/highlevel-blog-ai-studio-draft-mode.md]

## 6. Keep preview and production state distinct

`Save` in the Code Editor updates preview and creates a version. It does not update the public site. Visual changes and prompt changes can also remain draft work. Publish again only after the applicable checks in [../references/publish-qa-checklist.md] pass. [../references/research/raw/ai-studio-code-editor.md], [../references/research/raw/ai-studio-overview.md]

## 7. Escalate security-sensitive changes

Do not place credentials, private tokens, or secrets in client-side project files. Send generated-code security review, third-party dependency review, sensitive form-data review, and script provenance review to `security-stinger` before release.
