# Data Processing Agreement (DPA): GDPR Article 28 Checklist

**Source:** `research/external/2026-05-20-dpa-gdpr-art28-template.md` + `research/external/2026-05-20-eu-us-dpf-cross-border-transfers.md`

---

## When a DPA is required

A DPA is required between a data controller (your customer) and a data processor (you, the SaaS vendor) whenever:

- You process personal data on behalf of the customer (GDPR Article 28)
- Your customer is subject to GDPR (EU/EEA established, or processes EU personal data)
- Your customer is subject to CCPA/CPRA (California) — CCPA requires a "Service Provider Agreement" with equivalent provisions
- Quebec Law 25 applies — requires a service agreement with data protection provisions

**Rule of thumb:** if you have any EU customers, enterprise customers, or customers who are healthcare/financial entities, you need a signed DPA before they can use your service.

---

## GDPR Article 28(3) mandatory clauses

All eight sub-clauses of GDPR Article 28(3) must appear in your DPA. No exceptions.

### 28(3)(a): Processing on documented instructions only

> Processor shall process personal data only on documented instructions from the controller, including with regard to transfers of personal data to a third country or an international organisation.

Practical implication: your Privacy Policy and this DPA together constitute the "documented instructions." Any out-of-band request to process data differently requires a written amendment.

### 28(3)(b): Confidentiality obligation on authorized persons

> Processor ensures that persons authorized to process the personal data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.

Practical implication: all employees and contractors with access to customer data must have signed an NDA or equivalent.

### 28(3)(c): Technical and organizational measures (Article 32)

> Processor shall take all measures required pursuant to Article 32 (security of processing).

This clause by reference incorporates your security obligations (encryption, access control, incident response). Often attached as an exhibit ("Technical and Organizational Measures" or "TOM Annex").

### 28(3)(d): Sub-processor restrictions

> Processor shall not engage another processor (sub-processor) without prior specific or general written authorization of the controller. Where general written authorization is used, the processor shall inform the controller of any intended changes concerning the addition or replacement of other processors.

Practical implication: most SaaS use "general written authorization" (blanket approval of the sub-processor list) with a notice period (typically 10-30 days) before adding a new sub-processor. Maintain and publish the sub-processor list (see `templates/sub-processor-list.md`).

### 28(3)(e): Controller access and assistance

> Processor shall assist the controller in ensuring compliance with the obligations pursuant to Articles 32 to 36, including DSARs, security assessments, and prior consultations.

Practical implication: you must have a process for responding to Data Subject Access Requests (DSARs) that your customers forward to you.

### 28(3)(f): Deletion or return on termination

> Processor deletes or returns all personal data to the controller at the end of the services relating to processing, and deletes existing copies unless Union or Member State law requires storage of the personal data.

Include deletion timeline (typically 30-90 days post-termination) and a confirmation certificate option.

### 28(3)(g): Audit cooperation

> Processor makes available to the controller all information necessary to demonstrate compliance and allows for and contributes to audits and inspections.

Enterprise customers will push for the right to conduct on-site audits. Negotiation pattern: offer a third-party audit report (SOC 2, ISO 27001) in lieu of direct audit rights; reserve direct audit rights for cause only.

### 28(3)(h): Notification of unlawful instructions

> Processor immediately informs the controller if, in its opinion, an instruction infringes this Regulation or other Union or Member State data protection provisions.

---

## DPA four-schedule structure

The canonical DPA has four schedules attached to the main agreement body:

| Schedule | Content |
|---|---|
| Schedule 1 — Processing details | Subject matter, duration, nature, purpose, type of personal data, categories of data subjects |
| Schedule 2 — Technical and Organizational Measures (TOMs) | Encryption standards, access controls, penetration testing cadence, incident response SLA |
| Schedule 3 — Sub-processor list | Name, country, service, data categories received (link to `templates/sub-processor-list.md`) |
| Schedule 4 — SCCs / Transfer mechanism | Include if cross-border transfers occur (see transfer mechanism section below) |

---

## International data transfer mechanism

**Key principle:** the GDPR transfer mechanism choice does NOT eliminate the GDPR Article 28 DPA requirement. Always have a DPA AND a transfer mechanism.

| Scenario | Transfer mechanism |
|---|---|
| US processor is DPF-certified | Reference DPF adequacy decision in Schedule 4; no SCCs needed |
| US processor is NOT DPF-certified | 2021 SCCs Module 2 (controller-to-processor) required in Schedule 4 |
| UK processor | UK Addendum to 2021 SCCs (ICO issued) |
| Processor in adequacy decision country (Japan, Canada, etc.) | No SCCs needed; reference adequacy decision |
| Brazil processor | No adequacy decision; SCCs (adapted) or equivalent protection assessment |

**Schrems III risk:** the DPF has been legally challenged. Include a clause stating that if the adequacy decision is invalidated, parties will execute SCCs within 30 days.

---

## DPA as data processor (your standard form)

When you are the processor (most SaaS), your standard DPA should:

1. Reference the controller's documented instructions (your ToS + DPA together)
2. Include all 8 Article 28(3) clauses
3. Include the four schedules, with Schedule 3 as a living document (your sub-processor list)
4. Include transfer mechanism (DPF or SCCs as appropriate for your server locations)
5. Specify breach notification timeline: 72 hours to notify the controller after becoming aware (GDPR Article 33)
6. Close with governing law and jurisdiction (typically the controller's choice or EU member state)

---

## The attorney-review invariant

DPAs have direct legal liability implications. Always close with:

> "This is a generated draft for reference. Have a qualified attorney review before countersigning any customer DPA."
