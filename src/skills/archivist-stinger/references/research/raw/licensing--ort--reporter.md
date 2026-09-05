# OSS Review Toolkit: Reporter
- URL: https://oss-review-toolkit.org/ort/docs/tools/reporter
- Fetched: 2026-09-05
- Source type: official-docs
- Extraction: HTML to text by script; navigation, scripts, and styles dropped; tables flattened with pipes

Reporter | OSS Review Toolkit

Skip to main content

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

# 

The reporter generates a wide variety of documents in different formats from ORT result files.
Currently, the following formats are supported (reporter names are case-insensitive):

- Audi Open Source Diagnostics (AOSD)

- Version 2.1 (`-f AOSD2.1`)

- AsciiDoc Template (`-f AsciiDocTemplate`)

- Customizable with Apache Freemarker templates and AsciiDoc

- PDF style customizable with Asciidoctor PDF themes

- Supports multiple AsciiDoc backends:

- PDF (`-f PdfTemplate`)

- HTML (`-f HtmlTemplate`)

- DocBook (`-f DocBookTemplate`)

- Man page (`-f ManPageTemplate`)

- ctrlX AUTOMATION platform FOSS information (`-f CtrlXAutomation`)

- CycloneDX BOM (`-f CycloneDx`)

- FossID report download

- HTML, SPDX, and Excel reports (`-f FossId`)

- Snippet report (`-f FossIdSnippet`)

- NOTICE file in two variants

- List license texts and copyrights by package (`-f PlainTextTemplate`)

- Summarize all license texts and copyrights (`-f PlainTextTemplate -O PlainTextTemplate=template.id=NOTICE_SUMMARY`)

- Customizable with Apache Freemarker templates

- OpossumUI input (`-f Opossum`)

- SPDX Document, version 2.2 (`-f SpdxDocument`)

- Static HTML (`-f StaticHtml`)

- TrustSource JSON file (`-f TrustSource`)

- Use this as an alternative to ts-scan for support of more build systems.

- Web App (`-f WebApp`)

- Also see the EvaluatedModelReporter (`-f EvaluatedModel`) which is the JSON / YAML format used by the Web App report that is also suitable for custom post-processing.

- 

- 

- 

- 

- 

- 

- 

-
