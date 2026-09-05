# EU AI Act — Article 50 transparency obligations, and Article 113 application dates

- URL: https://artificialintelligenceact.eu/article/50/ and https://artificialintelligenceact.eu/article/113/
- Fetched: 2026-08-17
- Source type: legal

Instrument: **Regulation (EU) 2024/1689** (the AI Act), published in the Official Journal
**12 July 2024**. EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj

> Accessibility note: the EUR-Lex full-text HTML
> (`https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689`) fetched but is so
> large that the extraction returned only fragments and paraphrase that did not match the true
> article text. Treat EUR-Lex as **partially inaccessible via WebFetch**; the substantive
> content below comes from artificialintelligenceact.eu, which republishes the consolidated
> text. Verify verbatim wording against EUR-Lex before quoting in a legal context.

## Status as of 17 August 2026

**Article 50 is IN FORCE.** Chapter IV (Transparency obligations), which contains Article 50,
is not carved out by the phased provisions of Article 113, so it falls under the Regulation's
general application date of **2 August 2026** — fifteen days before this research date.

## Article 113 — Entry into force and application

> "This Regulation shall enter into force on the twentieth day following that of its
> publication in the Official Journal of the European Union. It shall apply from
> **2 August 2026**."

Phased exceptions:

| Date | What applies |
|---|---|
| **2 February 2025** | "Chapters I and II shall apply from 2 February 2025" — general provisions and the Article 5 prohibited-practices list |
| **2 August 2025** | "Chapter III Section 4, Chapter V, Chapter VII and Chapter XII and Article 78 shall apply from 2 August 2025, with the exception of Article 101" — notified bodies, GPAI models, governance, penalties |
| **2 August 2026** | **General application date for the Regulation as a whole, including Chapter IV / Article 50** |
| **2 August 2027** | "Article 6(1) and the corresponding obligations in this Regulation shall apply from 2 August 2027" — high-risk classification for products under sectoral safety legislation |

## Article 50 — Transparency obligations for providers and deployers of certain AI systems

**Paragraph 1 — direct interaction.** Providers must ensure AI systems intended to interact
directly with natural persons are designed so that the persons concerned are informed they are
interacting with an AI system, unless this is obvious to a reasonably well-informed observer.
Exemption for AI systems authorised by law to detect, prevent, investigate or prosecute
criminal offences, subject to safeguards — unless the system is available to the public to
report a criminal offence.

**Paragraph 2 — machine-readable marking of synthetic content.** THE KEY PROVISION FOR IMAGES.
Providers of AI systems (including general-purpose AI systems) generating **synthetic audio,
image, video or text** content shall ensure the **outputs are marked in a machine-readable
format and detectable as artificially generated or manipulated**. Providers shall ensure
their technical solutions are **"effective, interoperable, robust and reliable as far as this
is technically feasible"**, taking into account the specificities and limitations of various
content types, implementation costs, and generally acknowledged state of the art (as may be
reflected in relevant technical standards).

Exemptions from paragraph 2: where the AI systems perform an **assistive function for standard
editing** or do not substantially alter the input data provided by the deployer or its
semantics; and law-enforcement systems authorised by law.

*Note: this obligation falls on the **provider** of the generative system (the model/tool
vendor), not on the end user. It is an obligation to mark at generation time. C2PA Content
Credentials and IPTC DigitalSourceType in XMP are the two mechanisms the industry is using to
satisfy "machine-readable format".*

**Paragraph 3 — emotion recognition / biometric categorisation.** Deployers must inform exposed
natural persons and process personal data in accordance with the GDPR and related regulations.
Law-enforcement exemptions with safeguards.

**Paragraph 4 — deepfakes.** THE KEY PROVISION FOR DEPLOYERS/PUBLISHERS.
Deployers of an AI system that generates or manipulates image, audio or video content
constituting a **deepfake** shall **disclose that the content has been artificially generated
or manipulated**.

Exemptions: where use is authorised by law for criminal-justice purposes; and where the content
forms part of an **evidently artistic, creative, satirical, fictional or analogous work or
programme**, in which case the transparency obligation is limited to disclosing the existence
of such generated content **in an appropriate manner that does not hamper the display or
enjoyment of the work**.

For **AI-generated or manipulated text published to inform the public on matters of public
interest**, deployers must disclose that it is artificially generated — unless the content has
undergone **human review or editorial control** and a natural or legal person holds editorial
responsibility for publication, or the use is law-enforcement authorised.

**Paragraph 5 — manner of disclosure.** Information under paragraphs 1, 3 and 4 must be
provided to the persons concerned **clearly and distinguishably at the latest at the time of
the first interaction or exposure**, and must conform to applicable accessibility requirements.

**Paragraph 6 — no derogation.** Paragraphs 1 to 4 do not affect the requirements and
obligations of Chapter III (high-risk systems) and are without prejudice to other transparency
obligations in Union or national law.

**Paragraph 7 — codes of practice.** The **AI Office** shall encourage and facilitate the
drawing up of **codes of practice at Union level** to facilitate the effective implementation of
obligations regarding the detection and labelling of artificially generated or manipulated
content. The Commission may adopt implementing acts to approve such codes; if a code is not
adequate, the Commission may specify common rules by implementing act.

## Practical takeaway for image work

- A photograph made with a camera is **not** in scope of Art. 50(2)/(4) at all — the obligations
  attach to AI-generated or AI-manipulated content.
- There is **no EU legal obligation to mark a real photograph as real**. Writing
  `digitalCapture` into DigitalSourceType is voluntary good practice, not compliance.
- Conversely there is now (since 2 Aug 2026) a binding obligation on generative-AI providers to
  machine-readably mark synthetic output, and on deployers to disclose deepfakes.
- "Assistive function for standard editing" is the exemption that ordinary retouching relies on;
  generative fill that substantially alters semantics does not clearly fall within it.
