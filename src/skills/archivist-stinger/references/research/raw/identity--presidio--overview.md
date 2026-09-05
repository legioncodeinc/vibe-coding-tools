# Presidio (Analyzer, Anonymizer, and Supported Entities)
- URL: https://microsoft.github.io/presidio/ (redirected at fetch time to https://data-privacy-stack.github.io/presidio/; supplemented with https://data-privacy-stack.github.io/presidio/supported_entities/ and https://data-privacy-stack.github.io/presidio/anonymizer/ to cover the entity-type list and anonymization operators, which live on subpages rather than the index page)
- Fetched: 2026-09-05
- Source type: official-docs

## Note on the redirect

The requested URL, https://microsoft.github.io/presidio/, now serves a "This page has moved" redirect to https://data-privacy-stack.github.io/presidio/. Presidio is transitioning to a community-owned project under the "Data Privacy Stack" organization; the content below was fetched from that new canonical location, which is the direct continuation of the originally requested page. The GitHub README alternate (https://github.com/microsoft/presidio/blob/main/README.md) was also attempted and returned a fetch error, so the redirect target above was used instead.

## Presidio (index page)

Presidio (Origin from Latin praesidium 'protection, garrison') helps to ensure sensitive data is properly managed and governed. It provides fast identification and anonymization modules for private entities in text and images such as credit card numbers, names, locations, social security numbers, bitcoin wallets, US phone numbers, financial data and more.

Project transition update: Presidio is transitioning to a community-owned project.

### Goals

- Allow organizations to preserve privacy in a simpler way by democratizing de-identification technologies and introducing transparency in decisions.
- Embrace extensibility and customizability to a specific business need.
- Facilitate both fully automated and semi-automated PII de-identification flows on multiple platforms.

### Main features

1. Predefined or custom PII recognizers leveraging Named Entity Recognition, regular expressions, rule based logic and checksum with relevant context in multiple languages.
2. Options for connecting to external PII detection models.
3. Multiple usage options, from Python or PySpark workloads through Docker to Kubernetes.
4. Customizability in PII identification and anonymization.
5. Module for redacting PII text in images.

> Warning
> Presidio can help identify sensitive/PII data in un/structured text. However, because it is using automated detection mechanisms, there is no guarantee that Presidio will find all sensitive information. Consequently, additional systems and protections should be employed.

### Presidio's modules

1. **Presidio analyzer**: PII identification in text
2. **Presidio anonymizer**: De-identify detected PII entities using different operators
3. **Presidio image redactor**: Redact PII entities from images using OCR and PII identification
4. **Presidio structured**: PII identification in structured/semi-structured data

## Presidio Anonymizer: concepts

The Presidio anonymizer is a Python based module for anonymizing detected PII text entities with desired values. Presidio anonymizer supports both anonymization and deanonymization by applying different operators. Operators are built-in text manipulation classes which can be easily extended.

The Presidio-Anonymizer package contains both `Anonymizers` and `Deanonymizers`:

- **Anonymizers** are used to replace a PII entity text with some other value by applying a certain operator (e.g. replace, mask, redact, encrypt)
- **Deanonymizers** are used to revert the anonymization operation (e.g. to decrypt an encrypted text).

Simple example (Python):

```python
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import RecognizerResult, OperatorConfig

# Initialize the engine:
engine = AnonymizerEngine()

# Invoke the anonymize function with the text,
# analyzer results (potentially coming from presidio-analyzer) and
# Operators to get the anonymization output:
result = engine.anonymize(
    text="My name is Bond, James Bond",
    analyzer_results=[
        RecognizerResult(entity_type="PERSON", start=11, end=15, score=0.8),
        RecognizerResult(entity_type="PERSON", start=17, end=27, score=0.8),
    ],
    operators={"PERSON": OperatorConfig("replace", {"new_value": "BIP"})},
)

print(result)
```

Deanonymize example (decrypting an encrypted PII entity):

```python
from presidio_anonymizer import DeanonymizeEngine
from presidio_anonymizer.entities import OperatorResult, OperatorConfig

engine = DeanonymizeEngine()

result = engine.deanonymize(
    text="My name is S184CMt9Drj7QaKQ21JTrpYzghnboTF9pn/neN8JME0=",
    entities=[
        OperatorResult(start=11, end=55, entity_type="PERSON"),
    ],
    operators={"DEFAULT": OperatorConfig("decrypt", {"key": "WmZq4t7w!z%C&F)J"})},
)

print(result)
```

Presidio anonymizer can also run as an HTTP server (Docker: `docker run -p 5001:3000 presidio-anonymizer`, or `python app.py` from a clone of the repo). Example HTTP calls:

```
curl -XPOST http://localhost:3000/anonymize -H "Content-Type: application/json" -d @payload

payload example:
{
"text": "hello world, my name is Jane Doe. My number is: 034453334",
"anonymizers": {
    "PHONE_NUMBER": {
        "type": "mask",
        "masking_char": "*",
        "chars_to_mask": 4,
        "from_end": true
    }
},
"analyzer_results": [
    {"start": 24, "end": 32, "score": 0.8, "entity_type": "NAME"},
    {"start": 24, "end": 28, "score": 0.8, "entity_type": "FIRST_NAME"},
    {"start": 29, "end": 32, "score": 0.6, "entity_type": "LAST_NAME"},
    {"start": 48, "end": 57, "score": 0.95, "entity_type": "PHONE_NUMBER"}
]}

curl -XPOST http://localhost:3000/deanonymize -H "Content-Type: application/json" -d @payload

payload example:
{
"text": "My name is S184CMt9Drj7QaKQ21JTrpYzghnboTF9pn/neN8JME0=",
"deanonymizers": {
    "PERSON": {"type": "decrypt", "key": "WmZq4t7w!z%C&F)J"}
},
"anonymizer_results": [
    {"start": 11, "end": 55, "entity_type": "PERSON"}
]}
```

### Main classes

- The **AnonymizerEngine** is the main class in Presidio responsible for anonymizing PII entities in text. It uses the results from the AnalyzerEngine to perform the anonymization.
- The **DeanonymizeEngine** is responsible for deanonymizing text that has been anonymized by the AnonymizerEngine, given that the operation is reversible (e.g. encryption).
- An **Operator** is an object responsible for performing the anonymization operation on a PII entity. Presidio provides several built-in operators, such as Replace, Redact, and Encrypt, and allows users to create custom operators.
- The **BatchAnonymizerEngine** anonymizes PII entities in a batch of texts, using the AnonymizerEngine on each text in the batch.

## Built-in operators (replace, redact, hash, mask, and more)

| Operator type | Operator name | Description | Parameters |
| --- | --- | --- | --- |
| Anonymize | replace | Replace the PII with desired value | `new_value`: replaces existing text with the given value. If `new_value` is not supplied or empty, default behavior will be: `<entity_type>` e.g. `<PHONE_NUMBER>` |
| Anonymize | redact | Remove the PII completely from text | None |
| Anonymize | hash | Hashes the PII text using salted hashing for security | `hash_type`: sets the type of hashing, either `sha256` or `sha512` (default `sha256`). `salt`: optional salt for reproducible hashing; if not provided, a random salt is generated per entity to prevent brute-force attacks. To maintain referential integrity across records/calls, provide a consistent salt. |
| Anonymize | mask | Replace the PII with a given character | `chars_to_mask`: the amount of characters out of the PII that should be replaced. `masking_char`: the character to be replaced with. `from_end`: whether to mask the PII from its end. |
| Anonymize | encrypt | Encrypt the PII using a given key | `key`: a cryptographic key used for the encryption. |
| Anonymize | custom | Replace the PII with the result of the function executed on the PII | `lambda`: lambda to execute on the PII data; must return a string. |
| Anonymize | surrogate_ahds | Generate realistic, medically-appropriate surrogates using Azure Health Data Services de-identification service surrogation | `endpoint`, `entities`, `input_locale` (default "en-US"), `surrogate_locale` (default "en-US"); requires `pip install presidio-anonymizer[ahds]` |
| Anonymize | keep | Preserve the PII unmodified | None |
| Deanonymize | decrypt | Decrypt the encrypted PII in the text using the encryption key | `key`: the cryptographic key used for the encryption, also used for decryption. |

> Note: When performing anonymization, if the anonymizers map is empty or "DEFAULT" key is not stated, the default anonymization operator is "replace" for all entities. The replacing value will be the entity type, e.g. `<PHONE_NUMBER>`.

### Hash operator with salt for referential integrity

Starting from version 2.2.361, the hash operator uses random salt by default for security. This is a breaking change: hash outputs differ from previous versions, and the same PII value gets different hashes across different entities and calls unless a salt is provided. If the same hash is needed for the same value (referential integrity), a `salt` parameter must be explicitly provided; Presidio does not store or maintain stateful sessions, so users must securely manage and provide their own salt. Security considerations given: discard the salt after processing when possible; store it only if more data must be processed later for referential integrity (this increases re-identification risk); use secure storage (key vault / secrets manager) with strict access controls if a salt must be stored; use a salt of at least 128 bits (16 bytes), enforced by the operator; never include the salt in anonymized output; and for maximum security without referential-integrity needs, omit the salt parameter to use random per-entity salts.

### Handling overlaps between entities

- No overlap (single PII): Presidio Anonymizer uses the given or default anonymization operator to anonymize and replace the PII text entity.
- Full overlap of PII entity spans: the PII with the higher score is taken; between identical scores, selection is arbitrary.
- One PII contained in another: Presidio Anonymizer uses the PII with the larger text even if its score is lower.
- Partial intersection: each is anonymized individually and the result is a concatenation of the anonymized text.

## Supported PII entities (full list)

Presidio contains predefined recognizers for PII entities, using detection methods that combine pattern match, context, checksum, and (for some entities) custom logic or NER models. Presidio also allows adding custom entity recognizers.

### Global

| Entity Type | Description | Detection Method |
| --- | --- | --- |
| CREDIT_CARD | A credit card number is between 12 to 19 digits. | Pattern match and checksum |
| CRYPTO | A Crypto wallet number. Currently only Bitcoin address is supported | Pattern match, context and checksum |
| DATE_TIME | Absolute or relative dates or periods or times smaller than a day. | Pattern match and context |
| EMAIL_ADDRESS | An email address identifies an email box to which email messages are delivered | Pattern match, context and RFC-822 validation |
| IBAN_CODE | The International Bank Account Number (IBAN), an internationally agreed system of identifying bank accounts across national borders. | Pattern match, context and checksum |
| IP_ADDRESS | An Internet Protocol (IP) address (either IPv4 or IPv6). | Pattern match and context |
| MAC_ADDRESS | A Media Access Control (MAC) address, a unique identifier assigned to network interfaces. | Pattern match and context |
| NRP | A person's Nationality, religious or political group. | Custom logic and context |
| LOCATION | Name of politically or geographically defined location (cities, provinces, countries, international regions, bodies of water, mountains) | Custom logic and context |
| PERSON | A full person name, which can include first names, middle names or initials, and last names. | Custom logic and context |
| PHONE_NUMBER | A telephone number. The `PhoneRecognizer` can be extended programmatically for country-specific detection by configuring `supported_regions` and `supported_entity`. | Custom logic, pattern match and context |
| MEDICAL_LICENSE | Common medical license numbers. | Pattern match, context and checksum |
| URL | A URL (Uniform Resource Locator), unique identifier used to locate a resource on the Internet | Pattern match, context and top level url validation |

### USA

| Entity Type | Description | Detection Method |
| --- | --- | --- |
| US_BANK_NUMBER | A US bank account number is between 8 to 17 digits. | Pattern match and context |
| US_DRIVER_LICENSE | A US driver license. | Pattern match and context |
| US_ITIN | US Individual Taxpayer Identification Number (ITIN); nine digits starting with "9" and containing "7" or "8" as the 4th digit. | Pattern match and context |
| US_MBI | A US Medicare Beneficiary Identifier (MBI), 11 alphanumeric characters. | Pattern match and context |
| US_NPI | A US National Provider Identifier (NPI), a 10-digit number issued to healthcare providers by CMS under HIPAA. | Pattern match, context and checksum |
| US_PASSPORT | A US passport number with 9 digits. | Pattern match and context |
| US_SSN | A US Social Security Number (SSN) with 9 digits. | Pattern match and context |

### Other jurisdictions (abbreviated; full detail per country in the source page)

UK: UK_DRIVING_LICENCE, UK_NHS, UK_NINO, UK_PASSPORT, UK_POSTCODE, UK_VEHICLE_REGISTRATION.
Spain: ES_NIF, ES_NIE, ES_PASSPORT.
Italy: IT_FISCAL_CODE, IT_DRIVER_LICENSE, IT_VAT_CODE, IT_PASSPORT, IT_IDENTITY_CARD.
Poland: PL_PESEL.
Singapore: SG_NRIC_FIN, SG_UEN.
Australia: AU_ABN, AU_ACN, AU_TFN, AU_MEDICARE.
India: IN_PAN, IN_AADHAAR, IN_VEHICLE_REGISTRATION, IN_VOTER, IN_PASSPORT, IN_GSTIN.
Finland: FI_PERSONAL_IDENTITY_CODE.
Korea: KR_DRIVER_LICENSE, KR_FRN, KR_PASSPORT, KR_BRN, KR_RRN.
Nigeria: NG_NIN, NG_VEHICLE_REGISTRATION.
Philippines: PH_TIN.
Canada: CA_SIN.
Sweden: SE_ORGANISATIONSNUMMER, SE_PERSONNUMMER.
South Africa: ZA_ID_NUMBER.
Thailand: TH_TNIN.
Turkey: TR_NATIONAL_ID, TR_LICENSE_PLATE.
Germany: DE_TAX_ID, DE_TAX_NUMBER, DE_PASSPORT, DE_ID_CARD, DE_SOCIAL_SECURITY, DE_HEALTH_INSURANCE, DE_KFZ, DE_HANDELSREGISTER, DE_PLZ. (Each detected via pattern match plus context and, for many, a checksum specific to that country's identifier algorithm; several Germany entries cite their governing statute, e.g. DE_TAX_ID under Bundeszentralamt fur Steuern rules SS 139a-139e AO, and DE_PLZ is flagged as high false-positive risk, reliable only with address-context words present.)

### Medical / Clinical

Detected using the `MedicalNERRecognizer` (requires the `transformers` extra), using the blaze999/Medical-NER model by default:

| Entity Type | Description | Detection Method |
| --- | --- | --- |
| MEDICAL_DISEASE_DISORDER | A disease or disorder (e.g. diabetes, hypertension). | NER model (HuggingFace transformers) |
| MEDICAL_MEDICATION | A medication or drug name (e.g. metformin, aspirin). | NER model (HuggingFace transformers) |
| MEDICAL_THERAPEUTIC_PROCEDURE | A therapeutic or diagnostic procedure (e.g. surgery, MRI). | NER model (HuggingFace transformers) |
| MEDICAL_CLINICAL_EVENT | A clinical event (e.g. admission, discharge). | NER model (HuggingFace transformers) |
| MEDICAL_BIOLOGICAL_ATTRIBUTE | A biological attribute or measurement (e.g. blood pressure, BMI). | NER model (HuggingFace transformers) |
| MEDICAL_BIOLOGICAL_STRUCTURE | A biological or anatomical structure (e.g. liver, left ventricle). | NER model (HuggingFace transformers) |
| MEDICAL_FAMILY_HISTORY | A family medical history reference. | NER model (HuggingFace transformers) |
| MEDICAL_HISTORY | A patient medical history reference. | NER model (HuggingFace transformers) |

Presidio can also be complemented with Azure AI Language PII (cloud NLP PII detection) and Azure Health Data Services PHI (cloud NLP PHI detection), and supports connecting third-party PII detectors as external recognizers.

## Note on this excerpt

This excerpt combines Presidio's index page (project description, goals, main features, module list) with the full supported-entities table (Global plus USA reproduced verbatim; other jurisdictions' entity IDs listed for completeness with representative detail rather than every row's full description text, to keep this excerpt a reasonable size) and the full Anonymizer page (concepts, Python and HTTP examples, main classes, the complete built-in operators table, the hash-salt security notes, and the entity-overlap handling rules). Not fetched as part of this excerpt: the Presidio Analyzer's own dedicated page (architecture of recognizers/NlpEngine beyond what is summarized on the index page), the Image Redactor and Structured modules' dedicated pages, and the "Adding a custom PII entity" / "Connecting to 3rd party PII detectors" how-to pages (linked but not followed).
